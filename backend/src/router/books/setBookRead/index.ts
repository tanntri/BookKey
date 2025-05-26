import { zSetBookRead } from "./input";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { ExpectedError } from "../../../lib/error";

export const setBookReadTrpcRoute = trpcLoggedProcedure.input(zSetBookRead).mutation(async ({ctx, input}) => {
    const { bookId, readByCurrUser } = input;
    if (!ctx.me) {
        throw new ExpectedError('UNAUTHORIZED');
    }
    if (readByCurrUser) {
        // Try to find the existence of the like of the book by current user. 
        // If record is not created yet, create it. If found, update nothing 
        await ctx.prisma.bookRead.upsert({
            where: {
                bookId_userId: {
                    bookId,
                    userId: ctx.me.id
                }
            },
            create: {
                userId: ctx.me.id,
                bookId
            },
            update: {}
        })
    } else {
        await ctx.prisma.bookRead.delete({
            where: {
                bookId_userId: {
                    bookId,
                    userId: ctx.me.id
                }
            }
        })
    }

    return {
        book: {
            bookId,
            readByCurrUser
        }
    }
})