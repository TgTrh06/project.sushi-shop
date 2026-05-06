import { z } from "zod";
export const SeatSchema = z.object({
  code: z.string().min(1).max(10),           // e.g., "T1-A", "C1"
  type: z.enum(["table", "counter"]),        // Seat type
  section: z.string().optional(),            // e.g., "Omakase Counter"
  x: z.number(),                             // SVG X coordinate
  y: z.number(),                             // SVG Y coordinate
  capacity: z.number().min(1).max(20),       // People per seat
  isActive: z.boolean().default(true),
});
export type ISeat = z.infer<typeof SeatSchema> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
