import _ from 'lodash';
import { trpc } from '../../../lib/trpc';

export const getBooksTrpcRoute = trpc.procedure.query(async ({ctx}) => {
        const books = await ctx.prisma.book.findMany({
            select: {
                id: true,
                isbn: true,
                book: true,
                author: true,
                description: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { books }
    })