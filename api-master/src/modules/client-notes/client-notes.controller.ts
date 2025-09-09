import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ClientNotesService } from './client-notes.service';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../users/enums/user.enums';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('ClientNotes')
@ApiBearerAuth()
@ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
@ApiResponse({
  status: 401,
  description: 'Unauthorized - Invalid or missing token',
})
@ApiResponse({
  status: 403,
  description: 'Forbidden - User does not have access',
})
@ApiResponse({ status: 404, description: 'Client note not found' })
@Controller('client-notes')
export class ClientNotesController {
  constructor(private readonly clientNotesService: ClientNotesService) {}

  @ApiOperation({ summary: 'Get Client Notes by Treatment Place ID' })
  @ApiParam({ name: 'treatment_place_id', description: 'Treatment Place ID' })
  @ApiResponse({
    status: 200,
    description: 'Client Notes successfully retrieved',
  })
  @Get(':treatment_place_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getNotes(
    @Req() req,
    @Param('treatment_place_id') treatmentPlaceId: string,
  ) {
    return this.clientNotesService.findAllByTreatmentPlaceId(
      treatmentPlaceId,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Create Client Note' })
  @ApiBody({
    type: CreateClientNoteDto,
    description: 'The new Client Note data',
  })
  @ApiResponse({
    status: 200,
    description: 'Client Note created successfully',
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async createNote(
    @Req() req,
    @Body() createClientNoteDto: CreateClientNoteDto,
  ) {
    return this.clientNotesService.create(createClientNoteDto, req.user);
  }

  @ApiOperation({ summary: 'Update Client Note by ID' })
  @ApiParam({ name: 'client_note_id', description: 'Client Note ID' })
  @ApiBody({
    type: UpdateClientNoteDto,
    description: 'The updated Client Note data',
  })
  @ApiResponse({
    status: 200,
    description: 'Client Note updated successfully',
  })
  @Put(':client_note_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async updateNote(
    @Req() req,
    @Param('client_note_id') clientNoteId: string,
    @Body() updateClientNoteDto: UpdateClientNoteDto,
  ) {
    return this.clientNotesService.update(
      clientNoteId,
      updateClientNoteDto,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Delete Client Note by ID' })
  @ApiParam({ name: 'client_note_id', description: 'Client Note ID' })
  @ApiResponse({
    status: 200,
    description: 'Client Note deleted successfully',
  })
  @Delete(':client_note_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async deleteNote(@Req() req, @Param('client_note_id') clientNoteId: string) {
    await this.clientNotesService.remove(clientNoteId, req.user);
    return { statusCode: 200, message: 'Note deleted successfully' };
  }

  @ApiOperation({
    summary: 'Generate PDF of Client Notes by Treatment Place ID',
  })
  @ApiParam({ name: 'treatment_place_id', description: 'Treatment Place ID' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
  })
  @Get('pdf/:treatment_place_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="client_notes.pdf"')
  async getNotesPdf(
    @Param('treatment_place_id') treatmentPlaceId: string,
    @Req() req,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.clientNotesService.generatePdf(
      treatmentPlaceId,
      req.user,
    );

    return new StreamableFile(pdfBuffer);
  }
}
