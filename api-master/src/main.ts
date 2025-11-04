import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import helmet from 'helmet';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Example API')
      .setDescription('API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(new ValidationPipe());
  const server = await app.listen(process.env.PORT ||3000, '0.0.0.0');
  console.log(server.address());
}
bootstrap();
