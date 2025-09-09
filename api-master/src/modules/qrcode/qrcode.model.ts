import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { TreatmentPlace } from '../treatment-places/treatment-place.model';
import { User } from '../users/users.model';

@Table
export class QRCode extends Model<QRCode> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  label: string;

  @Column
  ref_product: string;

  @Column
  dimension: string;

  @Column
  number_in_lot: string;

  @Column
  lot_number: string;

  @Column
  expiration_date: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  client_id: string;

  @ForeignKey(() => TreatmentPlace)
  @Column({
    type: DataType.UUID,
  })
  treatment_place_id: string;

  @BelongsTo(() => User, { foreignKey: 'client_id', targetKey: 'id' })
  client: User;

  @BelongsTo(() => TreatmentPlace, {
    foreignKey: 'treatment_place_id',
    targetKey: 'id',
  })
  treatmentPlace: TreatmentPlace;
}
