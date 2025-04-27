import { z } from 'zod';
import { zStringMin, zStringRequired } from '@bookkey/shared/src/zod';

export const zCreateBookTrpcInput = z.object({
    book: zStringMin(4).max(30),
    isbn: zStringMin(10).max(13),
    author: zStringRequired,
    description: zStringMin(30),
    // reviewer: z.string().min(1).regex(/^[A-Za-z0-9-_ ]+$/, 'Reviewer name must contain only lowercase letters, numbers'),
    // reviewer: z.string(),
    // review: z.string().min(50)
    // review: z.string()
})