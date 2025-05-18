import { cloudinaryUploadTypes } from "@bookkey/shared/src/cloudinary";
import { z } from "zod";

export const zPrepareCloudinaryUploadTrpcInput = z.object({
    type: z.enum(Object.keys(cloudinaryUploadTypes) as [string, ...string[]])
})