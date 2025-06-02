import { withPageWrapper } from "../../../../lib/pageWrapper";

export const RentPage = withPageWrapper({
    setProps: ({ ctx }) => {
        const me = ctx.me;
        return { me }
    }
})
(({  }) => {
    return (
        <div>Rent Coming Soon!</div>
    )
})