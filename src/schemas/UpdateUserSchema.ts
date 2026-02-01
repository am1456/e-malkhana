import z from "zod";

export const UpdateUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  policeStationName: z.string().min(1, "Police station name is required"),
  badgeId: z.string().min(1, "Badge ID is required"),
  role: z.enum(["ADMIN", "OFFICER"]).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;