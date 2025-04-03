import { z } from "zod";
import { zCreateReviewTrpcInput } from "../../createReview/input";

export const zUpdateReviewTrpcInput = zCreateReviewTrpcInput.extend({
    reviewId: z.string().min(1).optional()
})