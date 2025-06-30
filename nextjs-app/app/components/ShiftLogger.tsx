'use client';
import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

interface Client {
  id: string;
  name: string;
}

export default function ShiftLogger() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [serviceCode, setServiceCode] = useState('');

  useEffect(() => {
    getDocs(collection(db, 'clients')).then((snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...(d.data() as { name: string }) })));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'shifts'), {
      clientId,
      date,
      startTime: start,
      endTime: end,
      serviceCode,
    });
    setClientId('');
    setServiceCode('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <select className="border p-2 text-black" value={clientId} onChange={(e) => setClientId(e.target.value)}>
        <option value="">Select Client</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input className="border p-2 text-black" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input className="border p-2 text-black" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
      <input className="border p-2 text-black" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
      <input className="border p-2 text-black" placeholder="Service Code" value={serviceCode} onChange={(e) => setServiceCode(e.target.value)} />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Log
      </button>
    </form>
  );
}
