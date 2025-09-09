import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QRCode } from './qrcode.model';
import { CreateQRCodeDto } from './dto/create-qrcode.dto';
import { UpdateQRCodeDto } from './dto/update-qrcode.dto';
import { User } from '../users/users.model';
import { UserRole } from '../users/enums/user.enums';
import { TreatmentPlace } from '../treatment-places/treatment-place.model';
import { CheckQrcodeDto } from './dto/check-qrcode.dto';

@Injectable()
export class QRCodeService {
  constructor(
    @InjectModel(QRCode)
    private readonly qrcodeModel: typeof QRCode,
  ) {}

  async findOne(id: string, currentUser: User): Promise<QRCode> {
    const qrcode = await this.qrcodeModel.findByPk(id);

    if (!qrcode) {
      throw new NotFoundException(`QR code not found`);
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      qrcode.client_id !== currentUser.id
    ) {
      throw new NotFoundException('Unauthorized');
    }

    return qrcode;
  }

  async checkAndReturnExistingQrCode(
    checkQRCodeDto: CheckQrcodeDto,
    currentUser: User,
  ): Promise<string> {
    const { number_in_lot, ref_product, lot_number } = checkQRCodeDto;
    const qrCode = await this.qrcodeModel.findOne({
      where: { number_in_lot, ref_product, lot_number },
      include: {
        model: TreatmentPlace,
        attributes: ['id', 'client_id'],
      },
    });

    if (!qrCode) {
      throw new NotFoundException('QR code not found');
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      qrCode.client_id !== currentUser.id
    ) {
      throw new ForbiddenException('Forbidden');
    }

    return qrCode.treatmentPlace.id;
  }

  async checkIfQrCodeExists(
    number_in_lot: string,
    ref_product: string,
    lot_number: string,
  ): Promise<boolean> {
    const qrCode = await this.qrcodeModel.findOne({
      where: { number_in_lot, ref_product, lot_number },
    });
    return !!qrCode;
  }

  async create(
    createQRCodeDto: CreateQRCodeDto,
    currentUser: User,
  ): Promise<QRCode> {
    const qrCode = new QRCode();

    qrCode.client_id = currentUser.id;
    qrCode.label = createQRCodeDto.label;
    qrCode.ref_product = createQRCodeDto.ref_product;
    qrCode.dimension = createQRCodeDto.dimension;
    qrCode.number_in_lot = createQRCodeDto.number_in_lot;
    qrCode.lot_number = createQRCodeDto.lot_number;
    qrCode.expiration_date = createQRCodeDto.expiration_date;

    if (
      await this.checkIfQrCodeExists(
        qrCode.number_in_lot,
        qrCode.ref_product,
        qrCode.lot_number,
      )
    ) {
      throw new NotFoundException('QR code already exists');
    }
    return qrCode.save();
  }

  async update(
    id: string,
    updateQRCodeDto: UpdateQRCodeDto,
    currentUser: User,
  ): Promise<QRCode> {
    const qrcode = await this.findOne(id, currentUser);
    return qrcode.update(updateQRCodeDto);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const qrcode = await this.findOne(id, currentUser);
    await qrcode.destroy();
  }

  async findByIdWithoutAuth(id: string): Promise<QRCode> {
    const qrcode = await this.qrcodeModel.findByPk(id);

    if (!qrcode) {
      throw new NotFoundException(`QR code not found`);
    }

    return qrcode;
  }

  async linkTreatmentPlaceToQRCode(
    qrCodeId: string,
    treatmentPlaceId: string,
    currentUser: User,
  ): Promise<boolean> {
    const qrCode = await this.qrcodeModel.findByPk(qrCodeId);

    if (!qrCode) {
      throw new NotFoundException(`QR code not found`);
    }

    if (qrCode.client_id !== currentUser.id) {
      throw new NotFoundException('Unauthorized');
    }

    qrCode.treatment_place_id = treatmentPlaceId;

    await qrCode.save();
    return true;
  }

  async deleteAllByTreatmentPlaceId(treatmentPlaceId: string): Promise<void> {
    await this.qrcodeModel.destroy({
      where: { treatment_place_id: treatmentPlaceId },
    });
  }
}
