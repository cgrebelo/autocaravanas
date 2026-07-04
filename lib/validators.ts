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

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(["cliente", "proprietario"]),
  ownerDisplayName: z.string().optional()
}).refine((data) => data.role === "cliente" || Boolean(data.ownerDisplayName?.trim()), {
  path: ["ownerDisplayName"],
  message: "Indique o nome público do proprietário."
});

export const vehicleCreateSchema = z.object({
  ownerId: z.string().min(1),
  name: z.string().min(2),
  type: z.enum(["autocaravana", "campervan", "perfilada", "capucine", "integral"]),
  location: z.string().min(2),
  privateAddress: z.string().min(2),
  priceFrom: z.coerce.number().min(1),
  seats: z.coerce.number().min(1),
  sleeps: z.coerce.number().min(1),
  description: z.string().min(20)
});
