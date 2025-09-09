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
import { TreatmentPlace } from '../treatment-places/treatment-place.model';

@Table
export class Prescription extends Model<Prescription> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => TreatmentPlace)
  @Column({
    type: DataType.UUID,
  })
  treatment_place_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  doctor_id: string;

  @Column
  date: Date;

  @Column
  description: string;

  @Column
  state: boolean;

  @BelongsTo(() => TreatmentPlace, {
    foreignKey: 'treatment_place_id',
    targetKey: 'id',
  })
  treatmentPlace: TreatmentPlace;

  @BelongsTo(() => User, { foreignKey: 'doctor_id', targetKey: 'id' })
  doctor: User;
}
