import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminCronService } from './super-admin-cron.service';
import { SuperAdminFeaturesService } from './super-admin-features.service';
import { GlobalSettingsController } from './global-settings.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { SmsModule } from '../sms/sms.module';
import { BcryptHashService } from '../infrastructure/services/bcrypt-hash.service';
import { IHashService } from '../application/interfaces/hash.service.interface';

@Module({
  imports: [PrismaModule, SmsModule, JwtModule.register({ secret: process.env.JWT_SECRET || 'fallback_secret' })],
  controllers: [SuperAdminController, GlobalSettingsController],
  providers: [
    SuperAdminService,
    SuperAdminCronService,
    SuperAdminFeaturesService,
    {
      provide: IHashService,
      useClass: BcryptHashService,
    },
  ],
})
export class SuperAdminModule {}

