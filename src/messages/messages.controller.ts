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
      where: { institutionId: user.institutionId, role: { in: [Role.ADMIN, Role.SUPER_ADMIN, Role.SECRETARY] } },
      select: { id: true }
    });
    admins.forEach(a => allowedUserIds.add(a.id));

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
    } else if (user.role === Role.STUDENT) {
      const studentData = await this.prisma.user.findUnique({
        where: { id: user.sub },
        include: {
          parent: true,
          enrollments: {
            where: { status: 'active' },
            include: {
              class: {
                include: {
                  teachers: true,
                  enrollments: {
                    where: { status: 'active' },
                    include: { student: true }
                  }
                }
              }
            }
          }
        }
      });

      if (studentData) {
        if (studentData.parent) allowedUserIds.add(studentData.parent.id);
        studentData.enrollments.forEach(enr => {
          if (enr.class) {
            enr.class.teachers.forEach(t => allowedUserIds.add(t.id));
            enr.class.enrollments.forEach(ce => {
              if (ce.student) allowedUserIds.add(ce.student.id);
            });
          }
        });
      }
    } else {
      const teachers = await this.prisma.user.findMany({
        where: { institutionId: user.institutionId, role: Role.TEACHER },
        select: { id: true }
      });
      teachers.forEach(t => allowedUserIds.add(t.id));
      
      const students = await this.prisma.user.findMany({
        where: { institutionId: user.institutionId, role: Role.STUDENT },
        select: { id: true }
      });
      students.forEach(s => allowedUserIds.add(s.id));
    }

    const unreadMessages = await this.prisma.message.groupBy({
      by: ['senderId'],
      where: { receiverId: user.sub, read: false },
      _count: { id: true }
    });
    const unreadMap = new Map(unreadMessages.map(u => [u.senderId, u._count.id]));

    const contacts = await this.prisma.user.findMany({
      where: {
        id: { 
          in: Array.from(allowedUserIds),
          not: user.sub 
        }
      },
      select: { id: true, name: true, role: true }
    });

    const inbox = await this.messageRepository.findInbox(user.sub);
    const inboxMap = new Map(inbox.map(i => [i.contact.id, i]));

    return contacts.map(c => {
      const inboxData = inboxMap.get(c.id);
      return {
        id: c.id,
        nome: c.name,
        tipo: c.role.toLowerCase(),
        ultimaMensagem: inboxData?.lastMessage?.content || '',
        hora: inboxData?.lastMessage?.createdAt || '',
        naoLidas: unreadMap.get(c.id) || 0,
        online: false
      };
    });
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

  @Patch('conversation/:userId/read')
  async markConversationAsRead(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    await this.prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: user.sub,
        read: false,
      },
      data: { read: true },
    });
    return { success: true };
  }
}
