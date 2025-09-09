import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Prescription } from './prescription.model';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { User } from '../users/users.model';
import { UserRole, UserType } from '../users/enums/user.enums';
import { ShareTreatmentPlaceService } from '../share-treatment-place/share-treatment-place.service';
import { TreatmentPlaceService } from '../treatment-places/treatment-place.service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectModel(Prescription)
    private readonly prescriptionModel: typeof Prescription,
    private readonly treatmentPlaceService: TreatmentPlaceService,
    private readonly shareTreatmentPlaceService: ShareTreatmentPlaceService,
  ) {}

  async findAllByTreatmentPlaceId(
    treatmentPlaceId: string,
    currentUser: User,
  ): Promise<Prescription[]> {
    const treatmentPlace = await this.treatmentPlaceService.findOne(
      treatmentPlaceId,
      currentUser,
    );

    if (!treatmentPlace) {
      throw new NotFoundException('Treatment place not found');
    }

    const isOwner = treatmentPlace.client_id === currentUser.id;
    const isShared = await this.shareTreatmentPlaceService.hasAccess(
      treatmentPlaceId,
      currentUser,
    );

    if (!isOwner && !isShared) {
      throw new ForbiddenException('Forbidden');
    }

    return this.prescriptionModel.findAll({
      where: { treatment_place_id: treatmentPlaceId },
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  }

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
    currentUser: User,
  ): Promise<Prescription> {
    const isShared = await this.shareTreatmentPlaceService.hasAccess(
      createPrescriptionDto.treatment_place_id,
      currentUser,
    );

    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.type !== UserType.DOCTOR &&
      !isShared
    ) {
      throw new ForbiddenException('Forbidden');
    }

    const prescription = new Prescription(createPrescriptionDto);

    prescription.doctor_id = currentUser.id;

    await prescription.save();

    return this.prescriptionModel.findByPk(prescription.id, {
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  }

  async update(
    prescriptionId: string,
    updatePrescriptionDto: UpdatePrescriptionDto,
    currentUser: User,
  ): Promise<Prescription> {
    const prescription = await this.prescriptionModel.findByPk(prescriptionId);

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.type !== UserType.DOCTOR &&
      prescription.doctor_id !== currentUser.id
    ) {
      throw new ForbiddenException('Forbidden');
    }

    await prescription.update(updatePrescriptionDto);

    return this.prescriptionModel.findByPk(prescription.id, {
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  }

  async remove(prescriptionId: string, currentUser: User): Promise<void> {
    const prescription = await this.prescriptionModel.findByPk(prescriptionId);

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.type !== UserType.DOCTOR &&
      prescription.doctor_id !== currentUser.id
    ) {
      throw new ForbiddenException('Forbidden');
    }

    await prescription.destroy();
  }

  async deleteAllByTreatmentPlaceId(treatmentPlaceId: string): Promise<void> {
    await this.prescriptionModel.destroy({
      where: { treatment_place_id: treatmentPlaceId },
    });
  }

  async generatePdf(
    treatmentPlaceId: string,
    currentUser: User,
  ): Promise<Buffer> {
    const treatmentPlace = await this.treatmentPlaceService.findOne(
      treatmentPlaceId,
      currentUser,
    );

    if (!treatmentPlace) {
      throw new NotFoundException('Treatment place not found');
    }

    const isOwner = treatmentPlace.client_id === currentUser.id;
    const isShared = await this.shareTreatmentPlaceService.hasAccess(
      treatmentPlaceId,
      currentUser,
    );

    if (!isOwner && !isShared) {
      throw new UnauthorizedException('Unauthorized');
    }

    const prescriptions = await this.prescriptionModel.findAll({
      where: { treatment_place_id: treatmentPlaceId },
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
    if (!prescriptions.length) {
      throw new NotFoundException('No prescriptions found');
    }

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    const stream = doc.on('data', buffers.push.bind(buffers));

    doc.fontSize(25).text(`Prescriptions`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`${treatmentPlace.label}`, { align: 'center' });
    doc.moveDown();
    doc
      .fontSize(20)
      .text(
        `${treatmentPlace.client.first_name} ${treatmentPlace.client.last_name}`,
        { align: 'center' },
      );
    doc.moveDown();

    prescriptions.forEach((prescription) => {
      doc
        .fontSize(12)
        .text(
          `${prescription.description}  ${new Date(prescription.createdAt).toLocaleString()} - Dr. ${prescription.doctor.first_name} ${prescription.doctor.last_name}`,
        );
      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      stream.on('error', reject);
    });
  }
}
