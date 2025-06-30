'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <a className="bg-blue-500 text-white px-4 py-2" href="/login">
        Login
      </a>
      <a className="bg-green-500 text-white px-4 py-2" href="/signup">
        Sign Up
      </a>
    </div>
  );
}
