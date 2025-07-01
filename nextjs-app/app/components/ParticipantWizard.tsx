'use client';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
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
  emergencyPhone: string;
  setupMethod: 'self' | 'assisted';
  serviceCode: string;
  rate: number;
}

export default function ParticipantWizard() {
  const [step, setStep] = useState(1);
  const stepLabels = [
    'Personal Info',
    'Plan Details',
    'Address & Emergency',
    'Service Selection',
  ];
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
    emergencyPhone: '',
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
    const uid = auth.currentUser?.uid;
    if (uid) {
      await setDoc(doc(db, 'participants', uid), formData);
    } else {
      await addDoc(collection(db, 'participants'), formData);
    }
    setStep(5);
  };

  return (
    <div className="p-4 border rounded flex flex-col gap-4 max-w-xl mx-auto">
      <div className="flex justify-between text-sm text-gray-600">
        {stepLabels.map((label, idx) => (
          <span
            key={label}
            className={idx + 1 === step ? 'font-semibold text-black' : ''}
          >
            {idx + 1}. {label}
          </span>
        ))}
      </div>
      {step === 1 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Personal Info</h2>
          <input className="border p-2 text-black" placeholder="Full Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
          <input className="border p-2 text-black" type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} />
          <input className="border p-2 text-black" placeholder="NDIS Number" value={formData.ndisNumber} onChange={(e) => handleChange('ndisNumber', e.target.value)} />
          <input className="border p-2 text-black" type="email" placeholder="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
          <input className="border p-2 text-black" type="password" placeholder="Password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
          <button className="bg-blue-500 text-white p-2" onClick={() => setStep(2)}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Plan Details</h2>
          <label className="flex gap-2 items-center">
            <span>Plan Start</span>
            <input className="border p-2 text-black" type="date" value={formData.planStart} onChange={(e) => handleChange('planStart', e.target.value)} />
          </label>
          <label className="flex gap-2 items-center">
            <span>Plan End</span>
            <input className="border p-2 text-black" type="date" value={formData.planEnd} onChange={(e) => handleChange('planEnd', e.target.value)} />
          </label>
          <input className="border p-2 text-black" placeholder="Billing Email" value={formData.billingEmail} onChange={(e) => handleChange('billingEmail', e.target.value)} />
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
          {formData.setupMethod === 'assisted' && (
            <p className="text-sm text-gray-600">Invite link: https://example.com/invite/abc123</p>
          )}
          <div className="flex gap-2">
            <button className="bg-gray-200 p-2" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="bg-blue-500 text-white p-2" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Address & Emergency</h2>
          <input className="border p-2 text-black" placeholder="Home Address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
          <input className="border p-2 text-black" placeholder="Emergency Contact Name" value={formData.emergencyContact} onChange={(e) => handleChange('emergencyContact', e.target.value)} />
          <input className="border p-2 text-black" placeholder="Emergency Contact Phone" value={formData.emergencyPhone} onChange={(e) => handleChange('emergencyPhone', e.target.value)} />
          <div className="flex gap-2">
            <button className="bg-gray-200 p-2" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="bg-blue-500 text-white p-2" onClick={() => setStep(4)}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Service Selection</h2>
          <ServiceSelector
            services={catalogue}
            value={formData.serviceCode}
            rate={formData.rate}
            onChange={(code, rate) => {
              setFormData({ ...formData, serviceCode: code, rate });
            }}
          />
          <div className="flex gap-2">
            <button className="bg-gray-200 p-2" onClick={() => setStep(3)}>
              Back
            </button>
            <button className="bg-green-600 text-white p-2" onClick={saveParticipant}>
              Submit
            </button>
          </div>
        </div>
      )}

      {step === 5 && <p className="text-green-700 font-semibold">Signup complete!</p>}
    </div>
  );
}
