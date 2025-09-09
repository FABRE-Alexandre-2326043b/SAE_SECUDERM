import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TreatmentPlace } from './treatment-place.model';
import { CreateTreatmentPlaceDto } from './dto/create-treatment-place.dto';
import { UpdateTreatmentPlaceDto } from './dto/update-treatment-place.dto';
import { User } from '../users/users.model';
import { SharedTreatmentPlace } from '../share-treatment-place/shared-treatment-place.model';
import { QRCodeService } from '../qrcode/qrcode.service';
import { UserType } from '../users/enums/user.enums';
import { FileService } from '../file/file.service';
import { ClientNotes } from '../client-notes/client-notes.model';
import { Prescription } from '../prescription/prescription.model';
import { ShareTreatmentPlace } from '../share-treatment-place/share-treatment-place.model';

@Injectable()
export class TreatmentPlaceService {
  constructor(
    @InjectModel(TreatmentPlace)
    private readonly treatmentPlaceModel: typeof TreatmentPlace,
    @InjectModel(SharedTreatmentPlace)
    private readonly sharedTreatmentPlaceModel: typeof SharedTreatmentPlace,
    @InjectModel(ShareTreatmentPlace)
    private readonly shareTreatmentPlaceModel: typeof ShareTreatmentPlace,
    private readonly qrCodeService: QRCodeService,
    @InjectModel(ClientNotes)
    private readonly clientNotesModel: typeof ClientNotes,
    @InjectModel(Prescription)
    private readonly prescriptionModel: typeof Prescription,
    private readonly fileService: FileService,
  ) {}

  async findOne(id: string, currentUser: User): Promise<TreatmentPlace> {
    const treatmentPlace = await this.treatmentPlaceModel.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    if (!treatmentPlace) {
      throw new NotFoundException('Treatment place not found');
    }

    const isOwner = treatmentPlace.client_id === currentUser.id;

    const hasAccess = await this.sharedTreatmentPlaceModel.findOne({
      where: {
        treatment_place_id: id,
        doctor_id: currentUser.id,
      },
    });

    if (!isOwner && !hasAccess) {
      throw new ForbiddenException(
        'You do not have access to this treatment place',
      );
    }

    return treatmentPlace;
  }

  async create(
    dto: CreateTreatmentPlaceDto,
    currentUser: User,
  ): Promise<TreatmentPlace> {
    const qrCode = await this.qrCodeService.create(
      {
        label: dto.label,
        ref_product: dto.ref_product,
        dimension: dto.dimension,
        number_in_lot: dto.number_in_lot,
        lot_number: dto.lot_number,
        expiration_date: dto.expiration_date,
      },
      currentUser,
    );

    const treatmentPlace = await this.treatmentPlaceModel.create({
      label: dto.label,
      current_qr_code_id: qrCode.id,
      client_id: currentUser.id,
    });

    await this.qrCodeService.linkTreatmentPlaceToQRCode(
      qrCode.id,
      treatmentPlace.id,
      currentUser,
    );

    return treatmentPlace;
  }

  async update(
    id: string,
    dto: UpdateTreatmentPlaceDto,
    currentUser: User,
  ): Promise<TreatmentPlace> {
    const treatmentPlace = await this.treatmentPlaceModel.findByPk(id);

    if (!treatmentPlace) {
      throw new NotFoundException('Treatment place not found');
    }

    if (treatmentPlace.client_id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have access to this treatment place',
      );
    }

    return await treatmentPlace.update(dto);
  }

  async remove(id: string, currentUser: User): Promise<boolean> {
    const treatmentPlace = await this.treatmentPlaceModel.findByPk(id);

    if (!treatmentPlace) {
      throw new NotFoundException('Treatment place not found');
    }

    if (treatmentPlace.client_id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have access to this treatment place',
      );
    }
    await treatmentPlace.update({ current_qr_code_id: null });
    await this.removeAllByTreatmentPlaceId(id);
    await treatmentPlace.destroy();

    return true;
  }

  async removeAllByTreatmentPlaceId(
    treatmentPlaceId: string,
  ): Promise<boolean> {
    await this.qrCodeService.deleteAllByTreatmentPlaceId(treatmentPlaceId);

    await this.sharedTreatmentPlaceModel.destroy({
      where: { treatment_place_id: treatmentPlaceId },
    });

    await this.shareTreatmentPlaceModel.destroy({
      where: { treatment_place_id: treatmentPlaceId },
    });

    await this.clientNotesModel.destroy({
      where: { treatment_place_id: treatmentPlaceId },
    });

    await this.prescriptionModel.destroy({
      where: { treatment_place_id: treatmentPlaceId },
    });

    await this.fileService.deleteAllByTreatmentPlaceId(treatmentPlaceId);

    return true;
  }

  async findAllByClientId(
    clientId: string,
    currentUser: User,
  ): Promise<TreatmentPlace[]> {
    if (clientId === currentUser.id) {
      return await this.treatmentPlaceModel.findAll({
        where: { client_id: clientId },
      });
    } else {
      const sharedTreatmentPlaces =
        await this.sharedTreatmentPlaceModel.findAll({
          where: {
            doctor_id: currentUser.id,
          },
          include: [
            {
              model: this.treatmentPlaceModel,
              required: true,
              where: { client_id: clientId },
            },
          ],
        });

      return sharedTreatmentPlaces.map((shared) => shared.treatmentPlace);
    }
  }

  async findAllByDoctorId(
    doctorId: string,
    currentUser: User,
  ): Promise<TreatmentPlace[]> {
    if (doctorId !== currentUser.id) {
      throw new ForbiddenException('You are not a doctor');
    }

    if (currentUser.type !== UserType.DOCTOR) {
      throw new ForbiddenException('You are not a doctor');
    }

    const sharedTreatmentPlaces = await this.sharedTreatmentPlaceModel.findAll({
      where: {
        doctor_id: currentUser.id,
      },
      include: [
        {
          model: this.treatmentPlaceModel,
          required: true,
        },
      ],
    });

    return sharedTreatmentPlaces.map((shared) => shared.treatmentPlace);
  }
}
