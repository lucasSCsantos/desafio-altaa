declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DB_PASSWORD: string;
      DB_USER: string;
      DB_PORT: string;
      DB_HOST: string;
      DB_NAME: string;
      DATABASE_URL: string;
      JWT_KEY: string;
      RESEND_API_KEY: string;
      RESEND_EMAIL: string;
      SENDGRID_API_KEY: string;
      FAKER_PASSWORD_HASH: string;
    }
  }
}

export {};
