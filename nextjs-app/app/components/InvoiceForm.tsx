'use client';
import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import ServiceSelector from './ServiceSelector';
import { getNDIACatalogue } from '@/lib/getNDIACatalogue';
import { createInvoicePDF } from '@/lib/createInvoicePDF';

interface Client {
  id: string;
  name: string;
}

export default function InvoiceForm() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [serviceCode, setServiceCode] = useState('');
  const [rate, setRate] = useState(0);
  const [catalogue, setCatalogue] = useState<{ code: string; name: string; tiers: { name: string; maxRate: number }[] }[]>([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    getDocs(collection(db, 'clients')).then((snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...(d.data() as { name: string }) })));
    });
    getNDIACatalogue('2025-2026').then((c) => setCatalogue(c.services));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invoice = { clientId, date, serviceCode, amount };
    await addDoc(collection(db, 'invoices'), invoice);
    createInvoicePDF(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <select className="border p-2" value={clientId} onChange={(e) => setClientId(e.target.value)}>
        <option value="">Select Client</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input className="border p-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <ServiceSelector
        services={catalogue}
        value={serviceCode}
        rate={rate}
        onChange={(code, r) => {
          setServiceCode(code);
          setRate(r);
          setAmount(r);
        }}
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Save Invoice
      </button>
    </form>
  );
}
