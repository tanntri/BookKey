import { z } from 'zod';

export const zSignUpTrpcInput = z.object({
    username: z
        .string()
        .min(4)
        .regex(/^[a-zA-Z0-9-]+$/, 'Username may contain only letters, numbers, and dashes'),
    email: z.string().email(),
    password: z.string().min(4 )
})