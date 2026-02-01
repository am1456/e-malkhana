import { z } from "zod";

export const NewCaseSchema = z
  .object({
    policeStationName: z.string().min(1, "Police Station Name is required"),
    investigatingOfficerName: z.string().min(1, "Officer Name is required"),
    investigatingOfficerId: z.string().min(1, "Officer ID is required"),
    crimeNumber: z.string().min(1, "Crime Number is required"),
    crimeYear: z
      .number({ message: "Crime Year must be a number" })
      .min(1900, "Invalid year")
      .max(new Date().getFullYear(), "Invalid year"),
    dateOfFIR: z.string().min(1, "Date of FIR is required"),
    dateOfSeizure: z.string().min(1, "Date of Seizure is required"),
    actAndLaw: z.string().min(1, "Act & Law is required"),
    sectionOfLaw: z.string().min(1, "Section of Law is required"),
  })
  .refine((data) => new Date(data.dateOfSeizure) >= new Date(data.dateOfFIR), {
    message: "Date of Seizure cannot be before Date of FIR",
    path: ["dateOfSeizure"],
  });

export type NewCaseFormData = z.infer<typeof NewCaseSchema>;