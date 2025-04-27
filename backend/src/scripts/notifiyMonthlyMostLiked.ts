import { type Book } from "@prisma/client";
import { type AppContext } from "../lib/ctx";
import { sendMostLikedBooksEmail } from "../lib/emails";

export const notifyMonthlyMostLiked = async (ctx: AppContext) => {
    const mostLikedBooks = await ctx.prisma.$queryRaw<
        Array<Pick<Book, 'book' | 'isbn'> & { monthlyBooksLikesCount: number }>
    >`
        with "topBooks" as (
            select book, isbn, (
                select count(*)::int from "BookLike"
                where "BookLike"."bookIsbn" = "Book"."isbn"
                    and "BookLike"."createdAt" > now() - interval '1 month'
            ) as "monthlyBooksLikesCount" from "Book"
            order by "monthlyBooksLikesCount" desc
            limit 5
        ) 
        select * from "topBooks" where "monthlyBooksLikesCount" > 0
    `
    if (!mostLikedBooks.length) {
        return;
    }

    const users = await ctx.prisma.user.findMany({
        select: {
            email: true
        }
    });

    for (const user of users) {
        await sendMostLikedBooksEmail({ user, books: mostLikedBooks })
    }

    console.log(mostLikedBooks);
}