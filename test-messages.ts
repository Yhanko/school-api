import { NestFactory } from '@nestjs/core';
import { AppModule } from 'c:/p/yhanko/yhankoEduca/school-api/src/app.module';
import { SmsService } from 'c:/p/yhanko/yhankoEduca/school-api/src/sms/sms.service';
import { WhatsappService } from 'c:/p/yhanko/yhankoEduca/school-api/src/whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';
import { BrevoEmailProvider } from 'c:/p/yhanko/yhankoEduca/school-api/src/email/providers/brevo.provider';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('TestMessages');
  logger.log('Bootstrapping application context...');
  
  // Create a standalone application context (no HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const smsService = app.get(SmsService);
  const whatsappService = app.get(WhatsappService);
  // Resolve Brevo provider through ConfigService (or standard injection if available)
  const configService = app.get(ConfigService);
  const emailProvider = new BrevoEmailProvider(configService);

  const testPhone = '943558106'; // Or +244943558106
  const testEmail = 'romeucajamba@gmail.com';
  const testInstitution = 'YhankoEduca (Teste)';

  logger.log('1. A testar envio de Email...');
  try {
    await emailProvider.sendEmail(
      testEmail,
      'Teste de Integração YhankoEduca',
      '<h1>Olá!</h1><p>Este é um email de teste disparado pelo sistema para confirmar a integração do Brevo.</p>'
    );
    logger.log('✅ Email enviado com sucesso!');
  } catch (err: any) {
    logger.error('❌ Falha ao enviar Email', err.message);
  }

  logger.log('2. A testar envio de SMS...');
  try {
    await smsService.sendBulkSms(
      testInstitution,
      'Teste',
      'Esta e uma SMS de teste para confirmar a integracao do Ombala.',
      [testPhone]
    );
    logger.log('✅ SMS enviado/processado com sucesso!');
  } catch (err: any) {
    logger.error('❌ Falha ao enviar SMS', err.message);
  }

  logger.log('3. A testar envio de WhatsApp...');
  try {
    await whatsappService.sendBulkWhatsapp({
      institutionName: testInstitution,
      message: 'Olá! Esta é uma mensagem de teste disparada pelo sistema para confirmar a integração do WhatsApp via Twilio.',
      phoneNumbers: [`+244${testPhone}`]
    });
    logger.log('✅ WhatsApp enviado/processado com sucesso!');
  } catch (err: any) {
    logger.error('❌ Falha ao enviar WhatsApp', err.message);
  }

  logger.log('Testes concluídos. A encerrar contexto...');
  await app.close();
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
