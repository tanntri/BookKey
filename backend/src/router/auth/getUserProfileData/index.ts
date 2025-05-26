import { z } from "zod";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import axios from "axios";
import { AppContext } from "../../../lib/ctx";
import { getBooksInfo } from "../../../utils/utils";

interface BookResponse {
    description: {
      type: string;
      value: string;
    };
    links: Record<string, any>[];
    title: string;
    dewey_number: string[];
    covers: number[];
    subject_places: string[];
    first_publish_date: string;
    subject_people: string[];
    key: string;
    authors: Record<string, any>[];
    subject_times: string[];
    type: {
      key: string;
    };
    subjects: string[];
    lc_classifications: string[];
    latest_revision: number;
    revision: number;
    created: {
      type: string;
      value: string;
    };
    last_modified: {
      type: string;
      value: string;
    };
}


const getBooksSomethingByUser = async (bookIds: string[]) => {
    const booksSomething = await Promise.all(bookIds.map(async (bookId) => {
        const url = `https://openlibrary.org/books/${bookId}.json`
        const { data } = await axios.get(url);
        return data;
    }))
    return booksSomething;
}

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

        const booksMarkedIds = rawBookmarks.map((bookmark) => bookmark.bookId);
        const booksMarkedResponse = await getBooksSomethingByUser(booksMarkedIds);

        const booksReadIds = rawBooksRead.map((bookRead) => bookRead.bookId);
        const booksReadResponse = await getBooksSomethingByUser(booksReadIds);

        const booksPossessedIds = rawBooksPossessed.map((bookPossessed) => bookPossessed.bookId);
        const booksPossessedResponse = await getBooksSomethingByUser(booksPossessedIds)

        const booksMarked = await getBooksInfo(booksMarkedResponse);
        const booksRead = await getBooksInfo(booksReadResponse);
        const booksPossessed = await getBooksInfo(booksPossessedResponse)

        const userInfo = await getUserInfo(ctx, input.userId);

        return {
            booksMarked, booksRead, booksPossessed, userInfo
        }

    })
