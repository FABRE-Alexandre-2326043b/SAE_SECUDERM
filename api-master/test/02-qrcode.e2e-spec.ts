import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { TestDatabase, testDatabaseConfig } from './test-database.utils';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserType } from '../src/modules/users/enums/user.enums';

describe('QRCodeController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let qrCodeId: string;
  let clientId: string;
  let db: TestDatabase;

  beforeAll(async () => {
    db = new TestDatabase();

    await db.start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        SequelizeModule.forRootAsync({
          useFactory: async () => testDatabaseConfig(db.container),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await db.seedUser(UserType.CLIENT, 'user@example.com');

    // Perform login to get access token
    const loginDto = {
      email: 'user@example.com',
      password: 'test',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201);

    accessToken = response.body.token;
    clientId = response.body.user.id;
  });

  afterAll(async () => {
    await app.close();
    await db.stop();
  });

  it('/qrcode (POST)', async () => {
    const createQrCodeDto = {
      label: 'Simple qr code label',
      ref_product: 'KIT XL',
      dimension: '20*50cm',
      lot_number: '01/01/1111',
      expiration_date: '01/01/1111',
    };

    const response = await request(app.getHttpServer())
      .post('/qrcode')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createQrCodeDto)
      .expect(201);

    qrCodeId = response.body.id;
  });

  it('/qrcode/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/qrcode/${qrCodeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/qrcode/user (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/qrcode/client/${clientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/qrcode/:id (PUT)', async () => {
    const updateQrCodeDto = {
      label: 'Updated QR Code Data',
    };

    await request(app.getHttpServer())
      .put(`/qrcode/${qrCodeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateQrCodeDto)
      .expect(200);
  });

  it('/qrcode/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/qrcode/${qrCodeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
