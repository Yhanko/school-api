import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

export class SendEmailDto {
  institutionName: string;
  subject: string;
  message: string;
  emails: string[];
}

@ApiTags('Email')
@ApiBearerAuth()
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  @ApiOperation({ summary: 'Send Email to multiple addresses' })
  async sendEmail(@Body() body: SendEmailDto, @Request() req: any) {
    await this.emailService.sendBulkEmail(
      body.institutionName,
      body.subject,
      body.message,
      body.emails,
      req.user?.institutionId,
    );
    return { success: true, message: 'Processo de envio de email iniciado.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('contacts')
  @ApiOperation({ summary: 'Get a list of students and parents with emails' })
  async getContacts(@Request() req: any) {
    return this.emailService.getContacts(req.user.institutionId);
  }
}
