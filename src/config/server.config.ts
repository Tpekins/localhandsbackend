import { registerAs } from '@nestjs/config';

export const ServerConfig = registerAs(
  'server',
  (): ServerConfig => ({
    nodeEnv: process.env.NODE_ENV || 'development',
  }),
);

export interface ServerConfig {
  nodeEnv: string;
}
