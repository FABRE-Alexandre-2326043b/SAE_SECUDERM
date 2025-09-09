import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { QRCode } from '../qrcode/qrcode.model';

@Table
export class TreatmentPlace extends Model<TreatmentPlace> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  label: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  client_id: string;

  @ForeignKey(() => QRCode)
  @Column({
    type: DataType.UUID,
  })
  current_qr_code_id: string;

  @BelongsTo(() => User, { foreignKey: 'client_id', targetKey: 'id' })
  client: User;

  @BelongsTo(() => QRCode, {
    foreignKey: 'current_qr_code_id',
    targetKey: 'id',
  })
  qrCode: QRCode;
}
