'use client';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export default function ExpenseForm() {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'expenses'), {
      amount,
      description,
      category,
      timestamp: Date.now(),
      method: 'manual',
    });
    setAmount(0);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          className="border p-2 text-black"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <input
          className="border p-2 text-black"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select className="border p-2 text-black" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="general">General</option>
        <option value="travel">Travel</option>
        <option value="equipment">Equipment</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2">
        Save
      </button>
    </form>
  );
}
