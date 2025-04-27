import { z } from "zod";
import { zStringRequired } from "@bookkey/shared/src/zod";

export const zBlockReviewTrpcInput = z.object({
    reviewId: zStringRequired
})