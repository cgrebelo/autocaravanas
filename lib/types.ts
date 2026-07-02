export type VehicleType = "autocaravana" | "campervan" | "perfilada" | "capucine" | "integral";
export type BookingStatus =
  | "Pedido enviado"
  | "A aguardar aprovação"
  | "Aprovada"
  | "A aguardar pagamento"
  | "Confirmada"
  | "Documentos pendentes"
  | "Documentos validados"
  | "Em curso"
  | "Concluída"
  | "Cancelada"
  | "Recusada";

export type Vehicle = {
  id: string;
  slug: string;
  name: string;
  type: VehicleType;
  location: string;
  privateAddress: string;
  priceFrom: number;
  seats: number;
  sleeps: number;
  beds: { type: string; size: string; people: number }[];
  rating: number;
  gearbox: "Manual" | "Automática";
  petsAllowed: boolean;
  includedKmPerDay: number;
  images: string[];
  mainImage: string;
  description: string;
  specs: Record<string, string | number>;
  features: string[];
  rules: {
    deposit: number;
    extraKmPrice: number;
    fuelPolicy: string;
    cleaningPolicy: string;
    smokingAllowed: boolean;
    abroadAllowed: boolean;
    minDriverAge: number;
    minLicenseYears: number;
  };
  extras: { id: string; name: string; price: number; unit: "reserva" | "dia" }[];
  unavailable: { start: string; end: string; reason: string }[];
  createdAt: string;
  popularity: number;
};

export type Booking = {
  id: string;
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  guests: number;
  status: BookingStatus;
  total: number;
  depositAmount: number;
  signalAmount: number;
  extras: string[];
  message?: string;
};

export type DocumentItem = {
  id: string;
  bookingId: string;
  name: string;
  status: "pendente" | "validado" | "recusado";
  rejectionReason?: string;
};

export type Message = {
  id: string;
  bookingId: string;
  sender: "cliente" | "administrador";
  body: string;
  createdAt: string;
};
