import * as dotenv from 'dotenv';
import { z } from 'zod';
import { zNonEmptyTrimmed, zNonEmptyTrimmedRequiredNonLocal } from "@bookkey/shared/src/zod";
import fs from "fs";
import path from "path";

dotenv.config()

const findEnvFilePath = (dir: string): string | null => {
    const maybeEnvFilePath = path.join(dir, '.env');
    // if found .env file, return path
    if (fs.existsSync(maybeEnvFilePath)) {
        return maybeEnvFilePath;
    }
    // reach root, .env not found
    if (dir === '/') {
        return null;
    }
    // if can explore further, go up a level
    return findEnvFilePath(path.dirname(dir));
}

const envFilePath = findEnvFilePath(__dirname);
if (envFilePath) {
    dotenv.config({ path: envFilePath, override: true });
    dotenv.config({ path: `${envFilePath}.${process.env.NODE_ENV}`, override: true })
}

const zEnv = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test', 'local']),
    PORT: zNonEmptyTrimmed,
    HOST_ENV: z.enum(['local']),
    DATABASE_URL: zNonEmptyTrimmed.refine((val) => {
        if (process.env.NODE_ENV !== 'test') {
            return true
        }
        const [databaseUrl] = val.split('?');
        const [databaseName] = databaseUrl.split('/').reverse();
        return databaseName.endsWith('-test');
    }, 'Database name only ends with "-test" on test env'),
    JWT_SECRET: zNonEmptyTrimmed,
    SALT: zNonEmptyTrimmed,
    INITIAL_ADMIN_PASSWORD: zNonEmptyTrimmed,
    WEBAPP_URL: zNonEmptyTrimmed,
    BREVO_API_KEY: zNonEmptyTrimmedRequiredNonLocal,
    FROM_EMAIL_NAME: zNonEmptyTrimmed,
    FROM_EMAIL_ADDRESS: zNonEmptyTrimmed,
    DEBUG: z.string().optional().refine((val) => {
        if (process.env.HOST_ENV === 'local' || process.env.HOST_ENV !== 'production' || !!val && val.length > 0) {
            return true;
        }
    }, 'Required on non-local'),
    BACKEND_SENTRY_DSN: zNonEmptyTrimmedRequiredNonLocal,
    SOURCE_VERSION: zNonEmptyTrimmedRequiredNonLocal
})

export const env = zEnv.parse(process.env);