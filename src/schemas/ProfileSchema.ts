import z from "zod";


export const ProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  policeStationName: z.string().min(1, "Police station name is required"),
  badgeId: z.string().min(1, "Badge ID is required"),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;