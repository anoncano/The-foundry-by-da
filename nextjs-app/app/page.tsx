'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { getUserRole } from '@/lib/getUserRole';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        if (role === 'worker') router.push('/worker/dashboard');
        else if (role === 'admin') router.push('/admin');
        else router.push('/participant');
      }
    });
    return unsub;
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-6">
      <h1 className="text-3xl font-bold">NDIS Shift Logging &amp; Invoicing Demo</h1>
      <p className="max-w-xl">
        This demo shows a simple platform for workers and participants to record
        shifts and create NDIS-compliant invoices using Firebase and Next.js.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
