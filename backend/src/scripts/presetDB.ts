import { env } from '../lib/env';
import { type AppContext } from "../lib/ctx";
import { getPasswordHash } from "../utils/getPasswordHash";

export const presetDB = async (ctx: AppContext) => {
    await ctx.prisma.user.upsert({
        where: {
            username: 'admin'
        },
        create: {
            username: 'admin',
            email: 'admin@example.com',
            password: await getPasswordHash(env.INITIAL_ADMIN_PASSWORD),
            permissions: ['ALL']
        },
        update: {
            permissions: ['ALL']
        }
    })
}