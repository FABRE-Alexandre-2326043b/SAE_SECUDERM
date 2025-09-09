import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestDatabase, testDatabaseConfig } from './test-database.utils';
import { SequelizeModule } from '@nestjs/sequelize';

let app: INestApplication;
let adminAccessToken: string;
let userAccessToken: string;
let adminId: string;
let userId: string;
let db: TestDatabase;

describe('UsersController (e2e)', () => {
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

    await db.seedAdminUser();

    const loginDto = {
      email: 'admin@example.com',
      password: 'test',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201);

    adminAccessToken = response.body.token;
  });

  afterAll(async () => {
    await app.close();
    await db.stop();
  });

  describe('Admin creating user : /users (POST)', () => {
    it('should create an user successfully', async () => {
      const createUserDto = {
        email: 'testUser@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'test',
        role: 'user',
        type: 'client',
      };

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.role).toBe('user');
        });
    });

    it('should create an admin successfully', async () => {
      const createUserDto = {
        email: 'testAdmin@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'test',
        role: 'admin',
        type: 'client',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.role).toBe('admin');
        });

      adminId = response.body.id;
    });
  });

  describe('User updating user : /users/:id (PUT)', () => {
    beforeAll(async () => {
      const loginDto = {
        email: 'testUser@example.com',
        password: 'test',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      userAccessToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should update user data successfully', async () => {
      const updateUserDto = {
        first_name: 'Jane',
        last_name: 'Doe',
      };

      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.first_name).toBe('Jane');
        });
    });

    it('should not allow user to update another user', async () => {
      const updateUserDto = {
        first_name: 'Jane',
        last_name: 'Doe',
      };

      await request(app.getHttpServer())
        .put(`/users/${adminId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(updateUserDto)
        .expect(403);
    });
  });

  describe('User get user data : /users/:id (GET)', () => {
    it('should get user data successfully', async () => {
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
        });
    });

    it('should not allow user to get another user', async () => {
      await request(app.getHttpServer())
        .get(`/users/${adminId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);
    });
  });

  describe('User delete user : /users/:id (DELETE)', () => {
    it('should not allow user to delete another user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${adminId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);
    });

    it('should delete user successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);
    });
  });
});
