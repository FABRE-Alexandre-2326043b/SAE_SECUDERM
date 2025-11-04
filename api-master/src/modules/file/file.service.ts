import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from './file.model';
import { S3 } from 'aws-sdk';
import { User } from '../users/users.model';

@Injectable()
export class FileService {
  private s3: S3 | null = null;
  private bucketName: string;
  private useS3: boolean;

  constructor(
    @InjectModel(File)
    private readonly fileModel: typeof File, // Nous utilisons le modèle pour travailler avec la base
  ) {
    this.useS3 = process.env.USE_S3 === 'true';
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    if (this.useS3) {
      this.s3 = new S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      this.ensureBucketSecurity(); // Vérifier la sécurité du bucket au démarrage
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    currentUser: User,
    treatmentPlaceId: string,
  ): Promise<File> {
    const sanitizedFilename = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.{2,}/g, '.');
    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      throw new Error(
        'La taille du fichier dépasse la limite autorisée (10 Mo)',
      );
    }
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    console.log('MIMETYPE REÇU :', file.mimetype);
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Type de fichier non autorisé');
    }

    let fileUrl = '';
    let fileName = `uploads/${Date.now()}-${sanitizedFilename}`;

    if (this.useS3 && this.s3) {
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const result = await this.s3.upload(uploadParams).promise();
      fileUrl = result.Location;
      fileName = uploadParams.Key;
    } else {
      // En dev, retourne une URL factice
      fileUrl = `http://localhost/fake-file/${fileName}`;
    }

    // Enregistrer les métadonnées dans la base de données
    const newFile = await this.fileModel.create({
      original_name: sanitizedFilename,
      file_name: fileName,
      file_url: fileUrl,
      mime_type: file.mimetype,
      size: file.size,
      uploaded_by: currentUser.id,
      treatment_place_id: treatmentPlaceId,
    });

    newFile.file_url = await this.getFileUrl(newFile.file_name);

    return newFile;
  }

  // Obtenir le fichier par ID
  async getFileById(id: string): Promise<File> {
    return this.fileModel.findByPk(id);
  }

  // Générer une URL temporaire pour télécharger le fichier
  async getFileUrl(fileName: string): Promise<string> {
    if (this.useS3 && this.s3) {
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Expires: 60 * 15, // L'URL expire au bout de 15 minutes
      };
      return this.s3.getSignedUrlPromise('getObject', params);
    } else {
      // En dev, retourne une URL factice
      return `http://localhost/fake-file/${fileName}`;
    }
  }

  // Supprimer le fichier
  async deleteFile(id: string): Promise<void> {
    const file = await this.getFileById(id);
    if (!file) {
      throw new Error('File not found');
    }
    if (this.useS3 && this.s3) {
      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: file.file_name,
        })
        .promise();
    }
    await this.fileModel.destroy({ where: { id } });
  }

  async deleteAllByTreatmentPlaceId(treatmentPlaceId: string): Promise<void> {
    // Find all files associated with the treatment place
    const files = await this.fileModel.findAll({
      where: { treatment_place_id: treatmentPlaceId },
    });

    // Delete each file from S3 and the database
    for (const file of files) {
      if (this.useS3 && this.s3) {
        // Delete the file from S3
        await this.s3
          .deleteObject({
            Bucket: this.bucketName,
            Key: file.file_name,
          })
          .promise();
      }
      // Delete the file record from the database
      await this.fileModel.destroy({ where: { id: file.id } });
    }
  }

  async getFilesURLSByTreatmentPlaceId(
    treatmentPlaceId: string,
  ): Promise<any[]> {
    // Find all files associated with the treatment place
    const files = await this.fileModel.findAll({
      where: { treatment_place_id: treatmentPlaceId },
    });

    // Map the files to the required format
    const filesData = await Promise.all(
      files.map(async (file) => {
        const fileUrl = await this.getFileUrl(file.file_name);
        return {
          id: file.id,
          original_name: file.original_name,
          file_url: fileUrl,
          mime_type: file.mime_type,
          size: file.size,
          uploaded_by: file.uploaded_by,
          treatment_place_id: file.treatment_place_id,
        };
      }),
    );

    return filesData;
  }

  async ensureBucketSecurity(): Promise<void> {
    if (!this.useS3 || !this.s3) return;
    try {
      // Vérifier et appliquer le chiffrement par défaut
      await this.s3
        .putBucketEncryption({
          Bucket: this.bucketName,
          ServerSideEncryptionConfiguration: {
            Rules: [
              {
                ApplyServerSideEncryptionByDefault: {
                  SSEAlgorithm: 'AES256',
                },
                BucketKeyEnabled: true,
              },
            ],
          },
        })
        .promise();

      // Bloquer l'accès public
      await this.s3
        .putPublicAccessBlock({
          Bucket: this.bucketName,
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            IgnorePublicAcls: true,
            BlockPublicPolicy: true,
            RestrictPublicBuckets: true,
          },
        })
        .promise();

      console.log('La sécurité du bucket S3 est configurée correctement');
    } catch (error) {
      console.error(
        'Erreur lors de la configuration de la sécurité du bucket S3:',
        error,
      );
    }
  }
}
