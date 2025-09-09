import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateNumericCode } from '../../utils/utils';
import { MailService } from '../../services/email.service';
import { SendPasswordEmailDto } from './dto/send-password-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';
import { User } from '../users/users.model';
import { UserRole, UserType } from '../users/enums/user.enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const existingUser = await this.usersService.isEmailTaken(
      registerUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    registerUserDto.password = await bcrypt.hash(
      registerUserDto.password,
      salt,
    );

    const newUser = new User();

    newUser.email = registerUserDto.email;
    newUser.first_name = registerUserDto.first_name;
    newUser.last_name = registerUserDto.last_name;
    newUser.password = registerUserDto.password;
    newUser.role = UserRole.USER;
    newUser.type = UserType.CLIENT;
    newUser.isEmailVerified = false;

    const user = await newUser.save();

    const verificationCode = generateNumericCode(6);
    await this.usersService.saveVerificationCode(user.id, verificationCode);

    await this.mailService.sendMail(
      user.email,
      'Email Verification',
      `Your verification code is ${verificationCode}`,
    );

    return { message: 'Verification email sent' };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersService.findByEmail(verifyEmailDto.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      verifyEmailDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      await this.usersService.verifyEmail(user.id, verifyEmailDto.code);
      return { message: 'Email verified successfully' };
    } catch {
      throw new BadRequestException('Invalid verification code');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        type: user.type,
      },
      token,
    };
  }

  async me(currentUser: User) {
    const user = await this.usersService.findById(currentUser.id, currentUser);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      type: user.type,
    };
  }

  async resendVerificationCode(
    resendVerificationCode: ResendVerificationCodeDto,
  ) {
    const user = await this.usersService.findByEmail(
      resendVerificationCode.email,
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      resendVerificationCode.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const verificationCode = generateNumericCode(6);
    await this.usersService.saveVerificationCode(user.id, verificationCode);

    const emailSent = await this.mailService.sendMail(
      user.email,
      'Email Verification',
      `Your new verification code is ${verificationCode}`,
    );

    if (!emailSent) {
      throw new BadRequestException('Failed to send verification email');
    }

    return { message: 'Verification code resent successfully' };
  }

  async sendPasswordEmail(sendPasswordEmailDto: SendPasswordEmailDto) {
    const user = await this.usersService.findByEmail(
      sendPasswordEmailDto.email,
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const verificationCode = generateNumericCode(6);
    await this.usersService.saveVerificationCode(user.id, verificationCode);

    let emailSubject = 'Password Reset';
    let emailBody = `Your password reset code is ${verificationCode}`;

    if (sendPasswordEmailDto.emailType === 'change') {
      emailSubject = 'Change Password';
      emailBody = `Your change password code is ${verificationCode}`;
    }

    await this.mailService.sendMail(user.email, emailSubject, emailBody);

    return { message: 'Email sent successfully' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);

    try {
      await this.usersService.verifyEmail(user.id, resetPasswordDto.code);
    } catch {
      throw new BadRequestException('Invalid verification code');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, salt);

    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    currentUser: User,
  ) {
    try {
      await this.usersService.verifyEmail(
        currentUser.id,
        changePasswordDto.code,
      );
    } catch {
      throw new BadRequestException('Invalid verification code');
    }

    const user = await this.usersService.findById(currentUser.id, currentUser);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );

    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'Password changed successfully' };
  }
}
