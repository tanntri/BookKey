import _ from 'lodash';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { z } from 'zod';
import { getBooksInfo, getBooksSomethingByUser } from '../../../utils/utils';

export const getBookmarksTrpcRoute = trpcLoggedProcedure.input(
    (z.object({
        userId: z.string()
    }))
).query(async ({ ctx, input }) => {
    const rawBookmarks = await ctx.prisma.bookmark.findMany({
        where: {
            userId: input.userId
        },
        orderBy: [{
            createdAt: 'desc'
        }]
    })
    const booksMarkedIds = rawBookmarks.map((bookmark) => bookmark.bookId);
    const booksMarkedResponse = await getBooksSomethingByUser(booksMarkedIds)

    const booksMarked = await getBooksInfo(booksMarkedResponse);

    return booksMarked;
})