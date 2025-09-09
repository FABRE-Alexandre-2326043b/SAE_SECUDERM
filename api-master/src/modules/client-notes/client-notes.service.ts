import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientNotes } from './client-notes.model';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';
import { User } from '../users/users.model';
import { UserRole } from '../users/enums/user.enums';
import { TreatmentPlaceService } from '../treatment-places/treatment-place.service';
import { ShareTreatmentPlaceService } from '../share-treatment-place/share-treatment-place.service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ClientNotesService {
  constructor(
    @InjectModel(ClientNotes)
    private readonly clientNotesModel: typeof ClientNotes,
    private readonly treatmentPlaceService: TreatmentPlaceService,
    private readonly shareTreatmentPlaceService: ShareTreatmentPlaceService,
  ) {}

  async findAllByTreatmentPlaceId(
    treatmentPlaceId: string,
    currentUser: User,
  ): Promise<ClientNotes[]> {
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

    return this.clientNotesModel.findAll({
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
    createClientNoteDto: CreateClientNoteDto,
    currentUser: User,
  ): Promise<ClientNotes> {
    const treatmentPlace = await this.treatmentPlaceService.findOne(
      createClientNoteDto.treatment_place_id,
      currentUser,
    );

    if (treatmentPlace.client_id !== currentUser.id) {
      throw new UnauthorizedException('Unauthorized');
    }

    const note = new ClientNotes(createClientNoteDto);

    note.client_id = currentUser.id;
    note.treatment_place_id = createClientNoteDto.treatment_place_id;

    await note.save();

    return this.clientNotesModel.findByPk(note.id, {
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  }

  async update(
    clientNoteId: string,
    updateClientNoteDto: UpdateClientNoteDto,
    currentUser: User,
  ): Promise<ClientNotes> {
    const note = await this.clientNotesModel.findByPk(clientNoteId);

    if (!note) {
      throw new NotFoundException('Client note not found');
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      note.client_id !== currentUser.id
    ) {
      throw new NotFoundException('Unauthorized');
    }

    await note.update(updateClientNoteDto);

    return this.clientNotesModel.findByPk(note.id, {
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  }

  async remove(clientNoteId: string, currentUser: User): Promise<void> {
    const note = await this.clientNotesModel.findByPk(clientNoteId);

    if (!note) {
      throw new NotFoundException('Client note not found');
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      note.client_id !== currentUser.id
    ) {
      throw new NotFoundException('Unauthorized');
    }

    await note.destroy();
  }

  async deleteAllByTreatmentPlaceId(treatmentPlaceId: string): Promise<void> {
    await this.clientNotesModel.destroy({
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

    const notes = await this.clientNotesModel.findAll({
      where: { treatment_place_id: treatmentPlaceId },
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    const stream = doc.on('data', buffers.push.bind(buffers));

    doc.fontSize(25).text(`Client Notes`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`${treatmentPlace.label}`, { align: 'center' });
    doc.moveDown();
    doc
      .fontSize(20)
      .text(`${notes[0].client.first_name} ${notes[0].client.last_name}`, {
        align: 'center',
      });
    doc.moveDown();

    notes.forEach((note) => {
      doc
        .fontSize(12)
        .text(
          `${note.description}  ${new Date(note.createdAt).toLocaleString()}`,
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
