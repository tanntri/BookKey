import { type inferAsyncReturnType, initTRPC } from "@trpc/server";
import { type Express } from "express";
import { type TrpcRouter } from "../router/index";
import * as trpcExpress from '@trpc/server/adapters/express';
import { AppContext } from "./ctx";
import SuperJSON from "superjson";
import { expressHandler } from "trpc-playground/handlers/express"
import { type ExpressRequest } from "../utils/types";

const getCreateTrpcContext = 
    (appContext: AppContext) => 
    ({ req }: trpcExpress.CreateExpressContextOptions) => ({
        ...appContext,
        me: (req as ExpressRequest).user || null
    })


type TrpcContext = inferAsyncReturnType<ReturnType<typeof getCreateTrpcContext>>

export const trpc = initTRPC.context<TrpcContext>().create({
    transformer: SuperJSON
});

export const useTrpcInExpress = (async (app: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
    app.use('/trpc', trpcExpress.createExpressMiddleware({
            router: trpcRouter,
            createContext: getCreateTrpcContext(appContext),
        }))

    app.use(
        '/trpc-playground',
        await expressHandler({
            trpcApiEndpoint: '/trpc',
            playgroundEndpoint: 'trpc-playground',
            router: trpcRouter,
            request: {
                superjson: true
            }
        })
    )
})