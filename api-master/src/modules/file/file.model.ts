import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { TreatmentPlace } from '../treatment-places/treatment-place.model';

@Table
export class File extends Model<File> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  original_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mime_type: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  size: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  uploaded_by: string;

  @ForeignKey(() => TreatmentPlace)
  @Column({
    type: DataType.UUID,
  })
  treatment_place_id: string;

  @BelongsTo(() => TreatmentPlace, {
    foreignKey: 'treatment_place_id',
    targetKey: 'id',
  })
  treatmentPlace: TreatmentPlace;
}
