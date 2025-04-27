import { z } from 'zod';
import { zStringRequired, zStringMin } from '@bookkey/shared/src/zod';

export const zCreateReviewTrpcInput = z.object({
    title: zStringRequired.max(30),
    text: zStringMin(5),
    score: z.coerce.number().min(1).max(5),
    bookId: zStringRequired,
    userId: zStringRequired
})