import _ from 'lodash';
import { trpc } from '../../../lib/trpc';
import { zGetBooksTrpcInput } from './input';

export const getBooksTrpcRoute = trpc.procedure.input(zGetBooksTrpcInput).query(async ({ctx, input}) => {
        const books = await ctx.prisma.book.findMany({
            select: {
                id: true,
                isbn: true,
                book: true,
                author: true,
                description: true,
                createdAt: true,
                serialNumber: true
            },
            orderBy: [{
                createdAt: 'desc'
            }, {
                serialNumber: 'desc'
            }],
            cursor: input.cursor ? {serialNumber: input.cursor} : undefined,
            take: input.limit + 1
        })

        const nextBook = books.at(input.limit);
        const nextCursor = nextBook?.serialNumber;
        const bookExceptNext = books.slice(0, input.limit);

        return { books: bookExceptNext, nextCursor }
    })