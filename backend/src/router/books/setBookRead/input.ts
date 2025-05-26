import { z } from "zod";
import { zStringRequired } from "@bookkey/shared/src/zod";

export const zSetBookRead = z.object({
    bookId: zStringRequired,
    readByCurrUser: z.boolean()
})