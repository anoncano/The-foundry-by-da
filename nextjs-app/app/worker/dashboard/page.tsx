'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import WorkerSidebar from '@/app/components/WorkerSidebar';

export default function DashboardPage() {
  const [total, setTotal] = useState(0);
  const [clients, setClients] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const invSnap = await getDocs(collection(db, 'invoices'));
      let t = 0;
      invSnap.forEach((d) => {
        const data = d.data() as { amount?: number };
        t += data.amount ?? 0;
      });
      setTotal(t);
      const clientSnap = await getDocs(collection(db, 'clients'));
      setClients(clientSnap.size);
    };
    loadData();
  }, []);

  return (
    <div className="flex">
      <WorkerSidebar />
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p>Total Invoiced This Month: ${total.toFixed(2)}</p>
        <p>Active Clients: {clients}</p>
        <div className="flex gap-2">
          <Link href="/worker/clients" className="bg-blue-500 text-white p-2">
            Add Client
          </Link>
          <Link href="/worker/shifts" className="bg-blue-500 text-white p-2">
            Add Shift
          </Link>
          <Link href="/worker/invoices" className="bg-blue-500 text-white p-2">
            Add Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}
