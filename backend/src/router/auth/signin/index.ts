import { zSignInTrpcInput } from "./input";
import { signJWT } from "../../../utils/signJWT";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { ExpectedError } from "../../../lib/error";
import bcrypt from "bcrypt";

export const signinTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcInput).mutation(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findFirst({
        where: {
            username: input.username,
        }
    })
    // If the user does not exist or password does not match
    if (!user || !await bcrypt.compare(input.password, user.password)) {
        throw new ExpectedError('Wrong Username or Password')
    }
    const token = signJWT(user.id);

    return { token, userId: user.id };
})