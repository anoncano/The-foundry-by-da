'use client';
import { useState } from 'react';
import ServiceSelector from '@/app/components/ServiceSelector';

export default function ParticipantSignup() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Participant Signup</h1>
      <form className="flex flex-col gap-2">
        <input className="border p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2" type="date" placeholder="DOB" value={dob} onChange={e => setDob(e.target.value)} />
        <ServiceSelector services={[]} />
        <button className="bg-blue-500 text-white p-2" type="submit">Register</button>
      </form>
    </div>
  );
}
