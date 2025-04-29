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

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider> 
        <AppContextProvider>
          <BrowserRouter>
          <NonAuthRouteTracker />
            <Routes>
              <Route path={routes.getSignOutRoute()} element={<SignOutPage />}/>
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getAllBooksRoute.definition} element={<AllBooksPages />} />
                <Route path={routes.getNewBookRoute.definition} element={<NewBookPage />} />
                <Route path={routes.getViewBookRoute.definition} element={<ViewBookPage />} />
                <Route path={routes.getEditProfileRoute()} element={<EditProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  )
}
