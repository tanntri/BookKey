// export const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
//     return Object.keys(object).reduce((acc, key) => ({...acc, [key]: `:${key}`}), {}) as Record<keyof T, string>;
// }

// export const getAllBooksRoute = () => "/";
// export const viewBookRouteParams = getRouteParams({ isbn: true })
// export type ViewBookRouteParams = typeof viewBookRouteParams
// export const getBookPageRoute = ({isbn}: ViewBookRouteParams) => `/book/${isbn}`;

// export const getNewBookRoute = () => '/book/new';

// export const getSignupRoute = () => '/signup';
// export const getSigninRoute = () => '/signin';
// export const getSignOutRoute = () => '/signout';
// export const getEditProfileRoute = () => '/edit-profile'

import { routeWrapper } from "../utils/routeWrapper";

// books routes
export const getAllBooksRoute = routeWrapper(() => "/");
export const getViewBookRoute = routeWrapper({ olid: true }, ({ olid }: { olid: string }) => `/books/${olid}`);
export const getNewBookRoute = routeWrapper(() => "/book/new");
export const getBookMarksRoute = routeWrapper({ userId: true }, ({ userId }: { userId: string | undefined }) => `/bookmark/${userId}`);
export const getBooksReadRoute = routeWrapper({ userId: true }, ({ userId }: { userId: string | undefined }) => `/bookread/${userId}`);
export const getLibraryRoute = routeWrapper({ userId: true }, ({ userId }: { userId: string | undefined }) => `/library/${userId}`);

// authentication routes
export const getSignUpRoute = routeWrapper(() => "/signup");
export const getSignInRoute = routeWrapper(() => "/signin");
export const getSignOutRoute = routeWrapper(() => "/signout");
export const getEditProfileRoute = routeWrapper(() => "edit-profile");

// profile route
export const getProfileRoute = routeWrapper({ userId: true }, ({ userId }: { userId: string | undefined }) => `/profile/${userId}`);

// transaction routes
export const getTradeRoute = routeWrapper(() => "/trade")
export const getPurchaseRoute = routeWrapper(() => "/purchase")
export const getRentRoute = routeWrapper(() => "/rent")