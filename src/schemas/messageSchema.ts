import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, "Message should be atleast 10 characters")
        .max(300, "Message cannot be longer than 300 characters"),
});
