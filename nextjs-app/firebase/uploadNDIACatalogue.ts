import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export async function uploadNDIACatalogue(catalogue: any, year: string) {
  const ref = doc(collection(db, 'supportCatalog'), year);
  await setDoc(ref, catalogue);
}
