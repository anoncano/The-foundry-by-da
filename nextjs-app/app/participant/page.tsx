'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';

export default function ParticipantDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/login');
      else setLoading(false);
    });
    return unsub;
  }, [router]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Participant Dashboard</h1>
      <p className="mb-2">This page will eventually show plan details.</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>View your NDIS plan summary</li>
        <li>Track submitted shifts and invoices</li>
        <li>Update your contact information</li>
      </ul>
    </div>
  );
}
