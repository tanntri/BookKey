import { z } from 'zod';

export const zCreateBookTrpcInput = z.object({
    book: z.string().min(1).max(30),
    isbn: z.string().min(5),
    author: z.string().min(1),
    description: z.string().min(30),
    // reviewer: z.string().min(1).regex(/^[A-Za-z0-9-_ ]+$/, 'Reviewer name must contain only lowercase letters, numbers'),
    // reviewer: z.string(),
    // review: z.string().min(50)
    // review: z.string()
})