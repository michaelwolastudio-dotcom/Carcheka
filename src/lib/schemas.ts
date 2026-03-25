import { z } from "zod";

export const vinSchema = z.string().length(17, "VIN must be exactly 17 characters").regex(/^[A-HJ-NPR-Z0-9]+$/, "Invalid VIN format (no I, O, or Q)");

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  workshopName: z.string().min(2, "Workshop name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  cacNumber: z.string().min(5, "Valid CAC Business Registration Number is required"),
});

export const repairSchema = z.object({
  vehicleInfo: z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    plateNumber: z.string().min(1, "Plate number is required"),
  }),
  serviceDetails: z.object({
    category: z.string().min(1, "Category is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    odometer: z.string().min(1, "Odometer reading is required"),
  }),
  media: z.array(z.string()).optional(),
});

export type RepairFormValues = z.infer<typeof repairSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
