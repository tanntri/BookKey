import { trpc } from "../../../lib/trpc";
import { zSignUpTrpcInput } from "./input";
import { getPasswordHash } from "../../../utils/getPasswordHash";
import { signJWT } from "../../../utils/signJWT";

export const signupTrpcRoute = trpc.procedure.input((zSignUpTrpcInput)).mutation(async ({ctx, input}) => {
    const existingUser = await ctx.prisma.user.findUnique({
        where: {
            username: input.username
        }
    })
    if (existingUser) {
        throw Error('User already existed')
    }
    const user = await ctx.prisma.user.create({
        data: {
            username: input.username,
            password: getPasswordHash(input.password)
        }
    })
    const token = signJWT(user.id)
    return { token };
})