import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { LeaveVisibilityService } from './leave-visibility.service';
import { CreateLeaveVisibilityDto } from './dto/create-leave-visibility.dto';
import { UpdateLeaveVisibilityDto } from './dto/update-leave-visibility.dto';

@Controller('leave-visibility')
export class LeaveVisibilityController {
  constructor(private readonly leaveVisibilityService: LeaveVisibilityService) {}

  /**
   * ใช้ทั้งกรณีที่ 1, 2, 3, 4
   * body => { viewer_user_ids: number[], target_user_ids: number[], action: 'grant' | 'revoke', created_by_user_id? }
   */
  @Post()
  create(@Body() createLeaveVisibilityDto: CreateLeaveVisibilityDto) {
    return this.leaveVisibilityService.create(createLeaveVisibilityDto);
  }

  @Get()
  findAll() {
    return this.leaveVisibilityService.findAll();
  }
  @Get('config')
  getConfig() {
    return this.leaveVisibilityService.getConfig();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaveVisibilityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveVisibilityDto: UpdateLeaveVisibilityDto,
  ) {
    return this.leaveVisibilityService.update(id, updateLeaveVisibilityDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaveVisibilityService.remove(id);
  }

  // ======== helper endpoint เพิ่มเติม เอาไว้ใช้หน้า calendar / admin ========

  // ดึงว่า viewer คนนี้เห็นใครบ้าง
  @Get('viewer/:viewer_user_id')
  findTargetsForViewer(@Param('viewer_user_id', ParseIntPipe) viewer_user_id: number) {
    return this.leaveVisibilityService.findTargetsForViewer(viewer_user_id);
  }

  // ดึงว่าใครบ้างเห็น user นี้
  @Get('target/:target_user_id')
  findViewersForTarget(@Param('target_user_id', ParseIntPipe) target_user_id: number) {
    return this.leaveVisibilityService.findViewersForTarget(target_user_id);
  }

  // เช็คแบบจุด ๆ ว่า viewer คนนี้เห็น target คนนี้ไหม (true/false)
  @Get('can-view/:viewer_user_id/:target_user_id')
  async canViewerSeeTarget(
    @Param('viewer_user_id', ParseIntPipe) viewer_user_id: number,
    @Param('target_user_id', ParseIntPipe) target_user_id: number,
  ) {
    const canView = await this.leaveVisibilityService.canViewerSeeTarget(
      viewer_user_id,
      target_user_id,
    );
    return { viewer_user_id, target_user_id, canView };
  }

  @Put('config')
  async saveConfig(
    @Body()
    body: {
      viewers: number[];
      targets: number[];
    },
  ) {
    await this.leaveVisibilityService.saveConfig(body.viewers, body.targets);
    return { success: true };
  }
}
