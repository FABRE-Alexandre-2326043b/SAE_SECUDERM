import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { TreatmentPlace } from '../treatment-places/treatment-place.model';
import { User } from '../users/users.model';

@Table
export class SharedTreatmentPlace extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => TreatmentPlace)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  treatment_place_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  doctor_id: string;

  @BelongsTo(() => TreatmentPlace, {
    foreignKey: 'treatment_place_id',
    targetKey: 'id',
  })
  treatmentPlace: TreatmentPlace;

  @BelongsTo(() => User, {
    foreignKey: 'doctor_id',
    targetKey: 'id',
  })
  doctor: User;
}
