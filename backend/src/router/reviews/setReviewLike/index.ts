import { trpcLoggedProcedure } from "../../../lib/trpc";
import { zSetReviewLikeTrpcInput } from "./input";

export const setReviewLikeTrpcRoute = trpcLoggedProcedure.input(zSetReviewLikeTrpcInput).mutation(async ({ctx, input}) => {
    const { reviewId, likedByCurrUser } = input;
    if (!ctx.me) {
        throw new Error('UNAUTHORIZED');
    }
    const review = await ctx.prisma.review.findUnique({
        where: {
            id: reviewId
        }
    })
    if (!review) {
        throw new Error("Not Found");
    }
    if (likedByCurrUser) {
        // Try to find the existence of the like of the review by current user. 
        // If record is not created yet, create it. If found, update nothing 
        await ctx.prisma.reviewLike.upsert({
            where: {
                reviewId_userId: {
                    reviewId,
                    userId: ctx.me.id
                }
            },
            create: {
                userId: ctx.me.id,
                reviewId
            },
            update: {}
        })
    } else {
        await ctx.prisma.reviewLike.delete({
            where: {
                reviewId_userId: {
                    reviewId,
                    userId: ctx.me.id
                }
            }
        })
    }
    const likesCount = await ctx.prisma.reviewLike.count({
        where: {
            reviewId,
        }
    })

    return {
        review: {
            id: review.id,
            likesCount,
            likedByCurrUser
        }
    }
})