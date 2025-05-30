import { env } from './lib/env';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { trpcRouter } from './router/index';
import cors from 'cors';
import { useTrpcInExpress } from './lib/trpc';
import { AppContext, createAppContext } from './lib/ctx';
import { applyPassportToExpressApp } from './lib/passport';
import { presetDB } from './scripts/presetDB';
import { applyCron } from './lib/cron';
import { logger } from './lib/logger';
import { initSentry } from './lib/sentry';
import { applyServeWebApp } from './lib/serveWebApp';

void (async () => {
    let ctx: AppContext | null = null;
    try {
        initSentry();
        ctx = createAppContext();
        await presetDB(ctx);
        const app = express();
        
        app.use(cors());
        
        // app.get('/', (req, res) => {
        //     res.send('home');
        // })

        applyPassportToExpressApp(app, ctx);
        
        await useTrpcInExpress(app, ctx, trpcRouter);
        await applyServeWebApp(app);

        applyCron(ctx);

        app.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.error('express', error);
            if (res.headersSent) {
                next(error);
                return;
            }
            res.status(500).send('Internal Server Error');
        })
        
        app.listen(env.PORT, () => {
            logger.info('express', `Listening at http://localhost:${env.PORT}`);
        })
    } catch (error) {
        logger.error('app', error);
        await ctx?.stop();
    }
})()
    