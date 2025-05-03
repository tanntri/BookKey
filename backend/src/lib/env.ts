import * as dotenv from 'dotenv';
import { z } from 'zod';
import { zNonEmptyTrimmed, zNonEmptyTrimmedRequiredNonLocal } from "@bookkey/shared/src/zod"

dotenv.config()

// const zNonEmptyTrimmed = z.string().trim().min(1);
// const zNonEmptyTrimmedRequiredNonLocal = zNonEmptyTrimmed.optional().refine(
//     (val) => process.env.HOST_ENV === 'local' || !!val,
//     'Required on local host'
// )s

const zEnv = z.object({
    PORT: zNonEmptyTrimmed,
    HOST_ENV: z.enum(['local']),
    DATABASE_URL: zNonEmptyTrimmed,
    JWT_SECRET: zNonEmptyTrimmed,
    SALT: zNonEmptyTrimmed,
    INITIAL_ADMIN_PASSWORD: zNonEmptyTrimmed,
    WEBAPP_URL: zNonEmptyTrimmed,
    BREVO_API_KEY: zNonEmptyTrimmedRequiredNonLocal,
    FROM_EMAIL_NAME: zNonEmptyTrimmed,
    FROM_EMAIL_ADDRESS: zNonEmptyTrimmed,
    DEBUG: zNonEmptyTrimmed,
    BACKEND_SENTRY_DSN: zNonEmptyTrimmedRequiredNonLocal,
    SOURCE_VERSION: zNonEmptyTrimmedRequiredNonLocal
})

export const env = zEnv.parse(process.env);