import type { TrpcRouterOutput } from "@bookkey/backend/src/router";
import { createContext, useContext } from "react";
import { trpc } from "./trpc";
import { Loader } from "../components/shared/Loader";

export type AppContext = {
    me: TrpcRouterOutput['getMe']['me'];
}

const AppReactContext = createContext<AppContext>({
    me: null
})

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading, isFetching, isError } = trpc.getMe.useQuery();

    return (
        <AppReactContext.Provider
            value={{
                me: data?.me || null
            }}
        >
            {isLoading || isFetching ? <Loader type="page" /> : isError ? <p>Error</p> : children}
        </AppReactContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppReactContext);
}

export const useMe = () => {
    const { me } = useAppContext();
    return me;
}