import { Booking, DocumentItem, Message, OwnerProfile, UserAccount, Vehicle } from "./types";

export const users: UserAccount[] = [
  { id: "u-admin", role: "administrador", fullName: "Administrador Rota Livre", email: "admin@rotalivre.pt", phone: "+351 900 000 001", status: "ativo", createdAt: "2026-04-01" },
  { id: "u-owner-1", role: "proprietario", fullName: "Ana Martins", email: "ana.proprietaria@example.com", phone: "+351 910 000 001", status: "ativo", createdAt: "2026-04-12" },
  { id: "u-owner-2", role: "proprietario", fullName: "João Pereira", email: "joao.proprietario@example.com", phone: "+351 920 000 002", status: "ativo", createdAt: "2026-05-04" },
  { id: "u-owner-3", role: "proprietario", fullName: "Douro Campers Lda", email: "douro@example.com", phone: "+351 930 000 003", status: "pendente", createdAt: "2026-06-10" },
  { id: "u-client-1", role: "cliente", fullName: "Inês Ferreira", email: "ines@example.com", phone: "+351 940 000 004", status: "ativo", createdAt: "2026-06-18" },
  { id: "u-client-2", role: "cliente", fullName: "Miguel Ramos", email: "miguel@example.com", phone: "+351 950 000 005", status: "ativo", createdAt: "2026-06-24" }
];

export const owners: OwnerProfile[] = [
  { id: "o1", userId: "u-owner-1", displayName: "Ana Martins Campers", fiscalName: "Ana Martins", location: "Sintra, Lisboa", rating: 4.8, verified: true, payoutStatus: "ativo" },
  { id: "o2", userId: "u-owner-2", displayName: "Costa Vicentina Vans", fiscalName: "João Pereira", location: "Lagos, Algarve", rating: 4.7, verified: true, payoutStatus: "ativo" },
  { id: "o3", userId: "u-owner-3", displayName: "Douro Campers", fiscalName: "Douro Campers Lda", location: "Vila Nova de Gaia, Porto", rating: 4.9, verified: false, payoutStatus: "pendente" }
];

