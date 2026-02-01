import { z } from "zod";

export const PropertySchema = z.object({
  category: z.string().min(1, "Category is required"),
  belongingTo: z
    .string()
    .min(1, "Please select who the property belongs to")
    .refine(
      (val) => ["ACCUSED", "COMPLAINANT", "UNKNOWN"].includes(val),
      "Invalid selection"
    ),
  nature: z.string().min(1, "Nature of property is required"),
  quantity: z.string().min(1, "Quantity is required"),
  location: z.string().min(1, "Storage location is required"),
  description: z.string().min(1, "Description is required"),
  photoUrl: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof PropertySchema>;