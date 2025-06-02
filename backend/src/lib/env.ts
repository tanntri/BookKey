import * as dotenv from 'dotenv';
import { z } from 'zod';
import { zNonEmptyTrimmed, zNonEmptyTrimmedRequiredNonLocal } from "@bookkey/shared/src/zod";
import fs from "fs";
import path from "path";

dotenv.config()

const findEnvFilePath = (dir: string, pathPart: string): string | null => {
    const maybeEnvFilePath = path.join(dir, pathPart);
    if (fs.existsSync(maybeEnvFilePath)) {
        return maybeEnvFilePath;
    }
    if (dir === '/') {
        return null
    }
    return findEnvFilePath(path.dirname(dir), pathPart);
}

const webappEnvFilePath = findEnvFilePath(__dirname, "webapp/.env");
if (webappEnvFilePath) {
    dotenv.config({ path: webappEnvFilePath, override: true });
    dotenv.config({ path: `${webappEnvFilePath}.${process.env.NODE_ENV}`, override: true });
}

const backendEnvFilePath = findEnvFilePath(__dirname, "backend/.env");
if (backendEnvFilePath) {
    dotenv.config({ path: backendEnvFilePath, override: true });
    dotenv.config({ path: `${backendEnvFilePath}.${process.env.NODE_ENV}`, override: true });
}

const zEnv = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test', 'local']),
    PORT: zNonEmptyTrimmed,
    HOST_ENV: z.enum(['local', 'production']),
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
    SOURCE_VERSION: zNonEmptyTrimmedRequiredNonLocal,
    CLOUDINARY_API_KEY: zNonEmptyTrimmedRequiredNonLocal,
    CLOUDINARY_API_SECRET: zNonEmptyTrimmedRequiredNonLocal,
    CLOUDINARY_CLOUD_NAME: zNonEmptyTrimmed
})

export const env = zEnv.parse(process.env);