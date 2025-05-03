import * as Sentry from "@sentry/node";
import { env } from "./env";
import { type LoggerMeta } from "./logger";
import path from "path";

if (env.BACKEND_SENTRY_DSN) {
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

export const sentryCaptureException = (error: Error, classifiedMetaData?: LoggerMeta) => {
    if (env.BACKEND_SENTRY_DSN) {
        Sentry.captureException(error, classifiedMetaData);
    }
}
