import { JwtModuleOptions } from '@nestjs/jwt';
import configuration from './configuration';

export const jwtConfig = (): JwtModuleOptions => {
  const config = configuration();
  return {
    secret: config.jwt.secret,
    signOptions: {
      expiresIn: config.jwt.expiresIn,
    },
  };
};
