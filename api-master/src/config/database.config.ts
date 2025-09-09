import { SequelizeModuleOptions } from '@nestjs/sequelize';
import configuration from './configuration';
import { Dialect } from 'sequelize';

export const databaseConfig = (): SequelizeModuleOptions => {
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
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
};
