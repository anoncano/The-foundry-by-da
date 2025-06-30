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
      <input
        className="border p-2"
        type="number"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
      />
    </div>
  );
}
