import type { TrpcRouter } from '@bookkey/backend/src/router/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink, TRPCLink } from '@trpc/client'
import React from 'react';
import SuperJSON from 'superjson';
import Cookies from 'js-cookie';
import { env } from './env';
import { sentryCaptureException } from './sentry';
import { observable } from '@trpc/server/observable';

export const trpc = createTRPCReact<TrpcRouter>()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false
        }
    }
})

const customTrpcLink: TRPCLink<TrpcRouter> = () => {
    return ({ next, op }) => {
        return observable((observer) => {
            const unsubscribe = next(op).subscribe({
                next(value) {
                    observer.next(value);
                },
                error(error) {
                    const errorIsExpected = error.data?.isExpected;
                    // if error is expected, we don't send it to Sentry
                    if (!errorIsExpected) {
                        if (env.NODE_ENV !== 'development') {
                            console.error(error);
                        }
                        sentryCaptureException(error);
                    }
                    observer.error(error);
                },
                complete() {
                    observer.complete();
                }

            })
            return unsubscribe;
        })
    }
}

const trpcClient = trpc.createClient({
    transformer: SuperJSON,
    links: [
        customTrpcLink,
        loggerLink({
            enabled: () => env.NODE_ENV === 'development'
        }),
        httpBatchLink({
            url: env.VITE_BACKEND_TRPC_URL,
            headers: () => {
                const token = Cookies.get('token');
                return {
                    ...(token && { authorization: `Bearer ${token}` })
                }
            }
        })
    ]
})

export const TrpcProvider = ({ children }: {children: React.ReactNode}) => {
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    )
}