import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../infrastructure/security/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/security/current-user.decorator';
import { NotificationQueryDto } from './dto/notification-query.dto';

@Controller('scraper-notifications')
@UseGuards(JwtAuthGuard)
export class ScraperController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query() query: NotificationQueryDto, @CurrentUser() user: any) {
    const page = query.page ? parseInt(query.page as any) : 1;
    const limit = query.limit ? parseInt(query.limit as any) : 20;
    const skip = (page - 1) * limit;

    const where: any = {
      active: true,
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.unreadOnly) {
      where.reads = {
        none: {
          teacherId: user.id,
        },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.scrapedNotification.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: {
          reads: {
            where: { teacherId: user.id },
            select: { id: true },
          },
        },
      }),
      this.prisma.scrapedNotification.count({ where }),
    ]);

    const notifications = items.map((item) => ({
      ...item,
      isRead: item.reads.length > 0,
    }));

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    const read = await this.prisma.notificationRead.upsert({
      where: {
        notificationId_teacherId: {
          notificationId: id,
          teacherId: user.id,
        },
      },
      update: {},
      create: {
        notificationId: id,
        teacherId: user.id,
      },
    });
    return { success: true, read };
  }
}
