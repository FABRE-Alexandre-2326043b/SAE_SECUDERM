import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SendPasswordEmailDto } from './dto/send-password-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../users/enums/user.enums';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register User' })
  @ApiBody({
    type: RegisterUserDto,
    description: 'The new User data',
  })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'Login User' })
  @ApiBody({
    type: LoginUserDto,
    description: 'The User data',
  })
  @ApiResponse({
    status: 200,
    description: 'Return user data with bearer token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Email not verified',
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Verify Email' })
  @ApiBody({
    type: VerifyEmailDto,
    description: 'The User data',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid verification code',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @ApiOperation({ summary: 'Resend Verification Code' })
  @ApiBody({
    type: ResendVerificationCodeDto,
    description: 'The User data',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent',
  })
  @Post('resend-verification-code')
  async resendVerificationCode(
    @Body() resendVerificationCode: ResendVerificationCodeDto,
  ) {
    return this.authService.resendVerificationCode(resendVerificationCode);
  }

  @ApiOperation({ summary: 'Send Reset/Change Password Email' })
  @ApiBody({
    type: SendPasswordEmailDto,
    description: 'The User data',
  })
  @ApiResponse({
    status: 200,
    description: 'Password email sent',
  })
  @Post('send-password-email')
  async sendPasswordEmail(@Body() sendPasswordEmailDto: SendPasswordEmailDto) {
    return this.authService.sendPasswordEmail(sendPasswordEmailDto);
  }

  @ApiOperation({ summary: 'Reset Password' })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'The User data',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: 'Change Password' })
  @ApiBearerAuth()
  @ApiBody({
    type: ChangePasswordDto,
    description: 'The User data',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @Post('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async changePassword(@Req() req, @Body() changePassword: ChangePasswordDto) {
    return this.authService.changePassword(changePassword, req.user);
  }

  @ApiOperation({ summary: 'Fetch Logged in User with token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Return user data',
  })
  @Post('me')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async me(@Req() req) {
    return this.authService.me(req.user);
  }
}
