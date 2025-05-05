import { type Review, type User} from "@prisma/client";
import _ from "lodash";
import { type Book } from "@prisma/client";
import { sendEmail } from "./utils";

export const sendRegistrationEmail = async ({ user }: { user: Pick<User, 'username' | 'email'> }) => {
    return await sendEmail({
        to: user.email,
        subject: 'Thanks for Registration!',
        templateName: 'register',
        templateVariables: {
            username: user.username
        }
    })
}

export const sendBlockedReviewEmail = async ({ user, review }: 
    { user: Pick<User, 'username' | 'email'>;review: Review }) => {
    return await sendEmail({
        to: user.email,
        subject: 'Your Review is Blocked',
        templateName: 'reviewBlocked',
        templateVariables: {
            book: review.bookId
        }
    })
}

export const sendMostLikedBooksEmail = async ({ user, books }: { user: Pick<User, 'email'>, books: Array<Pick<Book, 'book' | 'isbn'>> }) => {
    return await sendEmail({
        to: user.email,
        subject: 'Monthly Popular Books are Here',
        templateName: 'mostLikedBooks',
        templateVariables: {
            books: books.map((book) => ({ name: book.book, isbn: book.isbn }))
        }
    })
}

