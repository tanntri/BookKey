import { zSetBookmarks } from "./input";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { ExpectedError } from "../../../lib/error";

export const setBookmarkTrpcRoute = trpcLoggedProcedure.input(zSetBookmarks).mutation(async ({ctx, input}) => {
    const { bookId, savedByCurrUser } = input;
    if (!ctx.me) {
        throw new ExpectedError('UNAUTHORIZED');
    }
    if (savedByCurrUser) {
        // Try to find the existence of the like of the book by current user. 
        // If record is not created yet, create it. If found, update nothing 
        await ctx.prisma.bookmark.upsert({
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
        await ctx.prisma.bookmark.delete({
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
            savedByCurrUser
        }
    }
})