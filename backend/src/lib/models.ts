import { type User } from "@prisma/client";
import _ from "lodash"
import { pick } from "@bookkey/shared/src/pick";

export const toClientMe = (user: User | null) => {
    return user && pick(user, ['id', 'username', 'permissions', 'email']);
}