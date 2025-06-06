import { zUpdateProfileTrpcInput } from "./input";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import _ from 'lodash';
import { ExpectedError } from "../../../lib/error";
import { pick } from "@bookkey/shared/src/pick";


export const updateProfileTrpcRoute = trpcLoggedProcedure.input(zUpdateProfileTrpcInput).mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
        throw new Error("UNAUTHORIZED");
    }

    if (ctx.me.username !== input.username) {
        // Check if a user with the new username already exists
        const existedUser = await ctx.prisma.user.findUnique({
            where: {
                username: input.username
            }
        })
        // In case of a user with this username already exists, don't let the user change it
        if (existedUser) {
            throw new ExpectedError("User with this username already exists")
        }
    }
    const allowedFields = pick(input, ['username', 'avatar']);
    const updatedMe = await ctx.prisma.user.update({
        where: {
            id: ctx.me.id
        },
        data: allowedFields
    })
    ctx.me = updatedMe;
    return pick(ctx.me, ['id', 'username']);
})