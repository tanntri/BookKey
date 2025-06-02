import { z } from "zod";
import { zNonEmptyTrimmed } from "./zod";

declare global {
    const webappEnvFromBackend: Record<string, string> | undefined;
}

const windowEnv = typeof webappEnvFromBackend !== 'undefined' ? webappEnvFromBackend : {};
const getSharedEnvVariables = (key: string) => windowEnv[`VITE_${key}`] || windowEnv[key] || process.env[`VITE_${key}`] || process.env[key];

const sharedEnvRaw = {
    CLOUDINARY_CLOUD_NAME: getSharedEnvVariables('CLOUDINARY_CLOUD_NAME'),
    WEBAPP_URL: getSharedEnvVariables('WEBAPP_URL')
}

const zEnv = z.object({
    WEBAPP_URL: zNonEmptyTrimmed,
    CLOUDINARY_CLOUD_NAME: zNonEmptyTrimmed
})

export const sharedEnv = zEnv.parse(sharedEnvRaw);