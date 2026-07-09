import { Module, Global } from '@nestjs/common';
import { ActivityLoggerService } from './activity-logger.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [ActivityLoggerService],
  exports: [ActivityLoggerService],
})
export class ActivityLoggerModule {}
