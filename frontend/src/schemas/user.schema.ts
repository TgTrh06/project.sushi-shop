import z from "zod";

export const updatedProfileSchema = z.object({
  name: z.string().min(2),
  // phone: z.string().optional(),
  // address: z.string().optional(),
})

export type UpdateProfileDTO = z.infer<typeof updatedProfileSchema>