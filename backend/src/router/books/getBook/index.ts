import { trpcLoggedProcedure } from '../../../lib/trpc';
import { z } from 'zod';
// import axios from 'axios';

// const getBookCat = async (category: string) => {
//     const response = await axios.get(`https://openlibrary.org/subjects/${category}.json?limit=4`);
//     return response;
// }

export const getBookTrpcRoute = trpcLoggedProcedure.input(
        (z.object({
            isbn: z.string()
        }))
    ).query(async ({ctx, input}) => {
        const rawBook = await ctx.prisma.book.findUnique({
            where: {
                isbn: input.isbn
            },
            include: {
                bookLikes: {
                    select: {
                        id: true,
                        bookIsbn: true
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
            }
        })
        // getBookCat('history')
        //     .then(res => {
        //         console.log(res.data.works)
        //     })
        //     .catch(error => {
        //         console.error(error)
        //     })
        // console.log(book)
        const isLikedByCurrUser = !!rawBook?.bookLikes.length;
        const likesCount = rawBook?._count.bookLikes || 0;
        const book = { ...rawBook, isLikedByCurrUser: isLikedByCurrUser, likesCount: likesCount }
        return { book }
    })