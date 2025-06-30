import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export async function getUserRole(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data() as { role?: string };
  return data.role ?? null;
}
