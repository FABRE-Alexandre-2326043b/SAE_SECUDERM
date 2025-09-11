import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.model';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService], // Service d’exportation pour une utilisation dans d’autres modules
})
export class FileModule {}
