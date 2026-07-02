import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";
import { Vehicle } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/autocaravanas/${vehicle.slug}`} className="group block overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft transition hover:-translate-y-1">
      <div className="relative aspect-[4/3]">
        <Image src={vehicle.mainImage} alt={vehicle.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-forest">{vehicle.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
              <MapPin className="h-4 w-4" />
              {vehicle.location}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-sand px-2 py-1 text-sm font-medium text-road">
            <Star className="h-4 w-4 fill-clay text-clay" />
            {vehicle.rating}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-stone-700">
          <span className="rounded-full bg-stone-100 px-3 py-1 capitalize">{vehicle.type}</span>
          <span className="flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1">
            <Users className="h-4 w-4" />
            {vehicle.seats} pessoas
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{vehicle.sleeps} camas</span>
        </div>
        <div className="flex items-end justify-between border-t border-stone-100 pt-3">
          <p className="text-sm text-stone-500">Preço desde</p>
          <p className="text-xl font-bold text-forest">{formatCurrency(vehicle.priceFrom)} <span className="text-sm font-medium text-stone-500">/ dia</span></p>
        </div>
      </div>
    </Link>
  );
}
