import { z } from "zod";
import { zStringRequired } from "@bookkey/shared/src/zod";

export const zSetLibrary = z.object({
    bookId: zStringRequired,
    possessedByCurrUser: z.boolean()
})