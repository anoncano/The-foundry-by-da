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
    <div className="p-4 max-w-screen-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Participant Dashboard</h1>
      <p className="mb-2">Welcome! Here are a few things you can do:</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-1">Plan Summary</h2>
          <p className="text-sm">View your NDIS plan and remaining funding.</p>
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-1">Shifts & Invoices</h2>
          <p className="text-sm">Track submitted shifts and invoices.</p>
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-1">Profile</h2>
          <p className="text-sm">Update your contact information.</p>
        </div>
      </div>
    </div>
  );
}
