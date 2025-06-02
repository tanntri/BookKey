import { z } from 'zod';
import { zEnvHost, zNonEmptyTrimmed, zNonEmptyTrimmedRequiredNonLocal } from '../../../shared/src/zod';

export const zEnv = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    HOST_ENV: zEnvHost,
    VITE_BACKEND_TRPC_URL: zNonEmptyTrimmed,
    VITE_WEBAPP_URL: zNonEmptyTrimmed,
    VITE_SENTRY_FRONTEND_DSN: zNonEmptyTrimmedRequiredNonLocal,
    SOURCE_VERSION: zNonEmptyTrimmedRequiredNonLocal,
    VITE_CLOUDINARY_CLOUD_NAME: zNonEmptyTrimmed,
    VITE_MIXPANEL_API_KEY: zNonEmptyTrimmedRequiredNonLocal
})

const envFromBackend = (window as any).webappEnvFromBackend;
// in development, window.webappEnvFromBackend will be { replaceMeWithPublicEnv: true }, so we use process.env
// in production, it's replaced with actual env from backend, so we use it instead
export const env = zEnv.parse(envFromBackend?.replaceMeWithPublicEnv ? process.env : envFromBackend);

console.log(env.SOURCE_VERSION)