import { z } from 'zod';
import { zEnvHost, zNonEmptyTrimmed, zNonEmptyTrimmedRequiredNonLocal } from '../../../shared/src/zod';

export const zEnv = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    HOST_ENV: zEnvHost,
    VITE_BACKEND_TRPC_URL: zNonEmptyTrimmed,
    VITE_WEBAPP_URL: zNonEmptyTrimmed,
    VITE_SENTRY_FRONTEND_DSN: zNonEmptyTrimmedRequiredNonLocal,
    SOURCE_VERSION: zNonEmptyTrimmedRequiredNonLocal
})

export const env = zEnv.parse(process.env);