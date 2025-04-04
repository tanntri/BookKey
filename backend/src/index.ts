import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { trpcRouter } from './router/index';
import cors from 'cors';
import { useTrpcInExpress } from './lib/trpc';
import { AppContext, createAppContext } from './lib/ctx';
import { applyPassportToExpressApp } from './lib/passport';
import { env } from './lib/env';

void (async () => {
    let ctx: AppContext | null = null;
    try {
        ctx = createAppContext();
        const app = express();
        
        app.use(cors());
        
        app.get('/', (req, res) => {
            res.send('home');
        })

        applyPassportToExpressApp(app, ctx)
        
        await useTrpcInExpress(app, ctx, trpcRouter)
        
        app.listen(env.PORT, () => {
            console.info(`Listening at http://localhost:${env.PORT}`);
        })
    } catch (error) {
        console.error(error);
        await ctx?.stop();
    }
})()
    