import { getBooksTrpcRoute } from "./books/getBooks";
import { getBookTrpcRoute } from "./books/getBook";
import { trpc } from '../lib/trpc';
import { createBookTrpcRoute } from "./books/createBook";
import { signupTrpcRoute } from "./auth/signup";
import { signinTrpcRoute } from "./auth/signin";
import { getMeTrpcRoute } from "./auth/getMe";
import { createReviewTrpcRoute } from "./createReview";
import { getReviewsTrpcRoute } from "./reviews/getReviews";
import { updateReviewTrpcRoute } from "./reviews/updateReview";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { updateProfileTrpcRoute } from "./auth/updateProfile";

export const trpcRouter = trpc.router({
    getBooks: getBooksTrpcRoute,
    getBook: getBookTrpcRoute,
    createBook: createBookTrpcRoute, 
    signUp: signupTrpcRoute,
    signIn: signinTrpcRoute,
    getMe: getMeTrpcRoute,
    createReview: createReviewTrpcRoute,
    getReviews: getReviewsTrpcRoute,
    editReview: updateReviewTrpcRoute,
    editProfile: updateProfileTrpcRoute
});

export type TrpcRouter = typeof trpcRouter;
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>;