import { zSignUpTrpcInput } from "./input";
import { getPasswordHash } from "../../../utils/getPasswordHash";
import { signJWT } from "../../../utils/signJWT";
import { sendRegistrationEmail } from "../../../lib/emails";
import { trpcLoggedProcedure } from "../../../lib/trpc";
import { ExpectedError } from "../../../lib/error";

export const signupTrpcRoute = trpcLoggedProcedure.input((zSignUpTrpcInput)).mutation(async ({ctx, input}) => {
    const existingUsername = await ctx.prisma.user.findUnique({
        where: {
            username: input.username
        }
    })
    if (existingUsername) {
        throw new ExpectedError('User with this username already exists');
    }
    const existingEmail = await ctx.prisma.user.findUnique({
        where: {
            email: input.email
        }
    })
    if (existingEmail) {
        throw new ExpectedError('User with this email already exists');
    }
    const user = await ctx.prisma.user.create({
        data: {
            username: input.username,
            email: input.email,
            password: await getPasswordHash(input.password)
        }
    })
    // send registration email
    void sendRegistrationEmail({ user });
    const token = signJWT(user.id)
    return { token, userId: user.id };
})