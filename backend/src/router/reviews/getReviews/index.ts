import _ from 'lodash';
import { trpc } from '../../../lib/trpc';
import { z } from 'zod';

export const getReviewsTrpcRoute = trpc.procedure.input(
    (z.object({
        bookId: z.string()
    }))
).query(async ({ctx, input}) => {
        // get reviews and join with User table to get usernames
        const reviews = await ctx.prisma.review.findMany({
            where: {
                bookId: input.bookId
            },
            include: {
                user: {
                    select: {
                        username: true
                    },
                },
            },
        })

        return { reviews }
    })