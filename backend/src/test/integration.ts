import { type Review, type User } from "@prisma/client";
import _ from "lodash";
import { AppContext, createAppContext } from "../lib/ctx";
import { getTrpcContext, trpc } from "../lib/trpc";
import { trpcRouter } from "../router";
import { deepMap } from "../utils/deepMap";
import { getPasswordHash } from "../utils/getPasswordHash";
import { type ExpressRequest } from "../utils/types";
import { initTRPC } from "@trpc/server";

export const appContext = createAppContext();

afterAll(appContext.stop);

beforeEach(async () => {
    await appContext.prisma.reviewLike.deleteMany();
    await appContext.prisma.review.deleteMany();
    await appContext.prisma.user.deleteMany();
})

export const getTrpcCaller = (user?: User) => {
    const req = { user } as ExpressRequest;
    return trpcRouter.createCaller(getTrpcContext({ appContext, req }));
}

export const withoutNoize = (input: any): any => {

}

export const createUser = async ({ user = {}, number = 1 }: { user?: Partial<User>; number?: number }) => {
    return await appContext.prisma.user.create({
        data: {
            username: `user${number}`,
            email: `user${number}@example.com`,
            password: getPasswordHash(user.password || '1234'),
            ..._.omit(user, ['password'])
        }
    })
}

export const createReview = async ({
    review = {},
    author,
    number = 1
}: {
    review?: Partial<Review>
    author: Pick<User, 'id'>
    number?: number
}) => {
    return await appContext.prisma.review.create({
        data: {
            userId: author.id,
            title: `Review ${number}`,
            text: `Review ${number}`,
            score: 5,
            bookId: 'bookid',
            ...review
        }
    })
}

export const createReviewWithAuthor = async ({
    author,
    review,
    number,
  }: {
    author?: Partial<User>
    review?: Partial<Review>
    number?: number
  } = {}) => {
    const createdUser = await createUser({ user: author, number })
    const createdIdea = await createReview({ review, author: createdUser, number })
    return {
      author: createdUser,
      review: createdIdea,
    }
  }