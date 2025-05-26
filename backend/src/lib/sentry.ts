import { env } from "./env";
import * as Sentry from "@sentry/node";
import { type LoggerMeta } from "./logger";
import path from "path";

const isSentryEnabled = env.BACKEND_SENTRY_DSN && env.NODE_ENV !== 'test';

export const initSentry = () => {
    if (isSentryEnabled) {
        Sentry.init({
            dsn: env.BACKEND_SENTRY_DSN,
            environment: env.HOST_ENV,
            release: env.SOURCE_VERSION, 
            normalizeDepth: 10,
            integrations: [Sentry.rewriteFramesIntegration({
                root: path.resolve(__dirname, '../../..')
            })]
        })
    }
}

export const sentryCaptureException = (error: Error, classifiedMetaData?: LoggerMeta) => {
    if (isSentryEnabled) {
        Sentry.captureException(error, classifiedMetaData);
    }
}
