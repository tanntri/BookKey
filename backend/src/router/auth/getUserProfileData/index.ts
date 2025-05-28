import { z } from "zod";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { AppContext } from "../../../lib/ctx";
import { getBooksInfo, getBooksSomethingByUser } from "../../../utils/utils";

const getUserInfo = async (ctx: AppContext, userId: string) => {
    const userInfo = await ctx.prisma.user.findUnique({
        select: {
            avatar: true,
            username: true
        },
        where: {
            id: userId
        }
    })
    return userInfo;
}

const getBookStats = async (ctx: AppContext, userId: string) => {
    const year = 2025;

    const result: { month: string; source: string; count: number }[] = await ctx.prisma.$queryRaw`
        SELECT TO_CHAR("createdAt", 'YYYY-MM') AS month, 'bookRead' AS source, COUNT(*) AS count
        FROM "BookRead"
        WHERE "userId" = ${userId}
        AND EXTRACT(YEAR FROM "createdAt") = ${year}
        GROUP BY month

        UNION ALL

        SELECT TO_CHAR("createdAt", 'YYYY-MM') AS month, 'library' AS source, COUNT(*) AS count
        FROM "Library"
        WHERE "userId" = ${userId}
        AND EXTRACT(YEAR FROM "createdAt") = ${year}
        GROUP BY month`;

    const months = Array.from({ length: 12 }, (_, i) =>
        `${year}-${String(i + 1).padStart(2, '0')}`
    );
    console.log(months);
  
    const output = months.map((month) => {
        const libraryEntry = result.find((r) => r.month === month && r.source === 'library');
        const bookReadEntry = result.find((r) => r.month === month && r.source === 'bookRead');
    
        return {
            name: month,
            library: Number(libraryEntry?.count || 0),
            bookRead: Number(bookReadEntry?.count || 0),
        };
    });
    return output
}

export const getUserProfileTrpcRoute = trpcLoggedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
        const rawBookmarks = await ctx.prisma.bookmark.findMany({
            where: {
                userId: input.userId
            },
            orderBy: [{
                createdAt: 'desc'
            }]
        })
        const rawBooksRead = await ctx.prisma.bookRead.findMany({
            where: {
                userId: input.userId
            },
            orderBy: [{
                createdAt: 'desc'
            }]
        })
        const rawBooksPossessed = await ctx.prisma.library.findMany({
            where: {
                userId: input.userId
            },
            orderBy: [{
                createdAt: 'desc'
            }]
        })
        const rawReviews = await ctx.prisma.review.findMany({
            where: {
                userId: input.userId
            },
            orderBy: [{
                createdAt: 'desc'
            }]
        })

        // Get data for bookmarks
        const booksMarkedIds = rawBookmarks.map((bookmark) => bookmark.bookId);
        const booksMarkedResponse = await getBooksSomethingByUser(booksMarkedIds);
        const booksMarked = await getBooksInfo(booksMarkedResponse);

        // Get data for books read
        const booksReadIds = rawBooksRead.map((bookRead) => bookRead.bookId);
        const booksReadResponse = await getBooksSomethingByUser(booksReadIds);
        const booksRead = await getBooksInfo(booksReadResponse);

        // Get data for user's library
        const booksPossessedIds = rawBooksPossessed.map((bookPossessed) => bookPossessed.bookId);
        const booksPossessedResponse = await getBooksSomethingByUser(booksPossessedIds);
        const booksPossessed = await getBooksInfo(booksPossessedResponse);

        // Get data for reviews user left
        const booksReviewedIds = rawReviews.map((review) => review.bookId);
        const booksReviewedResponse = await getBooksSomethingByUser(booksReviewedIds);
        const rawBooksInfo = await getBooksInfo(booksReviewedResponse);
        const booksReviewed = rawReviews.map(review => {
            const book = rawBooksInfo.find(rawBookInfo => rawBookInfo.id === review.bookId);
            if (book) {
                return { review, book };
            }
            return null;
        }).filter(Boolean); // removes nulls

        const userInfo = await getUserInfo(ctx, input.userId);
        const bookStats = await getBookStats(ctx, input.userId);

        return {
            booksMarked, booksRead, booksPossessed, booksReviewed, bookStats, userInfo
        }

    })
