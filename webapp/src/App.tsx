import { TrpcProvider } from "./lib/trpc";
import { AllBooksPages } from "./components/pages/Books/AllBooks";
import { ViewBookPage } from "./components/pages/Books/ViewBookPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as routes from "./lib/routes";
import { Layout } from "./components/core/Layout/layout";
import '../styles/global.scss'
import { NewBookPage } from "./components/pages/Books/NewBookPage";
import { SignUpPage } from "./components/pages/Auth/SignUpPage";
import { SignInPage } from "./components/pages/Auth/SignInPage";
import { SignOutPage } from "./components/pages/Auth/SignOutPage";
import { AppContextProvider } from "./lib/ctx";
import { NotFoundPage } from "./components/shared/NotFound";
import { EditProfilePage } from "./components/pages/Auth/EditProfilePage";
import { HelmetProvider } from "react-helmet-async";
import { NonAuthRouteTracker } from "./components/shared/RouteNotAuth";
import './lib/sentry';
import { SentryUser } from "./lib/sentry";
import { MixpanelUser } from "./lib/mixpanel";
import { ProfilePage } from "./components/pages/Auth/ProfilePage";
import { TradePage } from "./components/pages/Transactions/TradePage";
import { PurchasePage } from "./components/pages/Transactions/PurchasePage";
import { RentPage } from "./components/pages/Transactions/RentPage";
import { BookMarkPage } from "./components/pages/Books/BookmarkPage";
import { BookReadPage } from "./components/pages/Books/BookReadPage";
import { LibraryPage } from "./components/pages/Books/LibraryPage";

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider> 
        <AppContextProvider>
          <BrowserRouter>
          <SentryUser />
          <MixpanelUser />
            <NonAuthRouteTracker />
            <Routes>
              <Route path={routes.getSignOutRoute()} element={<SignOutPage />}/>
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getAllBooksRoute.definition} element={<AllBooksPages />} />
                <Route path={routes.getNewBookRoute.definition} element={<NewBookPage />} />
                <Route path={routes.getViewBookRoute.definition} element={<ViewBookPage />} />
                <Route path={routes.getProfileRoute.definition} element={<ProfilePage />} />
                <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />
                <Route path={routes.getTradeRoute.definition} element={<TradePage />} />
                <Route path={routes.getPurchaseRoute.definition} element={<PurchasePage />} />
                <Route path={routes.getRentRoute.definition} element={<RentPage />} />
                <Route path={routes.getLibraryRoute.definition} element={<LibraryPage />} />
                <Route path={routes.getBookMarksRoute.definition} element={<BookMarkPage />} />
                <Route path={routes.getBooksReadRoute.definition} element={<BookReadPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  )
}
