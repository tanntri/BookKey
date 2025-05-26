import { z } from 'zod';
import { zStringOptional } from '@bookkey/shared/src/zod';

export const zGetBooksTrpcInput = z.object({
    limit: z.number().min(1).max(100).default(10),
    search: zStringOptional,
    cursor: z.coerce.number().optional(),
    category: z.string()
})