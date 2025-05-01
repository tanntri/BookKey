import { zCreateBookTrpcInput } from './input';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { ExpectedError } from '../../../lib/error';
 
export const createBookTrpcRoute = trpcLoggedProcedure.input(
        (zCreateBookTrpcInput)
    ).mutation(async ({ctx, input}) => {
        if (!ctx.me) {
            throw Error('UNAUTHORIZED');
        }
        const existingBook = await ctx.prisma.book.findUnique({
            where: {
                isbn: input.isbn
            }
        })
        if (existingBook) {
            throw new ExpectedError('Book already existed');
        }
        await ctx.prisma.book.create({
            data: input
        })
        return true;
    }) 