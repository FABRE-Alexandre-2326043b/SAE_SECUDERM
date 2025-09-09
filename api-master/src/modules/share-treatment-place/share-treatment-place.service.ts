import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ShareTreatmentPlace } from './share-treatment-place.model';
import { User } from '../users/users.model';
import { generateNumericCode } from '../../utils/utils';
import { UserType } from '../users/enums/user.enums';
import { UsersService } from '../users/users.service';
import { SharedTreatmentPlace } from './shared-treatment-place.model';
import { TreatmentPlace } from '../treatment-places/treatment-place.model';

@Injectable()
export class ShareTreatmentPlaceService {
  constructor(
    @InjectModel(ShareTreatmentPlace)
    private readonly shareTreatmentPlace: typeof ShareTreatmentPlace,
    private readonly userService: UsersService,
    @InjectModel(SharedTreatmentPlace)
    private readonly sharedTreatmentModel: typeof SharedTreatmentPlace,
    @InjectModel(TreatmentPlace)
    private readonly treatmentPlaceModel: typeof TreatmentPlace,
  ) {}

  async create(
    treatment_place_id: string,
    currentUser: User,
  ): Promise<ShareTreatmentPlace> {
    const treatmentPlace =
      await this.treatmentPlaceModel.findByPk(treatment_place_id);

    if (!treatmentPlace) {
      throw new NotFoundException();
    }

    if (treatmentPlace.client_id !== currentUser.id) {
      throw new UnauthorizedException();
    }

    return this.shareTreatmentPlace.create({
      treatment_place_id,
      verification_code: generateNumericCode(6),
    });
  }

  async add(verification_code: string, currentUser: User): Promise<boolean> {
    const shareTreatmentPlace = await this.shareTreatmentPlace.findOne({
      where: { verification_code },
    });
    if (!shareTreatmentPlace) {
      throw new NotFoundException();
    }

    const user = await this.userService.findById(currentUser.id, currentUser);
    if (!user || !user.isEmailVerified || user.type !== UserType.DOCTOR) {
      throw new UnauthorizedException();
    }

    await this.sharedTreatmentModel.create({
      treatment_place_id: shareTreatmentPlace.treatment_place_id,
      doctor_id: currentUser.id,
    });

    return true;
  }

  async hasAccess(
    treatment_place_id: string,
    currentUser: User,
  ): Promise<boolean> {
    const sharedTreatmentPlace = await this.sharedTreatmentModel.findOne({
      where: { doctor_id: currentUser.id, treatment_place_id },
    });

    return !!sharedTreatmentPlace;
  }

  async getSharedTreatmentPlacesByTreatmentPlaceId(
    treatmentPlaceId: string,
    currentUser: User,
  ): Promise<any[]> {
    const treatmentPlace = await this.treatmentPlaceModel.findOne({
      where: { id: treatmentPlaceId, client_id: currentUser.id },
    });

    if (!treatmentPlace) {
      throw new UnauthorizedException(
        'You do not have access to this treatment place',
      );
    }

    return await this.sharedTreatmentModel.findAll({
      where: { treatment_place_id: treatmentPlaceId },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['first_name', 'last_name'],
          required: true,
        },
      ],
    });
  }

  async removeSharedTreatmentPlace(
    id: string,
    currentUser: User,
  ): Promise<void> {
    const sharedTreatmentPlace = await this.sharedTreatmentModel.findByPk(id);
    if (!sharedTreatmentPlace) {
      throw new NotFoundException();
    }

    const treatmentPlace = await this.treatmentPlaceModel.findByPk(
      sharedTreatmentPlace.treatment_place_id,
    );
    if (!treatmentPlace || treatmentPlace.client_id !== currentUser.id) {
      throw new UnauthorizedException();
    }

    await sharedTreatmentPlace.destroy();
  }

  async deleteAllByTreatmentPlaceId(treatmentPlaceId: string): Promise<void> {
    await this.sharedTreatmentModel.destroy({
      where: { treatment_place_id: treatmentPlaceId },
    });
  }
}
