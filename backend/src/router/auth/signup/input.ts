import { z } from 'zod';
import { zStringMin, zEmailRequired } from '@bookkey/shared/src/zod';

export const zSignUpTrpcInput = z.object({
    username: zStringMin(4)
        .regex(/^[a-zA-Z0-9-]+$/, 'Username may contain only letters, numbers, and dashes'),
    email: zEmailRequired,
    password: zStringMin(4)
})