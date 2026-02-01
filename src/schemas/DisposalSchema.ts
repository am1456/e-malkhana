import { z } from "zod";

export const DisposalSchema = z.object({
  disposalType: z
    .string()
    .min(1, "Please select disposal type")
    .refine(
      (val) =>
        ["RETURNED", "DESTROYED", "AUCTIONED", "COURT_CUSTODY"].includes(val),
      "Invalid disposal type"
    ),
  courtOrderReference: z.string().min(1, "Court order reference is required"),
  dateOfDisposal: z.string().min(1, "Date of disposal is required"),
  remarks: z.string().optional(),
});

export type DisposalFormData = z.infer<typeof DisposalSchema>;

