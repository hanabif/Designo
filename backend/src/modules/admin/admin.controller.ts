import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppAuthGuard } from '../../common/guards/app-auth.guard.js';
import { AdminService } from './admin.service.js';

@Controller('admin')
@UseGuards(AppAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('stats')
  getStats() {
    return this.adminService.getPlatformStats();
  }
}
