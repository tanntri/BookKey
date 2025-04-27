import _ from 'lodash';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zGetBooksTrpcInput } from './input';

export const getBooksTrpcRoute = trpcLoggedProcedure.input(zGetBooksTrpcInput).query(async ({ctx, input}) => {
        const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, '_') : undefined;
        const rawBooks = await ctx.prisma.book.findMany({
            select: {
                id: true,
                isbn: true,
                book: true,
                author: true,
                description: true,
                createdAt: true,
                serialNumber: true,
                bookLikes: {
                    select: {
                        id: true
                    },
                    where: {
                        userId: ctx.me?.id
                    }
                },
                _count: {
                    select: {
                        bookLikes: true
                    }
                }
            },
            where: !input.search ? undefined : {
                OR: [{
                        book: {
                            contains: normalizedSearch,
                            mode: 'insensitive'
                        }
                    },
                    {
                        isbn: {
                            search: normalizedSearch,
                            mode: 'insensitive'
                        }
                    },
                    {
                        author: {
                            contains: normalizedSearch,
                            mode: 'insensitive'
                        }
                    }]
            },
            orderBy: [{
                createdAt: 'desc'
            }, {
                serialNumber: 'desc'
            }],
            cursor: input.cursor ? {serialNumber: input.cursor} : undefined,
            take: input.limit + 1
        })

        const books = rawBooks.map((book) => {
            const isLikedByCurrUser = !!book.bookLikes.length;
            return {...book, likesCount: book._count.bookLikes || 0, isLikedByCurrUser: isLikedByCurrUser}
        })

        const nextBook = books.at(input.limit);
        const nextCursor = nextBook?.serialNumber;
        const bookExceptNext = books.slice(0, input.limit);

        return { books: bookExceptNext, nextCursor }
    })