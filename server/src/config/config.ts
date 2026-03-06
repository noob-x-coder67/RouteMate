
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') }); // Load from root if exists, or local

// Fallback to defaults
export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    db: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/routemate?schema=public',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'super-secret-key-change-this',
        accessExpiration: '15m',
        refreshExpiration: '7d',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    }
};
