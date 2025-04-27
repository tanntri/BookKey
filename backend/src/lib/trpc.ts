import { type inferAsyncReturnType, initTRPC } from "@trpc/server";
import { type Express } from "express";
import { type TrpcRouter } from "../router/index";
import * as trpcExpress from '@trpc/server/adapters/express';
import { AppContext } from "./ctx";
import SuperJSON from "superjson";
import { expressHandler } from "trpc-playground/handlers/express"
import { type ExpressRequest } from "../utils/types";
import { logger } from "./logger";

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

export const trpcLoggedProcedure = trpc.procedure.use(
    trpc.middleware(async ({ path, type, next, ctx, rawInput }) => {
        const start = Date.now();
        const result = await next();
        const durationMs = Date.now() - start;
        const meta = {
            path,
            type,
            userId: ctx.me?.id || null,
            durationMs,
            rawInput: rawInput || null
        }
        if (result.ok) {
            logger.info(`trpc:${type}:success`, 'Successful Request', { ...meta, output: result.data });
        } else {
            logger.error(`trpc:${type}:error`, result.error, meta);
        }

        return result;
    })
)

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