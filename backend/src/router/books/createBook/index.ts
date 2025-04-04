import { trpc } from '../../../lib/trpc';
import { zCreateBookTrpcInput } from './input';
 
export const createBookTrpcRoute = trpc.procedure.input(
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