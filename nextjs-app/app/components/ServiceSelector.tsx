'use client';
import { useEffect, useState } from 'react';
import { validateRateCap } from '@/lib/validateRateCap';

interface Service {
  code: string;
  name: string;
  tiers: { name: string; maxRate: number }[];
}

export default function ServiceSelector({ services }: { services: Service[] }) {
  const [rate, setRate] = useState(0);
  const maxRate = services[0]?.tiers[0]?.maxRate ?? 0;

  useEffect(() => {
    setRate(validateRateCap(rate, maxRate));
  }, [rate, maxRate]);
  return (
    <div>
      <select className="border p-2">
        {services.map((s) => (
          <option key={s.code}>{s.name}</option>
        ))}
      </select>
      <label className="flex items-center gap-2 mt-2">
        <span>Rate</span>
        <input
          className="border p-2 flex-1"
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          max={maxRate}
        />
        <span className="text-sm text-gray-500">Max {maxRate}</span>
      </label>
    </div>
  );
}
