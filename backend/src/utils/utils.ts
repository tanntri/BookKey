import { AuthorResponse, BookResponse } from "./types";
import axios from "axios";
import pLimit from 'p-limit';

// export const getAuthorNames = async (authors: AuthorResponse[]) => {
//     const authorName: Record<string, any> = {};
//     const authorNames = authors.map(async (author) => {
//         console.log(authorName);
//         if (authorName[author.author.key]) {
//             return authorName[author.author.key];
//         }
//         const url = `https://openlibrary.org${author.author.key}.json`
//         const { data } = await axios.get(url);
//         authorName[author.author.key] = data.name;
//         return data.name;
//     })
//     return authorNames.join(", ")
// }

// export const getAuthorNames = async (authors: AuthorResponse[]) => {
//     const authorName: Record<string, string> = {};
//     const names: string[] = [];

//     for (const author of authors) {
//         const key = author.author.key;
//         if (authorName[key]) {
//             names.push(authorName[key]);
//             continue;
//         }
//         console.log(authorName);

//         const url = `https://openlibrary.org${key}.json`;
//         const { data } = await axios.get(url);
//         authorName[key] = data.name;
//         names.push(data.name);
//     }

//     return names.join(", ");
// };


export const getAuthorNames = async (authors: AuthorResponse[]) => {
    const limit = pLimit(3);
    const cache: Record<string, string> = {};

    const tasks = authors.map(author => limit(async () => {
        const key = author.author.key;
        if (cache[key]) return cache[key];

        const { data } = await axios.get(`https://openlibrary.org${key}.json`);
        cache[key] = data.name;
        return data.name;
    }));

    const names = await Promise.all(tasks);
    return names.join(", ");
};


export const getBooksInfo = async (bookResponse: BookResponse[]) => {
    try {
        const limit = pLimit(5); // max 5 concurrent
        const bookData = await Promise.all(
            bookResponse.map((bookRes) =>
              limit(async () => {
                try {
                  const { data } = await axios.get(`https://openlibrary.org${bookRes.key}.json`);
                  const authors = data.authors;
      
                  return {
                    id: data.key.split("/")[2],
                    title: data.title,
                    // author: await getAuthorNames(authors),
                    // author: "placeholder",
                    cover: data.covers?.[0]?.toString(),
                  };
                } catch (error) {
                  console.error(`Error fetching book: ${bookRes.key}`, error);
                  return null;
                }
              })
            ))

        //   console.log(bookData);
          
          // Filter out failed fetches
          return bookData.filter(Boolean);
          
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
    // const booksOlid = bookIds.map((bookId) => {
    //     return `OLID:${bookId}`
    // })
    // const booksOlidString = booksOlid.join();
    // const url = `https://openlibrary.org/api/works?bibkeys=${booksOlidString}&format=json&jscmd=data`
    // console.log(url);
    // const { data } = await axios.get(url);
    // console.log(data);
    // return [data];
}