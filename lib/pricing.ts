import { differenceInCalendarDays, isWithinInterval, parseISO } from "date-fns";
import { Vehicle } from "./types";

export type PriceInput = {
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  selectedExtraIds?: string[];
};

export function bookingDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;
  return Math.max(0, differenceInCalendarDays(parseISO(endDate), parseISO(startDate)));
}

export function getSeasonMultiplier(date: Date) {
  const month = date.getMonth() + 1;
  if ([7, 8].includes(month)) return 1.35;
  if ([6, 9].includes(month)) return 1.15;
  if ([12].includes(month)) return 1.2;
  return 1;
}

export function hasAvailabilityConflict(vehicle: Vehicle, startDate: string, endDate: string) {
  if (!startDate || !endDate) return false;
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return vehicle.unavailable.some((block) => {
    const blockStart = parseISO(block.start);
    const blockEnd = parseISO(block.end);
    return start < blockEnd && end > blockStart;
  });
}

export function calculatePrice({ vehicle, startDate, endDate, selectedExtraIds = [] }: PriceInput) {
  const days = bookingDays(startDate, endDate);
  const baseDates = Array.from({ length: days }, (_, index) => {
    const date = parseISO(startDate);
    date.setDate(date.getDate() + index);
    return date;
  });
  const rentalSubtotal = baseDates.reduce((sum, date) => sum + vehicle.priceFrom * getSeasonMultiplier(date), 0);
  const discountRate = days >= 30 ? 0.12 : days >= 14 ? 0.08 : days >= 7 ? 0.05 : 0;
  const discount = rentalSubtotal * discountRate;
  const selectedExtras = vehicle.extras.filter((extra) => selectedExtraIds.includes(extra.id));
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + (extra.unit === "dia" ? extra.price * days : extra.price), 0);
  const cleaningFee = 45;
  const total = Math.round(rentalSubtotal - discount + extrasTotal + cleaningFee);

  return {
    days,
    dayPrice: vehicle.priceFrom,
    rentalSubtotal: Math.round(rentalSubtotal),
    discount: Math.round(discount),
    discountRate,
    extrasTotal,
    cleaningFee,
    total,
    signal: Math.round(total * 0.25),
    remaining: Math.round(total * 0.75),
    deposit: vehicle.rules.deposit,
    selectedExtras
  };
}

export function unavailableReasons(vehicle: Vehicle, startDate: string, endDate: string) {
  if (!hasAvailabilityConflict(vehicle, startDate, endDate)) return [];
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return vehicle.unavailable
    .filter((block) => isWithinInterval(parseISO(block.start), { start, end }) || (start < parseISO(block.end) && end > parseISO(block.start)))
    .map((block) => block.reason);
}
