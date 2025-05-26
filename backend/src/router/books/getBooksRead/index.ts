import _ from 'lodash';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { z } from 'zod';
import { getBooksInfo, getBooksSomethingByUser } from '../../../utils/utils';

export const getBooksReadTrpcRoute = trpcLoggedProcedure.input(
    (z.object({
        userId: z.string()
    }))
).query(async ({ ctx, input }) => {
    const rawBooksRead = await ctx.prisma.bookRead.findMany({
        where: {
            userId: input.userId
        },
        orderBy: [{
            createdAt: 'desc'
        }]
    })
    const booksReadIds = rawBooksRead.map((bookRead) => bookRead.bookId);
    const booksReadResponse = await getBooksSomethingByUser(booksReadIds)

    const booksRead = await getBooksInfo(booksReadResponse);

    return booksRead;
})