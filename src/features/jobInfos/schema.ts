import { z } from "zod";
import { experienceLevels } from "@/drizzle/schema";

export const jobInfoSchema = z.object({
  name: z.string().min(1, "Required"),
  title: z.string().nullable(),
  experienceLevel: z.enum(experienceLevels),
  description: z.string().min(1, "Required"),
});
