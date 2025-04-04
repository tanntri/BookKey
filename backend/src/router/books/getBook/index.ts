import { trpc } from '../../../lib/trpc';
import { z } from 'zod';

export const getBookTrpcRoute = trpc.procedure.input(
        (z.object({
            isbn: z.string()
        }))
    ).query(async ({ctx, input}) => {
        const book = await ctx.prisma.book.findUnique({
            where: {
                isbn: input.isbn
            }
        })
        return { book }
    })