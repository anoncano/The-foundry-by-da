'use client';
import { useEffect, useState } from 'react';
import { validateRateCap } from '@/lib/validateRateCap';

interface Service {
  code: string;
  name: string;
  tiers: { name: string; maxRate: number }[];
}

interface Props {
  services: Service[];
  value: string;
  rate: number;
  onChange: (code: string, rate: number) => void;
}

export default function ServiceSelector({ services, value, rate, onChange }: Props) {
  const [maxRate, setMaxRate] = useState(services[0]?.tiers[0]?.maxRate ?? 0);

  useEffect(() => {
    const selected = services.find((s) => s.code === value) ?? services[0];
    setMaxRate(selected?.tiers[0]?.maxRate ?? 0);
  }, [value, services]);

  const handleRateChange = (r: number) => {
    const capped = validateRateCap(r, maxRate);
    onChange(value, capped);
  };

  return (
    <div>
      <select
        className="border p-2 w-full text-black"
        value={value}
        onChange={(e) => onChange(e.target.value, rate)}
      >
        {services.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 mt-2">
        <span>Rate</span>
        <input
          className="border p-2 flex-1 text-black"
          type="number"
          value={rate}
          onChange={(e) => handleRateChange(Number(e.target.value))}
          max={maxRate}
        />
        <span className="text-sm text-gray-500">Max {maxRate}</span>
      </label>
    </div>
  );
}
