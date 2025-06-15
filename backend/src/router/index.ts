import { getBooksTrpcRoute } from "./books/getBooks";
import { getBookTrpcRoute } from "./books/getBook";
import { trpc } from '../lib/trpc';
import { createBookTrpcRoute } from "./books/createBook";
import { signupTrpcRoute } from "./auth/signup";
import { signinTrpcRoute } from "./auth/signin";
import { getMeTrpcRoute } from "./auth/getMe";
import { createReviewTrpcRoute } from "./reviews/createReview";
import { getReviewsTrpcRoute } from "./reviews/getReviews";
import { updateReviewTrpcRoute } from "./reviews/updateReview";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { updateProfileTrpcRoute } from "./auth/updateProfile";
import { updatePasswordTrpcRoute } from "./auth/updatePassword";
import { setReviewLikeTrpcRoute } from "./reviews/setReviewLike";
import { getReviewTrpcRoute } from "./reviews/getReview";
import { blockReviewTrpcRoute } from "./reviews/blockReview";
import { setBookLikeTrpcRoute } from "./books/setBookLike";
import { prepareCloudinaryUploadTrpcRoute } from "./upload/preCloudinaryUpload";
import { setBookmarkTrpcRoute } from "./books/setBookmarks";
import { getBookmarksTrpcRoute } from "./books/getBookmarks";
import { setBookReadTrpcRoute } from "./books/setBookRead";
import { getBooksReadTrpcRoute } from "./books/getBooksRead";
import { getUserProfileTrpcRoute } from "./auth/getUserProfileData";
import { setLibraryTrpcRoute } from "./books/setLibrary";
import { getLibraryTrpcRoute } from "./books/getLibrary";
import { getReviewsByUserTrpcRoute } from "./reviews/getReviewsByUser";
import { getAnalyticsTrpcRoute } from "./books/getAnalytics";

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
    editProfile: updateProfileTrpcRoute,
    updatePassword: updatePasswordTrpcRoute,
    setReviewLike: setReviewLikeTrpcRoute,
    getReview: getReviewTrpcRoute,
    blockReview: blockReviewTrpcRoute,
    setBookLike: setBookLikeTrpcRoute,
    prepareCloudinaryUpload: prepareCloudinaryUploadTrpcRoute,
    setBookmark: setBookmarkTrpcRoute,
    getBookmarks: getBookmarksTrpcRoute,
    setBookRead: setBookReadTrpcRoute,
    getBooksRead: getBooksReadTrpcRoute,
    getUserProfile: getUserProfileTrpcRoute,
    setLibrary: setLibraryTrpcRoute,
    getLibrary: getLibraryTrpcRoute,
    getReviewsByUser: getReviewsByUserTrpcRoute,
    getAnalytics: getAnalyticsTrpcRoute
});

export type TrpcRouter = typeof trpcRouter;
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>;
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>;