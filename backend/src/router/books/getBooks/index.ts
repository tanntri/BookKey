import _ from 'lodash';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zGetBooksTrpcInput } from './input';
import axios, { AxiosResponse } from 'axios';
import { AppContext } from '../../../lib/ctx';

export interface Book {
    author_key: string[];
    author_name: string[];
    avgScore: number;
    cover_edition_key: string;
    cover_i: number;
    ebook_access: string;
    edition_count: number;
    first_publish_year: number;
    has_fulltext: boolean;
    ia: string[];
    ia_collection_s: string;
    id_librivox: string[];
    id_project_gutenberg: string[];
    key: string; // e.g., "/works/OL36287W"
    language: string[];
    lending_edition_s: string;
    lending_identifier_s: string;
    public_scan_b: boolean;
    title: string;
}

// get list of books by category
const getBookCat = async (category: string, limit: number, offset: number) => {
    const url = `https://openlibrary.org/subjects/${category.toLowerCase()}.json?limit=${limit}&offset=${offset}`
    const response = await axios.get(url);
    return response;
}

// get list of books by user input in searchbar
const getBookSearch = async(searchText: string, limit: number, offset: number) => {
    const url = `https://openlibrary.org/search.json?q=${searchText}&limit=${limit}&offset=${offset}`
    const response = await axios.get(url);
    return response;
}

// function to get review scores of the given book id.
const getReviewScores = async (ctx: AppContext, bookIds: string[]) => {
    const reviews = await ctx.prisma.review.findMany({
        where: {
            bookId: { in: bookIds }
        }
    })

    const reviewMap: any = {};
    for (const bookId of bookIds) {
        reviewMap[bookId] = {score: 0, numOfReview: 0};
    }

    for (const review of reviews) {
        if (reviewMap.hasOwnProperty(review.bookId)) {
            reviewMap[review.bookId].score += review.score;
            reviewMap[review.bookId].numOfReview++;
        }
    }

    return reviewMap;
}

// function to get bookmark status of fetched books to be displayed. Purpose is to show
// state of bookmark button
const getBookmark = async (ctx: AppContext, bookIds: string[], userId: string) => {
    const bookmarks = await ctx.prisma.bookmark.findMany({
        where: {
            userId: userId,     // only bookmarks by the current user
            bookId: {
                in: bookIds,    // only for books in the input list
            },
        },
        select: {
            bookId: true,
        },
    });

    const bookmarkMap: Record<string, boolean> = {};
    for (const bookId of bookIds) {
        bookmarkMap[bookId] = false;    // default to not bookmarked
    }

    for (const bookmark of bookmarks) {
        bookmarkMap[bookmark.bookId] = true;    // mark as bookmarked
    }

    return bookmarkMap;
}

// function to get book read status of fetched books to be displayed. Purpose is to show
// state of book read button
const getBooksRead = async (ctx: AppContext, bookIds: string[], userId: string) => {
    const booksRead = await ctx.prisma.bookRead.findMany({
        where: {
            userId: userId,     // only bookmarks by the current user
            bookId: {
                in: bookIds,    // only for books in the input list
            },
        },
        select: {
            bookId: true,
        },
    });

    const bookReadMap: Record<string, boolean> = {};
    for (const bookId of bookIds) {
        bookReadMap[bookId] = false;    // default to not bookmarked
    }

    for (const bookRead of booksRead) {
        bookReadMap[bookRead.bookId] = true;    // mark as bookmarked
    }

    return bookReadMap;
}

const getBooksPossessed = async (ctx: AppContext, bookIds: string[], userId: string) => {
    const booksPossessed = await ctx.prisma.library.findMany({
        where: {
            userId: userId,     // only bookmarks by the current user
            bookId: {
                in: bookIds,    // only for books in the input list
            },
        },
        select: {
            bookId: true,
        },
    });

    const libraryMap: Record<string, boolean> = {};
    for (const bookId of bookIds) {
        libraryMap[bookId] = false;    // default to not bookmarked
    }

    for (const bookPossessed of booksPossessed) {
        libraryMap[bookPossessed.bookId] = true;    // mark as bookmarked
    }

    return libraryMap;
}

// extract book id from key in response
const extractBookId = (key: string) => key.split("/")[2];

const constructBooksData = (books: Book[], reviews: any, bookmarks: any, booksRead: any, booksPossessed: any) => {
    return books.map((book: Book) => {
        const bookReviewObject = reviews[extractBookId(book.key)];
        const avgScore = bookReviewObject.numOfReview > 0 ? bookReviewObject.score / bookReviewObject.numOfReview : 0;
        const savedByCurrUser = bookmarks ? bookmarks[extractBookId(book.key)] : undefined;
        const readByCurrUser = booksRead ? booksRead[extractBookId(book.key)] : undefined;
        const possessedByCurrUser = booksPossessed ? booksPossessed[extractBookId(book.key)] : undefined
        return { ...book, avgScore, savedByCurrUser, readByCurrUser, possessedByCurrUser };
    })
}

export const getBooksTrpcRoute = trpcLoggedProcedure.input(zGetBooksTrpcInput).query(async ({ctx, input}) => {
    const { limit, search, cursor = 1, category } = input;

    try {
        const offset = (cursor - 1) * limit
        
        let rawBooks: AxiosResponse<any>;
        
        if (search && search.length > 0) {
            rawBooks = await getBookSearch(search, limit, offset)
            let books = rawBooks.data.docs;
            const ids = books.map((book: Book) => extractBookId(book.key));
            const reviews = await getReviewScores(ctx, ids);
            const bookmarks = ctx.me ? await getBookmark(ctx, ids, ctx.me.id) : undefined;
            const booksRead = ctx.me ? await getBooksRead(ctx, ids, ctx.me.id) : undefined;
            const booksPossessed = ctx.me ? await getBooksPossessed(ctx, ids, ctx.me.id) : undefined;
            books = constructBooksData(books, reviews, bookmarks, booksRead, booksPossessed)
            return {
                books: books,
                nextPage: books?.length === limit ? cursor + 1 : null,
                type: 'docs'
            }
        } else {
            rawBooks = await getBookCat(category, limit, offset)
            let books = rawBooks.data.works;
            const ids = books.map((book: Book) => extractBookId(book.key));
            const reviews = await getReviewScores(ctx, ids);
            const bookmarks = ctx.me ? await getBookmark(ctx, ids, ctx.me.id) : undefined;
            const booksRead = ctx.me ? await getBooksRead(ctx, ids, ctx.me.id) : undefined;
            const booksPossessed = ctx.me ? await getBooksPossessed(ctx, ids, ctx.me.id) : undefined;
            books = constructBooksData(books, reviews, bookmarks, booksRead, booksPossessed)
            return {
                books: books,
                nextPage: books?.length === limit ? cursor + 1 : null,
                type: 'works'
            }
        }
    } catch(error) {
        throw new Error("Failed to fetch from api");
    }
})