import { formatCurrency } from "@/lib/utils";

type Props = {
  price: {
    days: number;
    rentalSubtotal: number;
    discount: number;
    extrasTotal: number;
    cleaningFee: number;
    total: number;
    signal: number;
    remaining: number;
    deposit: number;
  };
};

export function PriceBreakdown({ price }: Props) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <h3 className="font-semibold text-forest">Detalhe do preço</h3>
      <dl className="mt-3 space-y-2 text-sm text-stone-700">
        <div className="flex justify-between">
          <dt>Aluguer ({price.days || 0} dias)</dt>
          <dd>{formatCurrency(price.rentalSubtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Desconto</dt>
          <dd>-{formatCurrency(price.discount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Extras</dt>
          <dd>{formatCurrency(price.extrasTotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Taxa de limpeza</dt>
          <dd>{formatCurrency(price.cleaningFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-bold text-forest">
          <dt>Total</dt>
          <dd>{formatCurrency(price.total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Sinal estimado</dt>
          <dd>{formatCurrency(price.signal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Valor restante</dt>
          <dd>{formatCurrency(price.remaining)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Caução</dt>
          <dd>{formatCurrency(price.deposit)}</dd>
        </div>
      </dl>
    </div>
  );
}
