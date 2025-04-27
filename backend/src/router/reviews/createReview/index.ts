import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zCreateReviewTrpcInput } from './input';
 
export const createReviewTrpcRoute = trpcLoggedProcedure.input(
        (zCreateReviewTrpcInput)
    ).mutation(async ({ctx, input}) => {
        if (!ctx.me) {
            throw Error('UNAUTHORIZED');
        }
        const existingReviewForBook = await ctx.prisma.review.findFirst({
            where: {
                AND: [{
                    bookId: input.bookId
                },
                {
                    userId: ctx.me.id
                }]
                
                // bookId: input.bookId,
                // userId: ctx.me.id
            }
        })
        if (existingReviewForBook) {
            throw Error('Review for this book by this user already existed');
        }
        await ctx.prisma.review.create({
            data: {
                ...input, userId: ctx.me.id
            }
        })
        return true;
    }) 