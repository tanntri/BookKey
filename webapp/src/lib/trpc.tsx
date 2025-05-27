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

// Define a custom tRPC link to intercept all client-side operations
const customTrpcLink: TRPCLink<TrpcRouter> = () => {
    return ({ next, op }) => {
        // Wrap the link logic inside an observable so we can track responses, errors, and completion
        return observable((observer) => {
            // Call the next link in the chain with the operation and subscribe to its response
            const unsubscribe = next(op).subscribe({
                // Forward successful responses to the observer
                next(value) {
                    observer.next(value);
                },
                // Handle any errors that occur during the operation
                error(error) {
                    const errorIsExpected = error.data?.isExpected;

                    // If the error is unexpected, send it to Sentry for tracking
                    if (!errorIsExpected) {
                        // Only log to console if not in development mode
                        if (env.NODE_ENV !== 'development') {
                            console.error(error);
                        }
                        sentryCaptureException(error);
                    }

                    // Forward the error to downstream observers
                    observer.error(error);
                },
                // Signal that the operation has completed
                complete() {
                    observer.complete();
                }
            });

            // Return the unsubscribe function to clean up the subscription
            return unsubscribe;
        });
    };
};


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