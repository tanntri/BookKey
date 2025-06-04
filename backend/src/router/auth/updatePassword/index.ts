import { zUpdatePasswordTrpcInput } from "./input";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { getPasswordHash } from "../../../utils/getPasswordHash";
import { ExpectedError } from "../../../lib/error";
import bcrypt from "bcrypt";


export const updatePasswordTrpcRoute = trpcLoggedProcedure.input(zUpdatePasswordTrpcInput).mutation(async ({ctx, input}) => {
    if (!ctx.me) {
        throw new Error("UNAUTHORIZED");
    }
    const isMatch = await bcrypt.compare(input.oldPassword, ctx.me.password);
    if (!isMatch) {
        throw new ExpectedError("Wrong Password");
    }
    const updated = await ctx.prisma.user.update({
        where: {
            id: ctx.me.id
        },
        data: {
            password: await getPasswordHash(input.newPassword)
        }
    })
    ctx.me = updated;
    return true;
})