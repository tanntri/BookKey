import { z } from "zod";
import { zStringMin } from "@bookkey/shared/src/zod";

export const zUpdatePasswordTrpcInput = z.object({
    oldPassword: zStringMin(4),
    newPassword: zStringMin(4)
})