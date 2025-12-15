import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { calendar_calendar_type } from '@prisma/client';
import { CreateCalendarDto, CalendarTypeEnum } from './dto/create-calendar.dto';

export interface CalendarResponse {
  id: number;
  calendarType: CalendarTypeEnum;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  dayCount: number;
  isHoliday: boolean | null;
  createAt: Date;
  updateAt: Date;
}

interface CalendarRow {
  calendar_id: number;
  calendar_type: calendar_calendar_type;
  title: string;
  start_date: Date;
  end_date: Date;
  total_day: number;
  description: string | null;
  is_holiday: boolean | null;
  update_at: Date;
  create_at: Date;
}

interface UpdateCalendarInput {
  calendarType?: CalendarTypeEnum;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isHoliday?: boolean;
}

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  private calcTotalDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const oneDayMs = 1000 * 60 * 60 * 24;
    return Math.floor(diffMs / oneDayMs) + 1;
  }

  private mapCalendar(c: CalendarRow): CalendarResponse {
    return {
      id: c.calendar_id,
      calendarType: c.calendar_type as CalendarTypeEnum,
      title: c.title,
      description: c.description,
      isHoliday: c.is_holiday,
      startDate: c.start_date.toISOString().slice(0, 10),
      endDate: c.end_date.toISOString().slice(0, 10),
      dayCount: c.total_day,
      createAt: c.create_at,
      updateAt: c.update_at,
    };
  }

  async findAll(): Promise<CalendarResponse[]> {
    const rows = await this.prisma.calendar.findMany({
      orderBy: { start_date: 'desc' },
    });

    return rows.map((c) => this.mapCalendar(c as CalendarRow));
  }

  async findOne(id: number): Promise<CalendarResponse> {
    const c = await this.prisma.calendar.findUnique({
      where: { calendar_id: id },
    });

    if (!c) {
      throw new NotFoundException('ไม่พบกำหนดการ');
    }

    return this.mapCalendar(c as CalendarRow);
  }

  async create(dto: CreateCalendarDto): Promise<CalendarResponse> {
    const totalDay = this.calcTotalDays(dto.startDate, dto.endDate);
    const now = new Date();

    const created = await this.prisma.calendar.create({
      data: {
        calendar_type: dto.calendarType as calendar_calendar_type,
        title: dto.title,
        start_date: new Date(dto.startDate),
        end_date: new Date(dto.endDate),
        total_day: totalDay,
        description: dto.description ?? null,
        is_holiday: dto.isHoliday ?? null,
        create_at: now,
        update_at: now,
      },
    });

    return this.mapCalendar(created as CalendarRow);
  }

  async update(id: number, dto: UpdateCalendarInput): Promise<CalendarResponse> {
    const existing = await this.prisma.calendar.findUnique({
      where: { calendar_id: id },
    });

    if (!existing) {
      throw new NotFoundException('ไม่พบกำหนดการ');
    }
    const startDate =
      dto.startDate && dto.startDate.length > 0
        ? dto.startDate
        : existing.start_date.toISOString().slice(0, 10);

    const endDate =
      dto.endDate && dto.endDate.length > 0
        ? dto.endDate
        : existing.end_date.toISOString().slice(0, 10);

    const totalDay = this.calcTotalDays(startDate, endDate);

    const updated = await this.prisma.calendar.update({
      where: { calendar_id: id },
      data: {
        calendar_type:
          dto.calendarType !== undefined
            ? (dto.calendarType as calendar_calendar_type)
            : existing.calendar_type,
        title: dto.title ?? existing.title,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        total_day: totalDay,
        description: dto.description ?? existing.description,
        is_holiday: dto.isHoliday !== undefined ? dto.isHoliday : existing.is_holiday,
        update_at: new Date(),
      },
    });

    return this.mapCalendar(updated as CalendarRow);
  }

  async remove(id: number): Promise<{ success: true }> {
    await this.prisma.calendar.delete({
      where: { calendar_id: id },
    });
    return { success: true };
  }

  async findHolidayYears(year: number) {
    const startOfYear = new Date();
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    const holidays = await this.prisma.calendar.findMany({
      where: {
        calendar_type: 'holiday',
        start_date: { gte: startOfYear },
        end_date: { lte: endOfYear },
      },
      orderBy: { start_date: 'asc' },
    });

    return holidays;
  }
}
