import { z } from "zod";

export const zBlockReviewTrpcInput = z.object({
    reviewId: z.string().min(1)
})