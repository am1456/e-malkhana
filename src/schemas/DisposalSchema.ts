import { z } from "zod";

export const DisposalSchema = z.object({
  disposalType: z.enum(["RETURNED", "DESTROYED", "AUCTIONED", "COURT_CUSTODY"], {
    required_error: "Please select disposal type",
  }),
  courtOrderReference: z.string().min(1, "Court order reference is required"),
  dateOfDisposal: z.string().min(1, "Date of disposal is required"),
  remarks: z.string().optional(),
});

export type DisposalFormData = z.infer<typeof DisposalSchema>;