import { zUpdateProfileTrpcInput } from "./input";
import { trpc } from "../../../lib/trpc";
import _ from 'lodash';


export const updateProfileTrpcRoute = trpc.procedure.input(zUpdateProfileTrpcInput).mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
        throw new Error("UNORTHORIZED");
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
            throw Error("User with this username already exists")
        }
    }
    const updatedMe = await ctx.prisma.user.update({
        where: {
            id: ctx.me.id
        },
        data: input
    })
    ctx.me = updatedMe;
    return _.pick(ctx.me, ['id', 'usernane']);
})