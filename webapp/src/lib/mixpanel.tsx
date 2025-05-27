import type { TrpcRouterOutput } from "@bookkey/backend/src/router";
import mixpanel from "mixpanel-browser";
import { useEffect } from "react";
import { useMe } from "./ctx";
import { env } from "./env";

if (env.VITE_MIXPANEL_API_KEY) {
    mixpanel.init(env.VITE_MIXPANEL_API_KEY)
}

const whenEnabled = <T,>(fn: T): T => {
    return env.VITE_MIXPANEL_API_KEY ? fn : ((() => {}) as T)
}

export const mixpanelIdentify = whenEnabled((userId: string) => {
    mixpanel.identify(userId);
})

export const mixpanelAlias = whenEnabled((userId: string) => {
    mixpanel.alias(userId);
})

export const mixpanelReset = whenEnabled(() => {
    mixpanel.reset();
})

export const mixpanelPeopleSet = whenEnabled((me: NonNullable<TrpcRouterOutput['getMe']['me']>) => {
    mixpanel.people.set({
        $email: me.email,
        $username: me.username
    })
})

export const mixpanelTrackSignup = whenEnabled(() => {
    mixpanel.track('Sign Up');
})

export const mixpanelTrackSignin = whenEnabled(() => {
    mixpanel.track('Sign In');
})

export const mixpanelSetReviewLike = whenEnabled((review: TrpcRouterOutput['setReviewLike']['review']) => {
    mixpanel.track('Like', { reviewId: review.id })
})

// TODO: mixPanelSetBookLike once migrate to getting books from api

export const MixpanelUser = () => {
    const me = useMe();

    useEffect(() => {
        if (me) {
            mixpanelPeopleSet(me);
        } else {
            mixpanelReset();
        }
    }, [me])
    return null;
}