import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TreatmentPlaceService } from './treatment-place.service';
import { CreateTreatmentPlaceDto } from './dto/create-treatment-place.dto';
import { UpdateTreatmentPlaceDto } from './dto/update-treatment-place.dto';
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

@ApiTags('Treatment Place')
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
@ApiResponse({ status: 404, description: 'Treatment Place not found' })
@Controller('treatment-place')
export class TreatmentPlaceController {
  constructor(private readonly treatmentPlaceService: TreatmentPlaceService) {}

  @ApiOperation({ summary: 'Get Treatment Place by ID' })
  @ApiParam({ name: 'id', description: 'Treatment Place ID' })
  @ApiResponse({
    status: 200,
    description: 'Treatment Place successfully retrieved',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getTreatmentPlace(@Req() req, @Param('id') id: string) {
    return this.treatmentPlaceService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Create Treatment Place' })
  @ApiBody({
    type: CreateTreatmentPlaceDto,
    description: 'The new Treatment Place data',
  })
  @ApiResponse({
    status: 200,
    description: 'Treatment Place successfully created',
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async createTreatmentPlace(
    @Req() req,
    @Body() createTreatmentPlaceDto: CreateTreatmentPlaceDto,
  ) {
    return this.treatmentPlaceService.create(createTreatmentPlaceDto, req.user);
  }

  @ApiOperation({ summary: 'Update Treatment Place by ID' })
  @ApiParam({ name: 'id', description: 'Treatment Place ID' })
  @ApiBody({
    type: UpdateTreatmentPlaceDto,
    description: 'The updated Treatment Place data',
  })
  @ApiResponse({
    status: 200,
    description: 'Treatment Place successfully updated',
  })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async updateTreatmentPlace(
    @Req() req,
    @Param('id') id: string,
    @Body() updateTreatmentPlaceDto: UpdateTreatmentPlaceDto,
  ) {
    return this.treatmentPlaceService.update(
      id,
      updateTreatmentPlaceDto,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Delete Treatment Place by ID' })
  @ApiParam({ name: 'id', description: 'Treatment Place ID' })
  @ApiResponse({
    status: 200,
    description: 'Treatment Place successfully deleted',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async deleteTreatmentPlace(@Req() req, @Param('id') id: string) {
    return this.treatmentPlaceService.remove(id, req.user);
  }

  @ApiOperation({ summary: 'Get Treatment Places by client ID' })
  @ApiParam({ name: 'client_id', description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'Treatment Places successfully retrieved',
  })
  @Get('client/:client_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getTreatmentPlacesByClientId(
    @Req() req,
    @Param('client_id') clientId: string,
  ) {
    return this.treatmentPlaceService.findAllByClientId(clientId, req.user);
  }

  @ApiOperation({ summary: 'Get Treatment Places by doctor ID' })
  @ApiParam({ name: 'doctor_id', description: 'Doctor ID' })
  @ApiResponse({
    status: 200,
    description: 'Treatment Places successfully retrieved',
  })
  @Get('doctor/:doctor_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getTreatmentPlacesByDoctorId(
    @Req() req,
    @Param('doctor_id') doctorId: string,
  ) {
    return this.treatmentPlaceService.findAllByDoctorId(doctorId, req.user);
  }
}
