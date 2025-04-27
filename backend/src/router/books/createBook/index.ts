import { zCreateBookTrpcInput } from './input';
import { trpcLoggedProcedure } from '../../../lib/trpc';
 
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
            throw Error('Book already existed');
        }
        await ctx.prisma.book.create({
            data: input
        })
        return true;
    }) 