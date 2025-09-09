import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/services/email.service';
import { TestDatabase, testDatabaseConfig } from './test-database.utils';
import { SequelizeModule } from '@nestjs/sequelize';

class MockMailService {
  private verificationCode: string;

  async sendMail(to: string, subject: string, text: string) {
    const codeMatch = text.match(/(\d{6})/);
    if (codeMatch) {
      this.verificationCode = codeMatch[1];
    }
    return true;
  }

  getVerificationCode() {
    return this.verificationCode;
  }
}
let app: INestApplication;
let accessToken: string;
let db: TestDatabase;

describe('AuthController (e2e)', () => {
  let mockMailService: MockMailService;
  let verificationCode: string;

  beforeAll(async () => {
    mockMailService = new MockMailService();
    db = new TestDatabase();

    await db.start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        SequelizeModule.forRootAsync({
          useFactory: async () => testDatabaseConfig(db.container),
        }),
      ],
    })
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await db.stop();
  });

  it('/auth/register (POST)', async () => {
    const registerDto = {
      email: 'user@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);
  });

  it('/auth/resend-verification-code (POST)', async () => {
    const resendVerificationCodeDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    await request(app.getHttpServer())
      .post('/auth/resend-verification-code')
      .send(resendVerificationCodeDto)
      .expect(201);
  });

  it('/auth/send-password-email (POST)', async () => {
    const sendPasswordEmailDto = {
      email: 'user@example.com',
      emailType: 'reset',
    };

    await request(app.getHttpServer())
      .post('/auth/send-password-email')
      .send(sendPasswordEmailDto)
      .expect(201);

    verificationCode = mockMailService.getVerificationCode();
  });

  it('/auth/reset-password (POST)', async () => {
    const resetPasswordDto = {
      email: 'user@example.com',
      code: verificationCode,
      password: 'newpassword123',
    };

    await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send(resetPasswordDto)
      .expect(201);
  });

  it('/auth/login (POST)', async () => {
    const loginDto = {
      email: 'user@example.com',
      password: 'newpassword123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201);

    accessToken = response.body.token;
    console.log('Login Response:', response.body); // Log the login response for debugging
  });

  it('/auth/send-password-email (POST) for change password', async () => {
    const sendPasswordEmailDto = {
      email: 'user@example.com',
      emailType: 'change',
    };

    await request(app.getHttpServer())
      .post('/auth/send-password-email')
      .send(sendPasswordEmailDto)
      .expect(201);

    verificationCode = mockMailService.getVerificationCode();
  });

  it('/auth/change-password (POST)', async () => {
    const changePasswordDto = {
      oldPassword: 'newpassword123',
      newPassword: 'newpassword456',
      code: verificationCode,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(changePasswordDto);
    expect(response.status).toBe(201);
  });
});
