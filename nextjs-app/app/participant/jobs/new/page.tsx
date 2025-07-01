'use client';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export default function NewJobPage() {
  const [form, setForm] = useState({
    title: '',
    recurring: false,
    startDate: '',
    hours: '',
    frequency: 'weekly',
    payment: 'invoice',
    description: '',
    worker: '',
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const submit = async () => {
    await addDoc(collection(db, 'jobs'), form);
    alert('Job posted');
    setForm({
      title: '',
      recurring: false,
      startDate: '',
      hours: '',
      frequency: 'weekly',
      payment: 'invoice',
      description: '',
      worker: '',
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Post a Job</h1>
      <label className="text-sm block">Job Title
        <input className="border p-2 rounded w-full" value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.recurring} onChange={(e) => handleChange('recurring', e.target.checked)} />
        Recurring Job
      </label>
      <label className="text-sm block">Start Date
        <input type="date" className="border p-2 rounded w-full" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
      </label>
      <label className="text-sm block">Time Estimate (hours)
        <input className="border p-2 rounded w-full" value={form.hours} onChange={(e) => handleChange('hours', e.target.value)} />
      </label>
      <label className="text-sm block">Frequency
        <select className="border p-2 rounded w-full" value={form.frequency} onChange={(e) => handleChange('frequency', e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </label>
      <label className="text-sm block">Payment Method
        <select className="border p-2 rounded w-full" value={form.payment} onChange={(e) => handleChange('payment', e.target.value)}>
          <option value="cash">Cash</option>
          <option value="invoice">Invoice</option>
        </select>
      </label>
      <label className="text-sm block">Description / Requirements
        <textarea className="border p-2 rounded w-full" rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
      </label>
      <label className="text-sm block">Invite Worker (email or phone)
        <input className="border p-2 rounded w-full" value={form.worker} onChange={(e) => handleChange('worker', e.target.value)} />
      </label>
      {form.recurring && (
        <p className="text-sm text-gray-600">An agreement draft will be generated upon submission.</p>
      )}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white p-2 rounded" onClick={submit}>Submit Job</button>
      </div>
    </div>
  );
}
