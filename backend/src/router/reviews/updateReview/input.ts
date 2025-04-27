import { zCreateReviewTrpcInput } from "../createReview/input";
import { zStringOptional } from "@bookkey/shared/src/zod";

export const zUpdateReviewTrpcInput = zCreateReviewTrpcInput.extend({
    reviewId: zStringOptional
})