import _ from 'lodash';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { z } from 'zod';

export const getReviewsTrpcRoute = trpcLoggedProcedure.input(
    (z.object({
        bookId: z.string()
    }))
).query(async ({ctx, input}) => {
        // get reviews and join with User table to get usernames
        const rawReviews = await ctx.prisma.review.findMany({
            where: {
                blockedAt: null,
                bookId: input.bookId
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true
                    },
                },
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
            },
            orderBy: [{
                createdAt: 'desc'
            }]
        })

        const reviews = rawReviews.map((review) => {
            const isLikedByCurrUser = !!review.reviewsLikes.length;
            return {...review, likesCount: review._count.reviewsLikes || 0, isLikedByCurrUser: isLikedByCurrUser}
        })
        return { reviews }
    })