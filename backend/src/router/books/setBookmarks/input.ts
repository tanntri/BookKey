import { z } from "zod";
import { zStringRequired } from "@bookkey/shared/src/zod";

export const zSetBookmarks = z.object({
    bookId: zStringRequired,
    savedByCurrUser: z.boolean()
})