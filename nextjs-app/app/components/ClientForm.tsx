'use client';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export default function ClientForm() {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'clients'), { name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        className="border p-2"
        placeholder="Client Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Save</button>
    </form>
  );
}
