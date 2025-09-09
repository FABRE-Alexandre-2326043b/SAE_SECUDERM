import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from '../src/modules/users/users.model';
import { QRCode } from '../src/modules/qrcode/qrcode.model';
import { Dialect } from 'sequelize';
import * as process from 'node:process';
import { UserType } from '../src/modules/users/enums/user.enums';

dotenv.config({ path: '.env.test.local' });

export class TestDatabase {
  public container: StartedTestContainer | null = null;
  public sequelize: Sequelize | null = null;

  async start(): Promise<void> {
    const {
      DB_TEST_USER,
      DB_TEST_PASSWORD,
      DB_TEST_NAME,
      DB_TEST_PORT,
      DB_TEST_IMAGE,
      DB_TEST_DIALECT,
    } = process.env;

    this.container = await new GenericContainer(DB_TEST_IMAGE)
      .withExposedPorts(parseInt(DB_TEST_PORT, 10))
      .withEnvironment({
        POSTGRES_USER: DB_TEST_USER,
        POSTGRES_PASSWORD: DB_TEST_PASSWORD,
        POSTGRES_DB: DB_TEST_NAME,
      })
      .start();

    const mappedPort = this.container.getMappedPort(parseInt(DB_TEST_PORT, 10));

    await new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const sequelize = new Sequelize({
            dialect: DB_TEST_DIALECT as Dialect,
            host: this.container.getHost(),
            port: mappedPort,
            username: DB_TEST_USER,
            password: DB_TEST_PASSWORD,
            database: DB_TEST_NAME,
            logging: false,
          });
          await sequelize.authenticate();
          console.log('Database is ready');
          clearInterval(interval);
          resolve();
        } catch {
          console.log('Waiting for database...');
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Database did not start in time'));
      }, 30000);
    });

    this.sequelize = new Sequelize({
      dialect: DB_TEST_DIALECT as Dialect,
      host: this.container.getHost(),
      port: mappedPort,
      username: DB_TEST_USER,
      password: DB_TEST_PASSWORD,
      database: DB_TEST_NAME,
      logging: false,
    });

    this.sequelize.addModels([User, QRCode]);
    await this.sequelize.sync();
  }

  async seedAdminUser(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('test', salt);

    try {
      await this.sequelize.models.User.create({
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'Admin',
        password,
        role: 'admin',
        type: 'client',
        isEmailVerified: true,
      });
      console.log('Admin user seeded');
    } catch (error) {
      console.error('Error seeding admin user:', error);
    }
  }

  async seedUser(type: UserType, email: string): Promise<any> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('test', salt);

    try {
      return await this.sequelize.models.User.create({
        email: email,
        first_name: 'User',
        last_name: 'User',
        password,
        role: 'user',
        type: type,
        isEmailVerified: true,
      });
    } catch (error) {
      console.error('Error seeding user:', error);
    }
  }

  async seedQRCode(clientId: string): Promise<any> {
    try {
      return await this.sequelize.models.QRCode.create({
        label: 'QR Code',
        ref_product: 'Product',
        dimension: '10x10',
        lot_number: '123456',
        expiration_date: new Date(),
        client_id: clientId,
      });
    } catch (error) {
      console.error('Error seeding QR Code:', error);
    }
  }

  async stop(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.close();
    }
    if (this.container) {
      await this.container.stop();
    }
  }

  async reset(): Promise<void> {
    if (this.sequelize) {
      const models = this.sequelize.models;
      await Promise.all(
        Object.keys(models).map((modelName) =>
          models[modelName].destroy({ where: {}, truncate: true, force: true }),
        ),
      );
    }
  }
}

export const testDatabaseConfig = (
  container: StartedTestContainer,
): SequelizeModuleOptions => ({
  dialect: process.env.DB_TEST_DIALECT as Dialect,
  host: container.getHost(),
  port: container.getMappedPort(Number(process.env.DB_TEST_PORT)),
  username: process.env.DB_TEST_USER,
  password: process.env.DB_TEST_PASSWORD,
  database: process.env.DB_TEST_NAME,
  autoLoadModels: true,
  synchronize: true,
  logging: false,
});
