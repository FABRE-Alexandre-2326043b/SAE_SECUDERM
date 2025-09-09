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

@Table
export class ShareTreatmentPlace extends Model {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  verification_code: string;

  @BelongsTo(() => TreatmentPlace, {
    foreignKey: 'treatment_place_id',
    targetKey: 'id',
  })
  treatmentPlace: TreatmentPlace;
}
