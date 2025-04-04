import { trpc } from '../../../lib/trpc';
import { zCreateReviewTrpcInput } from './input';
 
export const createReviewTrpcRoute = trpc.procedure.input(
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
        console.log('existingreviewforbook', existingReviewForBook)
        if (existingReviewForBook) {
            throw Error('Review for this book by this user already existed');
        }
        console.log('got passed throw error')
        await ctx.prisma.review.create({
            data: {
                ...input, userId: ctx.me.id
            }
        })
        return true;
    }) 