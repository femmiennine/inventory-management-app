import * as dotenv from 'dotenv';
dotenv.config();

export const dev = {
  app: {
    port: process.env.PORT || 8000,
    private_key: process.env.JWT_SECRET || 'secret',
  },
  db: {
    url: process.env.DEV_DB_URL || '',
  },
  smtp: {
    auth_email: process.env.SMTP_AUTH_EMAIL || '',
    auth_password: process.env.SMTP_AUTH_PASSWORD || '',
  },
};
