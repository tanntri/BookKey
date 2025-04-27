import { z } from "zod";
import { zStringMin } from "@bookkey/shared/src/zod";

export const zUpdateProfileTrpcInput = z.object({
    username: zStringMin(4)
        .regex(/^[a-zA-Z0-9-]+$/, 'Username may contain only letters, numbers, and dashes'),
    displayedName: z.string().optional()
})