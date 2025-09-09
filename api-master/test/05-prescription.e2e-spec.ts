import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestDatabase, testDatabaseConfig } from './test-database.utils';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserType } from '../src/modules/users/enums/user.enums';

let app: INestApplication;
let doctorAccessToken: string;
let clientAccessToken: string;
let qrCodeId: string;
let prescriptionId: string;
let clientId: string;
let db: TestDatabase;

describe('PrescriptionController (e2e)', () => {
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

    const client = await db.seedUser(UserType.CLIENT, 'user@example.com');
    clientId = client.id;
    const qrCode = await db.seedQRCode(clientId);
    qrCodeId = qrCode.id;
    await db.seedUser(UserType.DOCTOR, 'doctor@example.com');

    const loginDto = {
      email: 'doctor@example.com',
      password: 'test',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201);

    doctorAccessToken = response.body.token;
  });

  afterAll(async () => {
    await app.close();
    await db.stop();
  });

  describe('Doctor creating prescription : /prescription (POST)', () => {
    it('should create prescription successfully', async () => {
      const createPrescriptionDto = {
        qr_code_id: qrCodeId,
        client_id: clientId,
        date: new Date(),
        description: 'Prescription description',
        state: false,
      };

      const response = await request(app.getHttpServer())
        .post('/prescription')
        .set('Authorization', `Bearer ${doctorAccessToken}`)
        .send(createPrescriptionDto)
        .expect(201);

      prescriptionId = response.body.id;
    });
  });

  describe('Client getting prescriptions by qr code id: /prescription/{qr_code_id} (GET)', () => {
    beforeAll(async () => {
      const loginDto = {
        email: 'user@example.com',
        password: 'test',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      clientAccessToken = response.body.token;
    });

    it('should get client prescriptions successfully', async () => {
      await request(app.getHttpServer())
        .get(`/prescription/${qrCodeId}`)
        .set('Authorization', `Bearer ${clientAccessToken}`)
        .expect(200)
        .expect((res) => {
          expect(
            res.body.find((p: { id: string }) => p.id === prescriptionId),
          ).toBeDefined();
        });
    });
  });

  describe('Doctor getting prescriptions by qr code id: /prescription/{qr_code_id} (GET)', () => {
    it('should get doctor prescriptions successfully', async () => {
      await request(app.getHttpServer())
        .get(`/prescription/${qrCodeId}`)
        .set('Authorization', `Bearer ${doctorAccessToken}`)
        .expect(200)
        .expect((res) => {
          expect(
            res.body.find((p: { id: string }) => p.id === prescriptionId),
          ).toBeDefined();
        });
    });
  });

  describe('Doctor updating prescription: /prescription/{id} (PUT)', () => {
    it('should update prescription successfully', async () => {
      const updatePrescriptionDto = {
        date: new Date(),
        description: 'Updated prescription description',
        state: true,
      };

      await request(app.getHttpServer())
        .put(`/prescription/${prescriptionId}`)
        .set('Authorization', `Bearer ${doctorAccessToken}`)
        .send(updatePrescriptionDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.description).toBe('Updated prescription description');
        });
    });
  });

  describe('Client deleting prescription: /prescription/{id} (DELETE)', () => {
    it('should not allow client to delete prescription', async () => {
      await request(app.getHttpServer())
        .delete(`/prescription/${prescriptionId}`)
        .set('Authorization', `Bearer ${clientAccessToken}`)
        .expect(403);
    });
  });

  describe('Doctor deleting prescription: /prescription/{id} (DELETE)', () => {
    it('should delete prescription successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/prescription/${prescriptionId}`)
        .set('Authorization', `Bearer ${doctorAccessToken}`)
        .expect(200);
    });
  });
});
