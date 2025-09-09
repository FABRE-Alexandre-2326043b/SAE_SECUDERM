import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../users/enums/user.enums';

@ApiTags('File')
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
@ApiResponse({ status: 404, description: 'File not found' })
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Upload File' })
  @ApiBody({
    description: 'The file to upload',
  })
  @ApiResponse({
    status: 200,
    description: 'File successfully uploaded',
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body('treatment_place_id') treatmentPlaceId: string,
  ) {
    const result = await this.fileService.uploadFile(
      file,
      req.user,
      treatmentPlaceId,
    );
    return { file: result };
  }

  @ApiOperation({ summary: 'Get File by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File successfully retrieved',
  })
  @Get(':id')
  async getFileById(@Param('id') id: string) {
    const file = await this.fileService.getFileById(id);
    return { file };
  }

  @ApiOperation({ summary: 'Get File URL by File Name' })
  @ApiParam({ name: 'fileName', description: 'File Name' })
  @ApiResponse({
    status: 200,
    description: 'File URL successfully retrieved',
  })
  @Get('url/:fileName')
  async getFileUrl(@Param('fileName') fileName: string) {
    const url = await this.fileService.getFileUrl(fileName);
    return { url };
  }

  @ApiOperation({ summary: 'Delete File by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File successfully deleted',
  })
  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.fileService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }
  @Get('urls/:treatmentPlaceId')
  async getFilesURLSByTreatmentPlaceId(
    @Param('treatmentPlaceId') treatmentPlaceId: string,
  ) {
    const files =
      await this.fileService.getFilesURLSByTreatmentPlaceId(treatmentPlaceId);
    return { files };
  }
}
