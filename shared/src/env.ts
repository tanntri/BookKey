import { z } from "zod";
import { zNonEmptyTrimmed } from "./zod";

const sharedEnvRaw = {
    CLOUDINARY_CLOUD_NAME: process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    WEBAPP_URL: process.env.VITE_WEBAPP_URL || process.env.WEBAPP_URL
}

const zEnv = z.object({
    WEBAPP_URL: zNonEmptyTrimmed,
    CLOUDINARY_CLOUD_NAME: zNonEmptyTrimmed
})

export const sharedEnv = zEnv.parse(sharedEnvRaw);