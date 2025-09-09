import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailService } from '../../services/email.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtStrategy],
})
export class AuthModule {}
