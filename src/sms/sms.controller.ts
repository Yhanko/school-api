import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming JWT is used
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

export class SendSmsDto {
  institutionName: string;
  subject: string;
  message: string;
  phoneNumbers: string[];
}

@ApiTags('SMS')
@ApiBearerAuth()
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  @ApiOperation({ summary: 'Send SMS to multiple numbers' })
  async sendSms(@Body() body: SendSmsDto) {
    await this.smsService.sendBulkSms(
      body.institutionName,
      body.subject,
      body.message,
      body.phoneNumbers,
    );
    return { success: true, message: 'SMS sending process started.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('contacts')
  @ApiOperation({ summary: 'Get a list of users with phone numbers' })
  async getContacts(@Request() req) {
    return this.smsService.getContacts(req.user.institutionId);
  }
}
