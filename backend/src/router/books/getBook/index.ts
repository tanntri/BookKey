import { trpcLoggedProcedure } from '../../../lib/trpc';
import { z } from 'zod';
import axios from 'axios';
import { getAuthorNames } from '../../../utils/utils';

export const getBookTrpcRoute = trpcLoggedProcedure.input(
        (z.object({
            olid: z.string()
        }))
    ).query(async ({ctx, input}) => {
        const { data } = await axios.get(`https://openlibrary.org/works/${input.olid}.json`) 
        const authors = data.authors;
        const bookmark = ctx.me ? await ctx.prisma.bookmark.findUnique({
            where: {
                bookId_userId: {
                    bookId: input.olid,
                    userId: ctx.me?.id
                }
            }
        }) : undefined;
        const bookread = ctx.me ? await ctx.prisma.bookRead.findUnique({
            where: {
                bookId_userId: {
                    bookId: input.olid,
                    userId: ctx.me?.id
                }
            }
        }) : undefined;
        const bookPossessed = ctx.me ? await ctx.prisma.library.findUnique({
            where: {
                bookId_userId: {
                    bookId: input.olid,
                    userId: ctx.me?.id
                }
            }
        }) : undefined
        const bookData = {
            id: input.olid,
            title: data.title,
            description: data.description,
            author: await getAuthorNames(authors),
            cover: data.covers ? data.covers[0].toString() : undefined,
            savedByCurrUser: !!bookmark,
            readByCurrUser: !!bookread,
            possessedByCurrUser: !!bookPossessed
        }
        return bookData;
    })