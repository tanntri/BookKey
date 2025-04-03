import { trpc } from "../../../lib/trpc";
import { zSignInTrpcInput } from "./input";
import { getPasswordHash } from "../../../utils/getPasswordHash";
import { signJWT } from "../../../utils/signJWT";

export const signinTrpcRoute = trpc.procedure.input(zSignInTrpcInput).mutation(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findFirst({
        where: {
            username: input.username,
            password: getPasswordHash(input.password)
        }
    })
    if (!user) {
        throw new Error('Wrong Username or Password')
    }
    console.log('found user');
    const token = signJWT(user.id);

    return { token };
})