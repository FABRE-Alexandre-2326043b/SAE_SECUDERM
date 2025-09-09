import {
  BadRequestException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user.enums';
import { VerificationCode } from './verification-code.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(VerificationCode)
    private readonly verificationCodeModel: typeof VerificationCode,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.email = createUserDto.email;
    user.first_name = createUserDto.first_name;
    user.last_name = createUserDto.last_name;
    user.password = createUserDto.password;
    user.role = createUserDto.role;
    user.type = createUserDto.type;
    user.isEmailVerified = true;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(createUserDto.password, salt);

    return user.save();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ): Promise<User> {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('Forbidden');
    }

    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.first_name = updateUserDto.first_name;
    user.last_name = updateUserDto.last_name;

    return user.save();
  }

  async delete(id: string) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.verificationCodeModel.destroy({
      where: { userId: id },
    });

    await user.destroy();
    return { message: 'User successfully deleted' };
  }

  async findById(id: string, currentUser: User): Promise<User> {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('Forbidden');
    }

    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findByIdForJwt(id: string): Promise<Partial<User>> {
    const user = await this.userModel.findByPk(id, {
      attributes: ['id', 'role', 'type'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findEmailById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: ['email'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    return !!user;
  }

  async saveVerificationCode(userId: string, code: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const existingCode = await this.verificationCodeModel.findOne({
      where: { userId },
    });

    if (existingCode) {
      await this.verificationCodeModel.update(
        { code, expiresAt },
        { where: { userId } },
      );
    } else {
      await this.verificationCodeModel.create({ userId, code, expiresAt });
    }
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    const verificationCode = await this.verificationCodeModel.findOne({
      where: { userId, code },
    });

    if (!verificationCode || verificationCode.expiresAt < new Date()) {
      throw new Error('Invalid or expired verification code');
    }

    await this.userModel.update(
      { isEmailVerified: true },
      { where: { id: userId } },
    );

    await this.verificationCodeModel.destroy({ where: { userId, code } });
  }

  async deleteVerificationCodes(userId: string): Promise<void> {
    await this.verificationCodeModel.destroy({ where: { userId } });
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await this.userModel.update({ password }, { where: { id: userId } });
  }
}
