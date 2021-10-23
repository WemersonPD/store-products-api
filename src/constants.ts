import dotenv from 'dotenv';
dotenv.config({
  path: '.env.development',
});
export class Constants {
  env: 'production' | 'stage' | 'development';
  debug: boolean;
  port: number;
  appName: string;

  timezone: string;
  language: string;

  database: {
    hostWrite: string,
    name: string,
    user: string,
    password: string,
    pool: {
      max: number,
      min: number,
      acquire: number,
      idle: number,
    },
  };

  aws: {
    region: string,
    publicKey: string,
    secretKey: string,
    bucketName: string,
    defaultExpires: number,
  };

  firebase: {
    databaseUrl: string,
    base64Credentials: string,
  };

  mailing: {
    email: string,
    password: string,
  };

  auth: {
    accessTokenExpiration: number,
    refreshTokenExpiration: number,
  };

  constructor(props: any) {
    this.env = props.NODE_ENV;
    this.appName = process.env.NEW_RELIC_APP_NAME;
    this.port = parseInt(process.env.API_PORT, 10);

    this.debug = process.env.DEBUG === 'true';

    this.timezone = process.env.TIMEZONE;
    this.language = process.env.LANGUAGE;

    this.auth = {
      accessTokenExpiration: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10) || 24,
      refreshTokenExpiration: parseInt(process.env.REFRESH_TOKEN_EXPIRATION, 10) || 999,
    };

    this.database = {
      hostWrite: process.env.DATABASE_HOST,
      name: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      pool: {
        max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
        min: parseInt(process.env.DATABASE_POOL_MIN || '1', 10),
        acquire: parseInt(process.env.DATABASE_ACQUIRE || '10000', 10),
        idle: parseInt(process.env.DATABASE_IDLE || '20000', 10) || 10,
      },
    };

    this.firebase = {
      databaseUrl: process.env.FIREBASE_DATABASE_URL,
      base64Credentials: process.env.FIREBASE_BASE64_CREDENTIALS,
    };

    this.mailing = {
      email: process.env.MAILING_EMAIL,
      password: process.env.MAILING_PASSWORD,
    };

    this.aws = {
      region: process.env.AWS_REGION,
      publicKey: process.env.AWS_PUBLIC_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
      bucketName: process.env.AWS_BUCKET_NAME,
      defaultExpires: 7200,
    };
  }
}

export let ConstantsEnv: Constants;

export const initializeEnv: any = (props: any): void => {
  ConstantsEnv = new Constants(props);
};

export const getEnv = (): Constants => ConstantsEnv;