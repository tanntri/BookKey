import { withPageWrapper } from "../../../../lib/pageWrapper";

export const TradePage = withPageWrapper({
    setProps: ({ ctx }) => {
        const me = ctx.me;
        return { me }
    }
})
(({ me }) => {
    return (
        <div>Trade Coming Soon!</div>
    )
})