import { z } from "zod";

export const bookingRequestSchema = z.object({
  vehicleId: z.string().min(1),
  startDate: z.string().min(1, "Indique a data de início."),
  endDate: z.string().min(1, "Indique a data de fim."),
  guests: z.coerce.number().min(1),
  customerName: z.string().min(2, "Indique o nome."),
  customerEmail: z.string().email("Indique um email válido."),
  message: z.string().max(1000).optional(),
  extras: z.array(z.string()).default([])
});

export const documentUploadSchema = z.object({
  bookingId: z.string().min(1),
  documentType: z.string().min(2),
  fileName: z.string().min(3)
});

export const messageSchema = z.object({
  bookingId: z.string().min(1),
  body: z.string().min(1).max(2000),
  sender: z.enum(["cliente", "administrador"])
});

export const statusSchema = z.object({
  status: z.string().min(1),
  note: z.string().optional()
});
