import { Controller, Post, Get, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { SendMessageDto } from '../presentation/dtos/send-message.dto';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { IMessageRepository } from '../domain/repositories/message.repository.interface';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../domain/entities/user.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    @Inject(IMessageRepository)
    private readonly messageRepository: IMessageRepository,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  sendMessage(
    @Body() dto: SendMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.sendMessageUseCase.execute(user.sub, dto, user.institutionId);
  }

  @Post('share-document')
  async shareDocument(
    @Body() body: { url: string; documentType: string; documentName: string },
    @CurrentUser() user: any,
  ) {
    // Encontrar os ADMINS e Diretores da instituição
    const admins = await this.prisma.user.findMany({
      where: {
        institutionId: user.institutionId,
        role: { in: [Role.ADMIN, Role.SUPER_ADMIN] }
      }
    });

    const content = `Olá! Partilhei o seguinte documento para sua análise/visto pedagógico:\n\n**Tipo:** ${body.documentType}\n**Referência:** ${body.documentName}\n\n[Visualizar Documento (PDF)](${body.url})`;

    const promises = admins.map(admin => 
      this.sendMessageUseCase.execute(
        user.sub,
        { receiverId: admin.id, content },
        user.institutionId
      )
    );

    await Promise.all(promises);
    return { success: true, count: admins.length };
  }

  @Get('contacts')
  async getContacts(@CurrentUser() user: any) {
    const allowedUserIds = new Set<string>();

    const admins = await this.prisma.user.findMany({
      where: { institutionId: user.institutionId, role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } },
      select: { id: true }
    });
    admins.forEach(a => allowedUserIds.add(a.id));

    const teachers = await this.prisma.user.findMany({
      where: { institutionId: user.institutionId, role: Role.TEACHER },
      select: { id: true }
    });
    teachers.forEach(t => allowedUserIds.add(t.id));

    if (user.role === Role.TEACHER) {
      const teacherWithClasses = await this.prisma.user.findUnique({
        where: { id: user.sub },
        include: {
          classesTeaching: {
            include: {
              enrollments: {
                include: {
                  student: {
                    include: { parent: true }
                  }
                }
              }
            }
          }
        }
      });

      if (teacherWithClasses?.classesTeaching) {
        teacherWithClasses.classesTeaching.forEach(cls => {
          cls.enrollments.forEach(enr => {
            if (enr.student) {
              allowedUserIds.add(enr.student.id);
              if (enr.student.parent) {
                allowedUserIds.add(enr.student.parent.id);
              }
            }
          });
        });
      }
    }

    const unreadMessages = await this.prisma.message.findMany({
      where: { receiverId: user.sub, read: false },
      select: { senderId: true }
    });
    const unreadSenders = new Set(unreadMessages.map(m => m.senderId));

    const contacts = await this.prisma.user.findMany({
      where: {
        id: { 
          in: Array.from(allowedUserIds),
          not: user.sub 
        }
      },
      select: { id: true, name: true, role: true }
    });

    return contacts.map(c => ({
      ...c,
      hasUnread: unreadSenders.has(c.id)
    }));
  }

  @Get('inbox')
  getInbox(@CurrentUser() user: any) {
    return this.messageRepository.findInbox(user.sub);
  }

  @Get('conversation/:userId')
  getConversation(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    return this.messageRepository.findConversation(user.sub, userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.messageRepository.markAsRead(id);
  }
}
