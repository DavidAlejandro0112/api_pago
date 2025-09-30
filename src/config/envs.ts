import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  APP_PORT: number;
  DB_TYPE: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
  PAYMENT_SERVICE_URL?: string;
}
const envSchema = joi
  .object({
    APP_PORT: joi.number().required(),
    DB_TYPE: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),
    PAYMENT_SERVICE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const envVars: EnvVars = value;

export const envs = {
  port: envVars.APP_PORT,
  db: {
    type: envVars.DB_TYPE,
    port: envVars.DB_PORT,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_NAME,
    host: envVars.DB_HOST,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expires_in: envVars.JWT_EXPIRES_IN,
  },
  paymentService: {
    url: envVars.PAYMENT_SERVICE_URL,
  },
};
