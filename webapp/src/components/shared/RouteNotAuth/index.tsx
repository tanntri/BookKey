import { atom } from "nanostores";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllBooksRoute, getSignInRoute, getSignOutRoute, getSignUpRoute } from "../../../lib/routes";

export const lastNonAuthRouteVisitedStore = atom<string>(getAllBooksRoute());

export const NonAuthRouteTracker = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        const authRoutes = [getSignInRoute(), getSignOutRoute(), getSignUpRoute()];
        const isAuthRoute = authRoutes.includes(pathname);

        if (!isAuthRoute) {
            lastNonAuthRouteVisitedStore.set(pathname);
        }
        // case where user A signs out, user B signs in, don't redirect to last page
        // user A was on
        if (pathname === getSignOutRoute()) {
            lastNonAuthRouteVisitedStore.set(getAllBooksRoute());
        }
    }, [pathname]);

    return null;
}