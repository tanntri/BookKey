import { zSignInTrpcInput } from "./input";
import { getPasswordHash } from "../../../utils/getPasswordHash";
import { signJWT } from "../../../utils/signJWT";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { ExpectedError } from "../../../lib/error";

export const signinTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcInput).mutation(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findFirst({
        where: {
            username: input.username,
            password: getPasswordHash(input.password)
        }
    })
    if (!user) {
        throw new ExpectedError('Wrong Username or Password')
    }
    const token = signJWT(user.id);

    return { token };
})