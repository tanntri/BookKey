import { zUpdatePasswordTrpcInput } from "./input";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { getPasswordHash } from "../../../utils/getPasswordHash";


export const updatePasswordTrpcRoute = trpcLoggedProcedure.input(zUpdatePasswordTrpcInput).mutation(async ({ctx, input}) => {
    if (!ctx.me) {
        throw new Error("UNAUTHORIZED");
    }
    if (ctx.me.password !== getPasswordHash(input.oldPassword)) {
        throw new Error("Wrong Password");
    }
    const updated = await ctx.prisma.user.update({
        where: {
            id: ctx.me.id
        },
        data: {
            password: getPasswordHash(input.newPassword)
        }
    })
    ctx.me = updated;
    return true;
})