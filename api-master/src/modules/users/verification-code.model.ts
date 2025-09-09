import {
  Column,
  Model,
  Table,
  ForeignKey,
  PrimaryKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './users.model';

@Table
export class VerificationCode extends Model<VerificationCode> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @Column
  code: string;

  @Column
  expiresAt: Date;

  @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
  user: User;
}
