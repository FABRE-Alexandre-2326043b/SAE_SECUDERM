import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.model';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService], // Экспорт сервиса для использования в других модулях
})
export class FileModule {}
