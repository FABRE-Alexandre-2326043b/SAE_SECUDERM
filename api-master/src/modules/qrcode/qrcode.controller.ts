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
import { QRCodeService } from './qrcode.service';
import { CreateQRCodeDto } from './dto/create-qrcode.dto';
import { UpdateQRCodeDto } from './dto/update-qrcode.dto';
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
import { CheckQrcodeDto } from './dto/check-qrcode.dto';

@ApiTags('QRCode')
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
@ApiResponse({ status: 404, description: 'QRCode not found' })
@Controller('qrcode')
export class QRCodeController {
  constructor(private readonly qrcodeService: QRCodeService) {}

  @ApiOperation({ summary: 'Get QRCode by ID' })
  @ApiParam({ name: 'id', description: 'QRCode ID' })
  @ApiResponse({ status: 200, description: 'QRCode successfully retrieved' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getQRCode(@Req() req, @Param('id') id: string) {
    return this.qrcodeService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Create QRCode' })
  @ApiBody({ type: CreateQRCodeDto, description: 'The new QRCode data' })
  @ApiResponse({ status: 200, description: 'QRCode successfully created' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async createQRCode(@Req() req, @Body() createQRCodeDto: CreateQRCodeDto) {
    return this.qrcodeService.create(createQRCodeDto, req.user);
  }

  @ApiOperation({ summary: 'Update QRCode by ID' })
  @ApiParam({ name: 'id', description: 'QRCode ID' })
  @ApiBody({ type: UpdateQRCodeDto, description: 'The updated QRCode data' })
  @ApiResponse({ status: 200, description: 'QRCode successfully updated' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async updateQRCode(
    @Req() req,
    @Param('id') id: string,
    @Body() updateQRCodeDto: UpdateQRCodeDto,
  ) {
    return this.qrcodeService.update(id, updateQRCodeDto, req.user);
  }

  @ApiOperation({ summary: 'Delete QRCode by ID' })
  @ApiParam({ name: 'id', description: 'QRCode ID' })
  @ApiResponse({ status: 200, description: 'QRCode successfully deleted' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async deleteQRCode(@Req() req, @Param('id') id: string) {
    return this.qrcodeService.remove(id, req.user);
  }

  @ApiOperation({ summary: 'Link treatment place to qr code' })
  @ApiParam({ name: 'qr_code_id', description: 'QR Code ID' })
  @ApiParam({ name: 'treatment_place_id', description: 'Treatment Place ID' })
  @ApiResponse({
    status: 200,
    description: 'QRCode successfully linked to treatment place',
  })
  @Put('link/:qr_code_id/:treatment_place_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async linkTreatmentPlaceToQRCode(
    @Req() req,
    @Param('qr_code_id') qrCodeId: string,
    @Param('treatment_place_id') treatmentPlaceId: string,
  ) {
    return this.qrcodeService.linkTreatmentPlaceToQRCode(
      qrCodeId,
      treatmentPlaceId,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Check and return existing qr code' })
  @ApiBody({ type: CheckQrcodeDto, description: 'The QRCode data to check' })
  @ApiResponse({ status: 200, description: 'QRCode successfully retrieved' })
  @Post('check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async checkQRCode(@Req() req, @Body() checkQrcodeDto: CheckQrcodeDto) {
    return this.qrcodeService.checkAndReturnExistingQrCode(
      checkQrcodeDto,
      req.user,
    );
  }
}
