import { registerAs } from '@nestjs/config';

export const ServerConfig = registerAs(
  'server',
  (): ServerConfig => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    corsOrigin: process.env.CORS_ORIGIN || '*',
  }),
);

export interface ServerConfig {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
}
