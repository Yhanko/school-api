import { Controller, Post, Get, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { SendMessageDto } from '../presentation/dtos/send-message.dto';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { IMessageRepository } from '../domain/repositories/message.repository.interface';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    @Inject(IMessageRepository)
    private readonly messageRepository: IMessageRepository,
  ) {}

  @Post()
  sendMessage(
    @Body() dto: SendMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.sendMessageUseCase.execute(user.sub, dto, user.institutionId);
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
