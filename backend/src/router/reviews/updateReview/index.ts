import { ExpectedError } from "../../../lib/error";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { zUpdateReviewTrpcInput } from "./input";

export const updateReviewTrpcRoute = trpcLoggedProcedure.input(zUpdateReviewTrpcInput).mutation(async ({ ctx, input })  => {
    const { reviewId, ...reviewInput } = input;
    console.log('before checking for curr user')
    if (!ctx.me) {
        throw Error('UNAUTHORIZED');
    }
    // check if book exists
    const review = await ctx.prisma.review.findUnique({
        where: {
            id: input.reviewId
        }
    })
    console.log('review to update', review)

    if (!review) {
        console.log('no review')
        throw new ExpectedError('Not Found');
    }
    if (ctx.me.id !== input.userId) {
        throw Error('Unauthorized')
    }

    await ctx.prisma.review.update({
        where: {
            id: reviewId
        },
        data: {
            ...reviewInput
        }
    })
    console.log('got here')
    return true;
})