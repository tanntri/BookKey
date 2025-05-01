import { zSetBookLikeTrpcInput } from "./input";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { ExpectedError } from "../../../lib/error";

export const setBookLikeTrpcRoute = trpcLoggedProcedure.input(zSetBookLikeTrpcInput).mutation(async ({ctx, input}) => {
    const { bookIsbn, likedByCurrUser } = input;
    if (!ctx.me) {
        throw new ExpectedError('UNAUTHORIZED');
    }
    const book = await ctx.prisma.book.findUnique({
        where: {
            isbn: bookIsbn
        }
    })
    if (!book) {
        throw new ExpectedError("Not Found");
    }
    if (likedByCurrUser) {
        // Try to find the existence of the like of the book by current user. 
        // If record is not created yet, create it. If found, update nothing 
        await ctx.prisma.bookLike.upsert({
            where: {
                bookIsbn_userId: {
                    bookIsbn,
                    userId: ctx.me.id
                }
            },
            create: {
                userId: ctx.me.id,
                bookIsbn
            },
            update: {}
        })
    } else {
        await ctx.prisma.bookLike.delete({
            where: {
                bookIsbn_userId: {
                    bookIsbn,
                    userId: ctx.me.id
                }
            }
        })
    }
    const likesCount = await ctx.prisma.bookLike.count({
        where: {
            bookIsbn,
        }
    })

    return {
        book: {
            id: book.id,
            isbn: bookIsbn,
            likesCount,
            likedByCurrUser
        }
    }
})