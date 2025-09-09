import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ShareTreatmentPlaceService } from './share-treatment-place.service';
import { ShareTreatmentPlace } from './share-treatment-place.model';
import { CreateShareTreatmentPlaceDto } from './dto/create-share-treatment-place.dto';
import { AddShareTreatmentPlaceDto } from './dto/add-share-treatment-place.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../users/enums/user.enums';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { SharedTreatmentPlace } from './shared-treatment-place.model';

@ApiTags('ShareTreatmentPlace')
@ApiBearerAuth()
@Controller('share-treatment-place')
export class ShareTreatmentPlaceController {
  constructor(
    private readonly shareTreatmentPlaceService: ShareTreatmentPlaceService,
  ) {}

  @ApiOperation({ summary: 'Create Share Treatment Place' })
  @ApiBody({
    type: CreateShareTreatmentPlaceDto,
    description: 'The new Share Treatment Place data',
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async create(
    @Req() req,
    @Body() createShareTreatmentPlaceDto: CreateShareTreatmentPlaceDto,
  ): Promise<ShareTreatmentPlace> {
    return this.shareTreatmentPlaceService.create(
      createShareTreatmentPlaceDto.treatment_place_id,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Add Share Treatment Place' })
  @ApiBody({
    type: AddShareTreatmentPlaceDto,
    description: 'The new Share Treatment Place data',
  })
  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async add(
    @Body() addShareQrCodeDto: AddShareTreatmentPlaceDto,
    @Req() req,
  ): Promise<void> {
    const result = await this.shareTreatmentPlaceService.add(
      addShareQrCodeDto.verification_code,
      req.user,
    );
    if (!result) {
      throw new BadRequestException(
        'Invalid verification code or user details',
      );
    }
  }

  @ApiOperation({ summary: 'Get Shared Treatment Places' })
  @ApiParam({ name: 'treatment_place_id', description: 'Treatment Place ID' })
  @ApiResponse({
    status: 200,
    description: 'Shared Treatment Places successfully retrieved',
  })
  @Get('shared/:treatment_place_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getSharedTreatmentPlaces(
    @Req() req,
    @Param('treatment_place_id') treatmentPlaceId: string,
  ): Promise<SharedTreatmentPlace[]> {
    return this.shareTreatmentPlaceService.getSharedTreatmentPlacesByTreatmentPlaceId(
      treatmentPlaceId,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Remove Shared Treatment Place' })
  @ApiParam({ name: 'id', description: 'Shared Treatment Place ID' })
  @ApiResponse({
    status: 200,
    description: 'Shared Treatment Place successfully removed',
  })
  @Delete('remove/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async removeSharedTreatmentPlace(
    @Req() req,
    @Param('id') id: string,
  ): Promise<void> {
    return this.shareTreatmentPlaceService.removeSharedTreatmentPlace(
      id,
      req.user,
    );
  }
}
