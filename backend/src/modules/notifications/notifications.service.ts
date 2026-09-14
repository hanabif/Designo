import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(userId: string, notificationIds?: string[]) {
    if (notificationIds?.length) {
      await this.prisma.notification.updateMany({
        where: { userId, id: { in: notificationIds } },
        data: { isRead: true },
      });
    } else {
      await this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    }
    return { success: true };
  }

  async createNotification(userId: string, type: NotificationType, title: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, type, title, message },
    });
  }
}
