import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(1, "Full name is required"),
    policeStationName: z.string().min(1, "Police station name is required"),
    badgeId: z.string().min(1, "Badge ID is required"),
    role: z
        .string()
        .min(1, "Please select a role")
        .refine(
            (val) =>
                ["ADMIN", "OFFICER"].includes(val),
            "Invalid role"
        ),
});

export type CreateUserFormData = z.infer<typeof CreateUserSchema>;