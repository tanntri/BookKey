import { appContext, createReview, createReviewWithAuthor, createUser, getTrpcCaller } from "../../../test/integration";

describe('setReviewLike', () => {
    it.skip('should create like', async () => {
        const { review } = await createReviewWithAuthor({ number: 1 });
        const liker = await createUser({ number: 2 });
        const trpcCallerLiker = getTrpcCaller(liker);
        const result = await trpcCallerLiker.setReviewLike({
            reviewId: review.id,
            likedByCurrUser: true
        });
        expect(result).toMatchObject({
            review: {
                isLikedByCurrUser: true,
                likesCount: 1
            }
        })
        const reviewLikes = await appContext.prisma.reviewLike.findMany();
        expect(reviewLikes).toHaveLength(1);
        expect(reviewLikes[0]).toMatchObject({
            reviewId: review.id,
            userId: liker.id
        })
    })

    it.skip('should remove like', async () => {
        const { review } = await createReviewWithAuthor({ number: 1 });
        const liker = await createUser({ number: 2 });
        const trpcCallerLiker = getTrpcCaller(liker);
        const result1 = await trpcCallerLiker.setReviewLike({
            reviewId: review.id,
            likedByCurrUser: true
        })
        expect(result1).toMatchObject({
            review: {
                isLikedByCurrUser: true,
                likesCount: 1
            }
        })

        const result2 = await trpcCallerLiker.setReviewLike({
            reviewId: review.id,
            likedByCurrUser: false
        })
        expect(result2).toMatchObject({
            review: {
                isLikedByCurrUser: false,
                likesCount: 0
            }
        })
        const reviewLikes = await appContext.prisma.reviewLike.findMany();
        expect(reviewLikes).toHaveLength(0);
    })
})