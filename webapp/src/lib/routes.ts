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
export const getViewBookRoute = routeWrapper({ isbn: true }, ({ isbn }: { isbn: string }) => `/book/${isbn}`);
export const getNewBookRoute = routeWrapper(() => "/book/new");

// authentication routes
export const getSignUpRoute = routeWrapper(() => "/signup");
export const getSignInRoute = routeWrapper(() => "/signin");
export const getSignOutRoute = routeWrapper(() => "/signout");
export const getEditProfileRoute = routeWrapper(() => "edit-profile");