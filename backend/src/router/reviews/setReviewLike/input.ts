import { boolean, z } from "zod";

export const zSetReviewLikeTrpcInput = z.object({
    reviewId: z.string().min(1),
    likedByCurrUser: z.boolean() 
})