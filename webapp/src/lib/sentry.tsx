import * as Sentry from "@sentry/react";
import { env } from "./env";
import { useMe } from "./ctx";
import { useEffect } from "react";

if (env.VITE_SENTRY_FRONTEND_DSN) {
    Sentry.init({
        dsn: env.VITE_SENTRY_FRONTEND_DSN,
        environment: env.HOST_ENV,
        release: env.SOURCE_VERSION, 
        normalizeDepth: 10
    })
}

export const sentryCaptureException = (error: Error) => {
    if (env.VITE_SENTRY_FRONTEND_DSN) {
        Sentry.captureException(error);
    }
}

export const SentryUser = () => {
    const me = useMe();

    useEffect(() => {
        if (env.VITE_SENTRY_FRONTEND_DSN) {
            if (me) {
                Sentry.setUser({
                    email: me.email,
                    id: me.id,
                    ip_address: '{{auto}}',
                    username: me.username
                });
            } else {
                Sentry.setUser(null);
            }
        }
    }, [me]);
    return null;
}