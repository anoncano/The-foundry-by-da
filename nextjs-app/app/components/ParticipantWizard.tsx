'use client';
import { useEffect, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import ServiceSelector from './ServiceSelector';
import { getNDIACatalogue } from '@/lib/getNDIACatalogue';

interface FormData {
  name: string;
  dob: string;
  email: string;
  password: string;
  ndisNumber: string;
  planStart: string;
  planEnd: string;
  billingEmail: string;
  address: string;
  emergencyContact: string;
  setupMethod: 'self' | 'assisted';
  serviceCode: string;
  rate: number;
}

export default function ParticipantWizard() {
  const [step, setStep] = useState(1);
  const [catalogue, setCatalogue] = useState<{ code: string; name: string; tiers: { name: string; maxRate: number }[] }[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dob: '',
    email: '',
    password: '',
    ndisNumber: '',
    planStart: '',
    planEnd: '',
    billingEmail: '',
    address: '',
    emergencyContact: '',
    setupMethod: 'self',
    serviceCode: '',
    rate: 0,
  });

  useEffect(() => {
    getNDIACatalogue('2025-2026').then((c) => setCatalogue(c.services));
  }, []);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const saveParticipant = async () => {
    await addDoc(collection(db, 'participants'), formData);
    setStep(4);
  };

  return (
    <div className="p-4 border rounded flex flex-col gap-4 max-w-xl mx-auto">
      {step === 1 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Account Details</h2>
          <input className="border p-2" placeholder="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
          <input className="border p-2" type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} />
          <input className="border p-2" type="email" placeholder="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
          <input className="border p-2" type="password" placeholder="Password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
          <button className="bg-blue-500 text-white p-2" onClick={() => setStep(2)}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Plan Details</h2>
          <input className="border p-2" placeholder="NDIS Number" value={formData.ndisNumber} onChange={(e) => handleChange('ndisNumber', e.target.value)} />
          <input className="border p-2" placeholder="Billing Email" value={formData.billingEmail} onChange={(e) => handleChange('billingEmail', e.target.value)} />
          <label className="flex gap-2 items-center">
            <span>Plan Start</span>
            <input className="border p-2" type="date" value={formData.planStart} onChange={(e) => handleChange('planStart', e.target.value)} />
          </label>
          <label className="flex gap-2 items-center">
            <span>Plan End</span>
            <input className="border p-2" type="date" value={formData.planEnd} onChange={(e) => handleChange('planEnd', e.target.value)} />
          </label>
          <button className="bg-blue-500 text-white p-2" onClick={() => setStep(3)}>
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Contact & Services</h2>
          <input className="border p-2" placeholder="Address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
          <input className="border p-2" placeholder="Emergency Contact" value={formData.emergencyContact} onChange={(e) => handleChange('emergencyContact', e.target.value)} />
          <div className="flex gap-2">
            <label className="flex items-center gap-1">
              <input type="radio" name="setup" value="self" checked={formData.setupMethod === 'self'} onChange={() => handleChange('setupMethod', 'self')} />
              Self
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="setup" value="assisted" checked={formData.setupMethod === 'assisted'} onChange={() => handleChange('setupMethod', 'assisted')} />
              Assisted
            </label>
          </div>
          <ServiceSelector services={catalogue} />
          <button className="bg-green-600 text-white p-2" onClick={saveParticipant}>
            Submit
          </button>
        </div>
      )}

      {step === 4 && <p className="text-green-700 font-semibold">Signup complete!</p>}
    </div>
  );
}
