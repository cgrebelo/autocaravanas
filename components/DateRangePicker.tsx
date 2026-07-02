"use client";

type Props = {
  startDate?: string;
  endDate?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
};

export function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-medium text-road">
        Data de início
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={(event) => onStartChange?.(event.target.value)}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20"
        />
      </label>
      <label className="text-sm font-medium text-road">
        Data de fim
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={(event) => onEndChange?.(event.target.value)}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20"
        />
      </label>
    </div>
  );
}
