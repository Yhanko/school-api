import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../presentation/controllers/auth.controller';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { JwtTokenService } from '../infrastructure/services/jwt-token.service';
import { BcryptHashService } from '../infrastructure/services/bcrypt-hash.service';
import { PrismaUserRepository } from '../infrastructure/database/prisma-user.repository';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { IHashService } from '../application/interfaces/hash.service.interface';
import { ITokenService } from '../application/interfaces/token.service.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from '../infrastructure/security/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IHashService,
      useClass: BcryptHashService,
    },
    {
      provide: ITokenService,
      useClass: JwtTokenService,
    },
    JwtStrategy,
  ],
})
export class AuthModule {}
