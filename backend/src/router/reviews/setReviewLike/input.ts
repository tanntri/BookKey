import { z } from "zod";
import { zStringRequired } from "@bookkey/shared/src/zod";

export const zSetReviewLikeTrpcInput = z.object({
    reviewId: zStringRequired,
    likedByCurrUser: z.boolean() 
})