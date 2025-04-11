import { trpc } from "../../../lib/trpc";
import { canBlockContent } from "../../../utils/can";
import { zBlockReviewTrpcInput } from "./input";

export const blockReviewTrpcRoute = trpc.procedure.input(zBlockReviewTrpcInput).mutation(async ({ctx, input}) => {
    const { reviewId } = input;
    if (!canBlockContent(ctx.me)) {
        throw new Error("PERMISSION_DENIED");
    }
    const review = await ctx.prisma.review.findUnique({
        where: {
            blockedAt: null,
            id: reviewId
        }
    })
    if (!review) {
        throw new Error("NOT_FOUND");
    }
    await ctx.prisma.review.update({
        where: {
            id: reviewId
        },
        data: {
            blockedAt: new Date()
        }
    })

    return true;

})