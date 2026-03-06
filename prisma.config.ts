import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Manually load the .env file
dotenv.config();

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // This now pulls directly from your .env file
    url: process.env.DATABASE_URL,
  },
});