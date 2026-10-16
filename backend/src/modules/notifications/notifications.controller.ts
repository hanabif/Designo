import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { AppAuthGuard } from '../../common/guards/app-auth.guard.js';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
@UseGuards(AppAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch('read')
  markRead(@CurrentUser('id') userId: string, @Body('notificationIds') notificationIds?: string[]) {
    return this.notificationsService.markAsRead(userId, notificationIds);
  }
}
