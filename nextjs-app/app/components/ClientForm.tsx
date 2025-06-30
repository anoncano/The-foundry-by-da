'use client';
import { useState } from 'react';

export default function ClientForm() {
  const [name, setName] = useState('');
  return (
    <form className="flex flex-col gap-2">
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
