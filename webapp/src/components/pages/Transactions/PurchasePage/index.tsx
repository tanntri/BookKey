import { withPageWrapper } from "../../../../lib/pageWrapper";

export const PurchasePage = withPageWrapper({
    setProps: ({ ctx }) => {
        const me = ctx.me;
        return { me }
    }
})
(({  }) => {
    return (
        <div>Purchase Coming Soon!</div>
    )
})