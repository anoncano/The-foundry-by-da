'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  return (
    <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-4 border-b">
      <div className="flex gap-2 flex-wrap">
        <Link href="/">Home</Link>
        {!user && <Link href="/login">Login</Link>}
        {!user && <Link href="/signup">Sign Up</Link>}
        <Link href="/admin">Admin</Link>
        <Link href="/worker/dashboard">Worker</Link>
        <Link href="/participant">Participant</Link>
      </div>
      {user && (
        <button onClick={() => signOut(auth)} className="text-red-500 mt-2 sm:mt-0">
          Sign Out
        </button>
      )}
    </nav>
  );
}
