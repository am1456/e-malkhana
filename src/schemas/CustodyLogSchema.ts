import { z } from "zod";

export const CustodyLogSchema = z.object({
  fromLocation: z.string().min(1, "From location is required"),
  fromOfficer: z.string().min(1, "From officer name is required"),
  toLocation: z.string().min(1, "To location is required"),
  toOfficer: z.string().min(1, "To officer name is required"),
  purpose: z.string().min(1, "Purpose is required"),
  dateTime: z.string().min(1, "Date and time is required"),
  remarks: z.string().optional(),
});

export type CustodyLogFormData = z.infer<typeof CustodyLogSchema>;