export const vehicles: Vehicle[] = [
  {
    id: "v1",
    ownerId: "o1",
    slug: "serra-atlantica",
    name: "Serra Atlântica",
    type: "perfilada",
    location: "Sintra, Lisboa",
    privateAddress: "Rua da Serra 12, Sintra",
    priceFrom: 92,
    seats: 4,
    sleeps: 4,
    beds: [
      { type: "Cama francesa", size: "190 x 135 cm", people: 2 },
      { type: "Cama convertível", size: "185 x 120 cm", people: 2 }
    ],
    rating: 4.8,
    gearbox: "Manual",
    petsAllowed: true,
    includedKmPerDay: 250,
    mainImage: "https://images.unsplash.com/photo-1533614767277-878ed0e2f405?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1533614767277-878ed0e2f405?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
    ],
    description:
      "Autocaravana confortável para viagens em família, com cozinha equipada, boa autonomia elétrica e espaço interior pensado para percursos longos.",
    specs: {
      Marca: "Rimor",
      Modelo: "Seal 695",
      Ano: 2022,
      "Lotação em viagem": 4,
      "Lotação para dormir": 4,
      "Tipo de carta": "B",
      Comprimento: "7,35 m",
      Altura: "3,05 m",
      Peso: "3.500 kg",
      Combustível: "Diesel",
      "Consumo estimado": "10 l/100 km",
      Caixa: "Manual"
    },
    features: ["Cozinha", "Frigorífico", "WC", "Duche", "Aquecimento", "Painel solar", "Toldo", "Porta-bicicletas"],
    rules: {
      deposit: 1200,
      extraKmPrice: 0.28,
      fuelPolicy: "Entrega e devolução com depósito cheio.",
      cleaningPolicy: "Devolução limpa; taxa aplicável se necessário.",
      smokingAllowed: false,
      abroadAllowed: true,
      minDriverAge: 25,
      minLicenseYears: 3
    },
    extras: [
      { id: "linen", name: "Roupa de cama", price: 35, unit: "reserva" },
      { id: "child-seat", name: "Cadeira de criança", price: 20, unit: "reserva" },
      { id: "airport", name: "Transfer aeroporto", price: 55, unit: "reserva" }
    ],
    unavailable: [
      { start: "2026-07-12", end: "2026-07-18", reason: "Reserva confirmada" },
      { start: "2026-08-02", end: "2026-08-05", reason: "Manutenção" }
    ],
    createdAt: "2026-05-18",
    popularity: 96,
    status: "publicado"
  },
  {
    id: "v2",
    ownerId: "o2",
    slug: "costa-vicentina",
    name: "Costa Vicentina",
    type: "campervan",
    location: "Lagos, Algarve",
    privateAddress: "Estrada da Meia Praia 8, Lagos",
    priceFrom: 74,
    seats: 2,
    sleeps: 2,
    beds: [{ type: "Cama elevatória", size: "188 x 130 cm", people: 2 }],
    rating: 4.7,
    gearbox: "Automática",
    petsAllowed: false,
    includedKmPerDay: 220,
    mainImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1496545672447-f699b503d270?auto=format&fit=crop&w=1400&q=80"
    ],
    description: "Campervan ágil e económica, ideal para duas pessoas que querem explorar praias, serras e aldeias com total flexibilidade.",
    specs: {
      Marca: "Volkswagen",
      Modelo: "California Ocean",
      Ano: 2023,
      "Lotação em viagem": 2,
      "Lotação para dormir": 2,
      "Tipo de carta": "B",
      Comprimento: "4,90 m",
      Altura: "1,99 m",
      Peso: "3.080 kg",
      Combustível: "Diesel",
      "Consumo estimado": "7 l/100 km",
      Caixa: "Automática"
    },
    features: ["Cozinha", "Frigorífico", "Aquecimento", "Painel solar", "Bateria auxiliar", "Tomadas USB", "Mesa exterior", "Cadeiras"],
    rules: {
      deposit: 900,
      extraKmPrice: 0.24,
      fuelPolicy: "Depósito cheio na recolha e na entrega.",
      cleaningPolicy: "Interior limpo e cozinha entregue sem loiça por lavar.",
      smokingAllowed: false,
      abroadAllowed: true,
      minDriverAge: 23,
      minLicenseYears: 2
    },
    extras: [
      { id: "surf", name: "Suporte prancha", price: 18, unit: "reserva" },
      { id: "airport", name: "Transfer aeroporto", price: 45, unit: "reserva" }
    ],
    unavailable: [{ start: "2026-07-20", end: "2026-07-24", reason: "Uso próprio" }],
    createdAt: "2026-06-02",
    popularity: 88,
    status: "publicado"
  },
  {
    id: "v3",
    ownerId: "o3",
    slug: "douro-livre",
    name: "Douro Livre",
    type: "capucine",
    location: "Vila Nova de Gaia, Porto",
    privateAddress: "Rua do Rio 31, Vila Nova de Gaia",
    priceFrom: 108,
    seats: 6,
    sleeps: 6,
    beds: [
      { type: "Cama capucine", size: "210 x 150 cm", people: 2 },
      { type: "Beliches", size: "190 x 80 cm", people: 2 },
      { type: "Cama sala", size: "180 x 110 cm", people: 2 }
    ],
    rating: 4.9,
    gearbox: "Manual",
    petsAllowed: true,
    includedKmPerDay: 300,
    mainImage: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1400&q=80"
    ],
    description: "Autocaravana espaçosa para grupos e famílias, com camas fixas, WC completo, duche separado e arrumação generosa.",
    specs: {
      Marca: "Roller Team",
      Modelo: "Kronos 277M",
      Ano: 2021,
      "Lotação em viagem": 6,
      "Lotação para dormir": 6,
      "Tipo de carta": "B",
      Comprimento: "7,45 m",
      Altura: "3,20 m",
      Peso: "3.500 kg",
      Combustível: "Diesel",
      "Consumo estimado": "11 l/100 km",
      Caixa: "Manual"
    },
    features: ["Cozinha", "Frigorífico", "WC", "Duche", "Aquecimento", "Ar condicionado", "Painel solar", "Utensílios de cozinha"],
    rules: {
      deposit: 1400,
      extraKmPrice: 0.3,
      fuelPolicy: "Política cheio-cheio.",
      cleaningPolicy: "Taxa de limpeza de 60 euros se não for devolvida limpa.",
      smokingAllowed: false,
      abroadAllowed: false,
      minDriverAge: 27,
      minLicenseYears: 4
    },
    extras: [
      { id: "bike", name: "Porta-bicicletas", price: 25, unit: "reserva" },
      { id: "delivery", name: "Entrega noutro local", price: 85, unit: "reserva" }
    ],
    unavailable: [{ start: "2026-09-01", end: "2026-09-08", reason: "Reserva confirmada" }],
    createdAt: "2026-04-11",
    popularity: 91,
    status: "pendente"
  }
];

export const bookings: Booking[] = [
  {
    id: "b1",
    vehicleId: "v1",
    customerName: "Inês Ferreira",
    customerEmail: "ines@example.com",
    startDate: "2026-07-12",
    endDate: "2026-07-18",
    guests: 4,
    status: "Confirmada",
    total: 704,
    depositAmount: 1200,
    signalAmount: 176,
    extras: ["Roupa de cama"]
  },
  {
    id: "b2",
    vehicleId: "v2",
    customerName: "Miguel Ramos",
    customerEmail: "miguel@example.com",
    startDate: "2026-08-10",
    endDate: "2026-08-15",
    guests: 2,
    status: "A aguardar aprovação",
    total: 470,
    depositAmount: 900,
    signalAmount: 118,
    extras: ["Transfer aeroporto"],
    message: "Gostava de confirmar se posso recolher ao final do dia."
  }
];

export const documents: DocumentItem[] = [
  { id: "d1", bookingId: "b1", name: "Carta de condução", status: "validado" },
  { id: "d2", bookingId: "b1", name: "Comprovativo de morada", status: "pendente" },
  { id: "d3", bookingId: "b2", name: "Cartão de cidadão/passaporte", status: "recusado", rejectionReason: "Imagem ilegível." }
];

export const messages: Message[] = [
  { id: "m1", bookingId: "b2", sender: "cliente", body: "Olá, posso levar uma cadeira de criança?", createdAt: "2026-07-01T10:15:00Z" },
  { id: "m2", bookingId: "b2", sender: "administrador", body: "Sim, podemos adicionar esse extra ao pedido.", createdAt: "2026-07-01T11:05:00Z" }
];
