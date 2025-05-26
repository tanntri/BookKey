import { AuthorResponse, BookResponse } from "./types";
import axios from "axios";

export const getAuthorNames = async (authors: AuthorResponse[]) => {
    const authorNames = await Promise.all(authors.map(async (author) => {
        const url = `https://openlibrary.org${author.author.key}.json`
        const { data } = await axios.get(url);
        return data.name;
    }))
    return authorNames.join(", ")
}

export const getBooksInfo = async (bookResponse: BookResponse[]) => {
    try {
        const bookData = await Promise.all(bookResponse.map(async (bookRes: any) => {
            const { data } = await axios.get(`https://openlibrary.org${bookRes.key}.json`);
            const authors = data.authors;

            return {
                id: data.key.split("/")[2],
                title: data.title,
                author: await getAuthorNames(authors),
                cover: data.covers ? data.covers[0].toString() : undefined,
            }
        }))
        return bookData;
    } catch(error) {
        throw new Error('Failed')
    }
}

export const getBooksSomethingByUser = async (bookIds: string[]) => {
    const booksSomething = await Promise.all(bookIds.map(async (bookId) => {
        const url = `https://openlibrary.org/books/${bookId}.json`
        const { data } = await axios.get(url);
        return data;
    }))
    return booksSomething;
}