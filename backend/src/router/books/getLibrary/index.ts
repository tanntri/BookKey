import _ from 'lodash';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { z } from 'zod';
import { getBooksInfo, getBooksSomethingByUser } from '../../../utils/utils';

export const getLibraryTrpcRoute = trpcLoggedProcedure.input(
    (z.object({
        userId: z.string()
    }))
).query(async ({ ctx, input }) => {
    const rawLibrary = await ctx.prisma.library.findMany({
        where: {
            userId: input.userId
        },
        orderBy: [{
            createdAt: 'desc'
        }]
    })
    const booksPossessedIds = rawLibrary.map((bookPossessed) => bookPossessed.bookId);
    const booksPossessedResponse = await getBooksSomethingByUser(booksPossessedIds);

    const booksPossessed = await getBooksInfo(booksPossessedResponse);

    return booksPossessed;
})