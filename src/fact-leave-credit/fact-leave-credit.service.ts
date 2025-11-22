import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateFactLeaveCreditDto } from './dto/create-fact-leave-credit.dto';
import { UpdateFactLeaveCreditDto } from './dto/update-fact-leave-credit.dto';
import { UserMock } from 'src/mock/user.mock';

export interface FactLeaveCreditResult {
  leave_credit_id?: number;
  user_id: number;
  leave_type_id: number;
  used_leave: number;
  annual_leave: number;
  left_leave: number;
  skip?: boolean;
}

@Injectable()
export class FactLeaveCreditService {
  constructor(private prisma: PrismaService) {}

  // helper: หาเพศจาก prefix
  private getGenderFromPrefix(prefix: string): 'male' | 'female' {
    if (prefix === 'นาย') return 'male';
    return 'female';
  }

  // helper: อายุงานเป็นปี
  private calculateServiceYear(startDate: string) {
    const start = new Date(startDate);
    const now = new Date();
    return (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
  }

  // helper: คำนวณสิทธิลาพักผ่อน
  private async calculateAnnual(startDate: string | null) {
    if (!startDate) return 0;
    const serviceYears = this.calculateServiceYear(startDate);
    const rules = await this.prisma.vacation_rule.findMany();

    const matched = rules
      .filter((r) => r.service_year <= serviceYears)
      .sort((a, b) => b.service_year - a.service_year)[0];

    return matched ? matched.annual_leave : 0;
  }

  async createAllLeaveCreditForOneUser(dto: CreateFactLeaveCreditDto) {
    const user = UserMock.list.find((u) => u.id === dto.user_id);
    if (!user) throw new Error('User not found');

    // 1) หาเพศจาก prefix
    const gender = this.getGenderFromPrefix(user.prefix);

    // 2) คำนวณอายุงาน
    const serviceYear = this.calculateServiceYear(user.employment_start_date);

    // 3) ดึง leave types ทั้งหมด
    const leaveTypes = await this.prisma.leave_type.findMany();

    // 4) Filter เงื่อนไข leave type
    const allowedTypes = leaveTypes.filter((lt) => {
      if (lt.gender !== 'all' && lt.gender !== gender) return false;
      if (serviceYear < lt.service_year) return false;
      return true;
    });

    // 5) คำนวณสิทธิลาพักผ่อน
    const annual = await this.calculateAnnual(user.employment_start_date);

    const results: FactLeaveCreditResult[] = [];

    for (const lt of allowedTypes) {
      // ❗ เช็คว่ามีอยู่ใน fact_leave_credit แล้วไหม
      const exist = await this.prisma.fact_leave_credit.findFirst({
        where: {
          user_id: dto.user_id,
          leave_type_id: lt.leave_type_id,
        },
      });

      if (exist) {
        // ถ้ามีแล้วข้าม
        continue;
      }

      // 6) สร้างใหม่
      const record = await this.prisma.fact_leave_credit.create({
        data: {
          user_id: dto.user_id,
          leave_type_id: lt.leave_type_id,
          used_leave: 0,
          annual_leave: lt.category === 'vacation' ? annual : 0,
          left_leave: lt.category === 'vacation' ? annual : lt.max_leave,
        },
      });

      results.push(record);
    }

    return results;
  }

  async createForAll() {
    // 1) ดึง leave type ทั้งหมดมาก่อน
    const leaveTypes = await this.prisma.leave_type.findMany();

    // 2) user_ids ทั้งหมดจาก mock
    const users = UserMock.list;
    const userIds = users.map((u) => u.id);

    // 3) ดึง fact_leave_credit ที่มีอยู่แล้วทั้งหมดของ user พวกนี้
    const existingCredits = await this.prisma.fact_leave_credit.findMany({
      where: {
        user_id: { in: userIds },
      },
      select: {
        user_id: true,
        leave_type_id: true,
      },
    });

    // เอาไว้เช็คเร็ว ๆ ว่าคู่ (user_id, leave_type_id) มีแล้วไหม
    const existingSet = new Set(existingCredits.map((c) => `${c.user_id}-${c.leave_type_id}`));

    const payload: {
      user_id: number;
      leave_type_id: number;
      annual_leave: number;
      used_leave: number;
      left_leave: number;
    }[] = [];

    // 4) วนทุก user
    for (const user of users) {
      const gender = this.getGenderFromPrefix(user.prefix);
      const serviceYear = this.calculateServiceYear(user.employment_start_date);
      const annual = await this.calculateAnnual(user.employment_start_date);

      // เลือก leave type ที่ user คนนี้มีสิทธิ
      const allowedTypes = leaveTypes.filter((lt) => {
        // gender rule
        if (lt.gender !== 'all' && lt.gender !== gender) return false;
        // service_year rule
        if (serviceYear < lt.service_year) return false;
        return true;
      });

      // 5) วนตาม leave type ที่อนุญาตของ user คนนี้
      for (const lt of allowedTypes) {
        const key = `${user.id}-${lt.leave_type_id}`;

        // ถ้ามีอยู่แล้วใน fact_leave_credit → ข้าม
        if (existingSet.has(key)) continue;

        payload.push({
          user_id: user.id,
          leave_type_id: lt.leave_type_id,
          annual_leave: lt.category === 'vacation' ? annual : 0,
          used_leave: 0,
          left_leave: lt.category === 'vacation' ? annual : lt.max_leave,
        });

        // เพิ่มลง set ด้วย กันสร้างซ้ำซ้อนในรันเดียวกัน
        existingSet.add(key);
      }
    }

    const result = await this.prisma.fact_leave_credit.createMany({
      data: payload,
    });

    console.log('result', result);

    // ดึงทั้งหมดที่เพิ่งสร้าง (ตาม user_id + leave_type_id)
    const created = await this.prisma.fact_leave_credit.findMany({
      where: {
        OR: payload.map((p) => ({
          user_id: p.user_id,
          leave_type_id: p.leave_type_id,
        })),
      },
      include: { leave_type: true },
    });

    return created;
  }

  async findByUserId(user_id: number) {
    return await this.prisma.fact_leave_credit.findMany({
      where: {
        user_id,
      },
      include: {
        leave_type: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.fact_leave_credit.findMany({
      include: { leave_type: true },
    });
  }

  async findOne(user_id: number, leave_type_id: number) {
    return await this.prisma.fact_leave_credit.findUnique({
      where: {
        user_id_leave_type_id: {
          user_id,
          leave_type_id,
        },
      },
      include: { leave_type: true },
    });
  }

  async update(user_id: number, dtos: UpdateFactLeaveCreditDto[]) {
    const results: FactLeaveCreditResult[] = [];

    if (!dtos) {
      throw new Error(`No data to update`);
    }

    for (const dto of dtos) {
      const leaveTypeId = dto.leave_type_id;

      // 1) หาของเดิม
      let record = await this.prisma.fact_leave_credit.findUnique({
        where: {
          user_id_leave_type_id: {
            user_id,
            leave_type_id: leaveTypeId,
          },
        },
      });

      // 2) ถ้าไม่เจอ -> สร้าง record ใหม่เฉพาะ leave_type นี้
      if (!record) {
        const leaveType = await this.prisma.leave_type.findUnique({
          where: { leave_type_id: leaveTypeId },
        });

        if (!leaveType) continue;

        // คำนวณสิทธิลาพักร้อนถ้าจำเป็น
        const user = UserMock.list.find((u) => u.id === user_id);
        if (!user) {
          throw new Error(`User with id ${user_id} not found in UserMock`);
        }

        const annual = await this.calculateAnnual(user.employment_start_date);

        // max leave ถ้าไม่ใช่ vacation
        const defaultLeft = leaveType.category === 'vacation' ? annual : leaveType.max_leave;

        // สร้าง record ใหม่เฉพาะ leave_type นี้
        record = await this.prisma.fact_leave_credit.create({
          data: {
            user_id,
            leave_type_id: leaveTypeId,
            used_leave: 0,
            annual_leave: leaveType.category === 'vacation' ? annual : 0,
            left_leave: defaultLeft,
          },
        });

        await this.createAllLeaveCreditForOneUser({ user_id });
      }

      // 3) คำนวณค่าใหม่
      const newAnnual = dto.annual_used_leave
        ? record.annual_leave - dto.annual_used_leave
        : record.annual_leave;

      const newUsed = dto.used_leave ? record.used_leave + dto.used_leave : record.used_leave;

      const newLeft = dto.used_leave ? record.left_leave - dto.used_leave : record.left_leave;

      // 4) update record
      const updated = await this.prisma.fact_leave_credit.update({
        where: {
          user_id_leave_type_id: {
            user_id,
            leave_type_id: leaveTypeId,
          },
        },
        data: {
          annual_leave: newAnnual,
          used_leave: newUsed,
          left_leave: newLeft,
        },
      });

      results.push(updated);
    }

    return results;
  }

  async remove(user_id: number, leave_type_id: number) {
    return await this.prisma.fact_leave_credit.delete({
      where: {
        user_id_leave_type_id: {
          user_id,
          leave_type_id,
        },
      },
    });
  }

  async updateEditLeave(user_id: number, leave_type_id: number, oldDay: number, newDay: number) {
    const record = await this.prisma.fact_leave_credit.findUnique({
      where: { user_id_leave_type_id: { user_id, leave_type_id } },
    });

    if (!record) throw new Error('can not find fact_leave_credit');

    let new_used_leave = 0;
    let new_left_leave = 0;

    if (record.used_leave == 0) {
      new_used_leave = newDay;
      new_left_leave = record.left_leave - newDay;
    } else {
      new_used_leave = record.used_leave - oldDay + newDay;
      new_left_leave = record.left_leave + oldDay - newDay;
    }

    return this.prisma.fact_leave_credit.update({
      where: { user_id_leave_type_id: { user_id, leave_type_id } },
      data: {
        used_leave: new_used_leave,
        left_leave: new_left_leave,
      },
    });
  }
}
