import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserRole, UserType } from './enums/user.enums';

@Table
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  email: string;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  password: string;

  @Column
  role: UserRole;

  @Column
  type: UserType;

  @Column
  isEmailVerified: boolean;
}
