import { CronJob } from 'cron';
import { AppContext } from './ctx';
import { notifyMonthlyMostLiked } from '../scripts/notifiyMonthlyMostLiked';
import { logger } from './logger';

export const applyCron = (ctx: AppContext) => {
    // notifyMonthlyMostLiked(ctx).catch((error) => {
    //     console.error(error);
    // });
    new CronJob(
        '0 10 1 * *',   // time
        () => {
            notifyMonthlyMostLiked(ctx).catch((error) => {
                logger.error('cron', error);
            });
        },
        null,   // onComplete
        true    // start now
    )
}