import { z } from "zod";

export const zUpdateProfileTrpcInput = z.object({
    username: z.string()
        .min(4)
        .regex(/^[a-zA-Z0-9-]+$/, 'Username may contain only letters, numbers, and dashes'),
    displayedName: z.string().optional()
})