import { z } from 'zod';
import { zStringMin } from '@bookkey/shared/src/zod';

export const zSignInTrpcInput = z.object({
    username: zStringMin(4),
    password: zStringMin(4)
})