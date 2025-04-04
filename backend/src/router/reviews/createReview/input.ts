import { z } from 'zod';

export const zCreateReviewTrpcInput = z.object({
    title: z.string().min(1).max(30),
    text: z.string().min(5),
    score: z.coerce.number().min(1).max(5),
    bookId: z.string().min(1),
    userId: z.string().min(1)
})