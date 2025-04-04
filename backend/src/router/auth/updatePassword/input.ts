import { z } from "zod";

export const zUpdatePasswordTrpcInput = z.object({
    oldPassword: z.string().min(4),
    newPassword: z.string().min(4)
})