'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import WorkerSidebar from '@/app/components/WorkerSidebar';
import ClientForm from '@/app/components/ClientForm';

interface Client {
  id: string;
  name: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'clients')).then((snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...(d.data() as { name: string }) })));
    });
  }, []);

  return (
    <div className="flex">
      <WorkerSidebar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Clients</h1>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {clients.map((c) => (
            <div key={c.id} className="border p-2 rounded shadow-sm">
              {c.name}
            </div>
          ))}
        </div>
        <ClientForm />
      </div>
    </div>
  );
}
