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
export class ClientNotes extends Model<ClientNotes> {
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
  client_id: string;

  @Column({
    type: DataType.DATE,
  })
  date: Date;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @BelongsTo(() => TreatmentPlace, {
    foreignKey: 'treatment_place_id',
    targetKey: 'id',
  })
  treatmentPlace: TreatmentPlace;

  @BelongsTo(() => User, { foreignKey: 'client_id', targetKey: 'id' })
  client: User;
}
