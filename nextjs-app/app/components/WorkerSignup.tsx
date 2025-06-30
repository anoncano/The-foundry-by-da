'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';

interface WorkerData {
  abn: string;
  businessName: string;
  gst: boolean;
  phone: string;
  address: string;
}

export default function WorkerSignup() {
  const [data, setData] = useState<WorkerData>({
    abn: '',
    businessName: '',
    gst: false,
    phone: '',
    address: '',
  });
  const router = useRouter();

  const handleChange = (field: keyof WorkerData, value: string | boolean) => {
    setData({ ...data, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await setDoc(doc(db, 'workers', uid), data);
    router.push('/worker/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border p-4 rounded">
      <label className="flex flex-col">
        <span>ABN</span>
        <input
          className="border p-2"
          value={data.abn}
          onChange={(e) => handleChange('abn', e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col">
        <span>Business Name</span>
        <input
          className="border p-2"
          value={data.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
          required
        />
      </label>
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={data.gst}
          onChange={(e) => handleChange('gst', e.target.checked)}
        />
        <span>GST Registered</span>
      </label>
      <label className="flex flex-col">
        <span>Phone</span>
        <input
          className="border p-2"
          value={data.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        <span>Address</span>
        <input
          className="border p-2"
          value={data.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </label>
      <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Complete Signup
      </button>
    </form>
  );
}
