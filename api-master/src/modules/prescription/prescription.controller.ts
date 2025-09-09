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
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../users/enums/user.enums';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Prescription')
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
@ApiResponse({ status: 404, description: 'Prescription not found' })
@Controller('prescription')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @ApiOperation({ summary: 'Get Prescriptions by Treatment Place ID' })
  @ApiParam({ name: 'treatment_place_id', description: 'Treatment Place ID' })
  @ApiResponse({
    status: 200,
    description: 'Prescriptions successfully retrieved',
  })
  @Get(':treatment_place_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getPrescription(
    @Req() req,
    @Param('treatment_place_id') treatmentPlaceId: string,
  ) {
    return this.prescriptionService.findAllByTreatmentPlaceId(
      treatmentPlaceId,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Create Prescription' })
  @ApiBody({
    type: CreatePrescriptionDto,
    description: 'The new Prescription data',
  })
  @ApiResponse({
    status: 200,
    description: 'Prescription successfully created',
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async createPrescription(
    @Req() req,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ) {
    return this.prescriptionService.create(createPrescriptionDto, req.user);
  }

  @ApiOperation({ summary: 'Update Prescription by ID' })
  @ApiParam({ name: 'id', description: 'Prescription ID' })
  @ApiBody({
    type: UpdatePrescriptionDto,
    description: 'The updated Prescription data',
  })
  @ApiResponse({
    status: 200,
    description: 'Prescription successfully updated',
  })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async updatePrescription(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionService.update(id, updatePrescriptionDto, req.user);
  }

  @ApiOperation({ summary: 'Delete Prescription by ID' })
  @ApiParam({ name: 'id', description: 'Prescription ID' })
  @ApiResponse({
    status: 200,
    description: 'Prescription successfully deleted',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async deletePrescription(@Req() req, @Param('id') id: string) {
    return this.prescriptionService.remove(id, req.user);
  }

  @ApiOperation({
    summary: 'Generate PDF of Client Prescriptions by Treatment Place ID',
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
  @Header('Content-Disposition', 'attachment; filename="prescriptions.pdf"')
  async getPrescriptionsPdf(
    @Param('treatment_place_id') treatmentPlaceId: string,
    @Req() req,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.prescriptionService.generatePdf(
      treatmentPlaceId,
      req.user,
    );

    return new StreamableFile(pdfBuffer);
  }
}
