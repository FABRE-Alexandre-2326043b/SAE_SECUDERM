import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestDatabase, testDatabaseConfig } from './test-database.utils';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserType } from '../src/modules/users/enums/user.enums';

describe('Client Notes (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let qrCodeId: string;
  let clientNoteId: string;
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

    // Create QR code
    const createQrCodeDto = {
      label: 'Simple qr code label',
      ref_product: 'KIT XL',
      dimension: '20*50cm',
      lot_number: '01/01/1111',
      expiration_date: '01/01/1111',
    };

    const qrCodeResponse = await request(app.getHttpServer())
      .post('/qrcode')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createQrCodeDto)
      .expect(201);

    qrCodeId = qrCodeResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
    await db.stop();
  });

  it('should create a client note', async () => {
    const createClientNoteDto = {
      qr_code_id: qrCodeId,
      date: '2024-11-15T14:10:25.301Z',
      description: 'Simple note description',
    };

    const response = await request(app.getHttpServer())
      .post('/client-notes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createClientNoteDto)
      .expect(201);

    clientNoteId = response.body.id;
  });

  it('should get the created client note', async () => {
    await request(app.getHttpServer())
      .get(`/client-notes/${qrCodeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('should update the client note', async () => {
    const updateClientNoteDto = {
      note: 'This is an updated test note',
    };

    await request(app.getHttpServer())
      .put(`/client-notes/${clientNoteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateClientNoteDto)
      .expect(200);
  });

  it('should delete the client note', async () => {
    await request(app.getHttpServer())
      .delete(`/client-notes/${clientNoteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
