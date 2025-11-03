import { SequelizeModuleOptions } from '@nestjs/sequelize';
import configuration from './configuration'; 
import { Dialect } from 'sequelize';

export const databaseConfig = (): SequelizeModuleOptions => {
  if (process.env.DATABASE_URL) {
    const dbUrl = new URL(process.env.DATABASE_URL);

    return {
      dialect: 'postgres',
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port, 10),
      username: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1), 
      autoLoadModels: true,
      synchronize: true, 
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, 
        },
      },
    };
  }

  const config = configuration();
  return {
    dialect: config.database.dialect as Dialect,
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    autoLoadModels: true,
    synchronize: true,
  };
};