import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export async function recordAudit(action: string, uid?: string) {
  await addDoc(collection(db, 'auditLogs'), {
    action,
    uid: uid ?? null,
    at: new Date().toISOString(),
  });
}
