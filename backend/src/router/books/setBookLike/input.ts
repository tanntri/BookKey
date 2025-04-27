import { z } from "zod";
import { zStringRequired } from "@bookkey/shared/src/zod";

export const zSetBookLikeTrpcInput = z.object({
    bookIsbn: zStringRequired,
    likedByCurrUser: z.boolean() 
})