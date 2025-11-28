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
  @Get('viewer/:viewer_nontri_account')
  findTargetsForViewer(@Param('viewer_nontri_account') viewer_nontri_account: string) {
    return this.leaveVisibilityService.findTargetsForViewer(viewer_nontri_account);
  }

  // ดึงว่าใครบ้างเห็น user นี้
  @Get('target/:target_nontri_account')
  findViewersForTarget(@Param('target_nontri_account') target_nontri_account: string) {
    return this.leaveVisibilityService.findViewersForTarget(target_nontri_account);
  }

  // เช็คแบบจุด ๆ ว่า viewer คนนี้เห็น target คนนี้ไหม (true/false)
  @Get('can-view/:viewer_nontri_account/:target_nontri_account')
  async canViewerSeeTarget(
    @Param('viewer_nontri_account') viewer_nontri_account: string,
    @Param('target_nontri_account') target_nontri_account: string,
  ) {
    const canView = await this.leaveVisibilityService.canViewerSeeTarget(
      viewer_nontri_account,
      target_nontri_account,
    );
    return { viewer_nontri_account, target_nontri_account, canView };
  }

  @Put('config')
  async saveConfig(
    @Body()
    body: {
      viewers: string[];
      targets: string[];
    },
  ) {
    await this.leaveVisibilityService.saveConfig(body.viewers, body.targets);
    return { success: true };
  }
}
