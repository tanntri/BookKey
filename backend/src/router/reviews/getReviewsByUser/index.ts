import { z } from "zod";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { AppContext } from "../../../lib/ctx";
import { getBooksInfo, getBooksSomethingByUser } from "../../../utils/utils";

export const getReviewsByUserTrpcRoute = trpcLoggedProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(async ({ ctx, input }: { ctx: AppContext; input: { userId: string } }) => {
    const rawReviews = await ctx.prisma.review.findMany({
      where: {
        userId: input.userId,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    // const booksReviewedIds = rawReviews.map((review) => review.bookId);
    const booksReviewedIds = [...new Set(rawReviews.map((review) => review.bookId))];

    const booksReviewedResponse = await getBooksSomethingByUser(booksReviewedIds);

    const booksReviewed = await getBooksInfo(booksReviewedResponse);

    const reviews = rawReviews.map((review) => {
      const book = booksReviewed.find((book) => book?.id === review.bookId);
      return {
        id: review.id,
        score: review.score,
        title: review.title,
        text: review.text,
        createdAt: review.createdAt,
        book: book || null,
      };
    });

    return reviews;
  });