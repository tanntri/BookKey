import { z } from "zod";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { AppContext } from "../../../lib/ctx";

const getUserInfo = async (ctx: AppContext, userId: string) => {
    const userInfo = await ctx.prisma.user.findUnique({
        select: {
            avatar: true,
            username: true,
            id: true
        },
        where: {
            id: userId
        }
    })
    return userInfo;
}

export const getUserProfileTrpcRoute = trpcLoggedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
        const userInfo = await getUserInfo(ctx, input.userId);

        return {
            userInfo
        }

    })
