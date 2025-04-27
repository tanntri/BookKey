import { trpcLoggedProcedure } from '../../../lib/trpc';
import { z } from 'zod';

export const getReviewTrpcRoute = trpcLoggedProcedure.input(
        (z.object({
            id: z.string()
        }))
    ).query(async ({ctx, input}) => {
        const rawReview = await ctx.prisma.review.findUnique({
            where: {
                id: input.id
            },
            include: {
                reviewsLikes: {
                    select: {
                        id: true
                    },
                    where: {
                        userId: ctx.me?.id
                    }
                },
                _count: {
                    select: {
                        reviewsLikes: true
                    }
                }
            }
        })
        const isLikedByCurrUser = !!rawReview?.reviewsLikes.length;
        const likesCount = rawReview?._count.reviewsLikes || 0;
        const review = { ...rawReview, isLikedByCurrUser: isLikedByCurrUser, likesCount: likesCount }
        return { review }
    })