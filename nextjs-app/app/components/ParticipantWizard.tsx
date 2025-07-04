'use client';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import ServiceSelector from './ServiceSelector';
import { getNDIACatalogue } from '@/lib/getNDIACatalogue';
import { recordAudit } from '@/lib/recordAudit';

export const participantSteps = [
  'Personal Info',
  'Plan Details',
  'Address & Emergency',
  'Service Selection',
];

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
  selfManaged: boolean;
  serviceCode: string;
  rate: number;
}

export default function ParticipantWizard({
  onStepChange,
  onComplete,
}: {
  onStepChange?: (n: number) => void;
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState('');
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
    selfManaged: false,
    serviceCode: '',
    rate: 0,
  });

  useEffect(() => {
    getNDIACatalogue('2025-2026').then((c) => setCatalogue(c.services));
  }, []);

  useEffect(() => {
    onStepChange?.(step);
    if (step === participantSteps.length + 1) {
      onComplete?.();
    }
  }, [step, onStepChange, onComplete]);

  const handleChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const createAccount = async () => {
    const cred = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    setUid(cred.user.uid);
    await setDoc(doc(db, 'users', cred.user.uid), {
      role: 'participant',
      email: formData.email,
    });
    await recordAudit('created participant account', cred.user.uid);
    setStep(2);
  };

  const saveParticipant = async () => {
    const id = uid || auth.currentUser?.uid;
    const data = { ...formData };
    delete (data as Partial<FormData>).password;
    if (id) {
      await setDoc(doc(db, 'participants', id), data);
    } else {
      await addDoc(collection(db, 'participants'), data);
    }
    await recordAudit('participant signed up', id ?? 'anon');
    setStep(participantSteps.length + 1);
  };

  return (
    <div className="p-4 border rounded flex flex-col gap-4 bg-white dark:bg-gray-800 max-w-xl mx-auto">
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Personal Info</h2>
          <label className="text-sm">Full Name
            <input className="border p-2 rounded w-full" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
          </label>
          <label className="text-sm">Date of Birth
            <input className="border p-2 rounded w-full" type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} />
          </label>
          <label className="text-sm">NDIS Number
            <input className="border p-2 rounded w-full" value={formData.ndisNumber} onChange={(e) => handleChange('ndisNumber', e.target.value)} />
          </label>
          <label className="text-sm">Email
            <input className="border p-2 rounded w-full" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
          </label>
          <label className="text-sm">Password
            <input className="border p-2 rounded w-full" type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
          </label>
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white p-2 rounded" onClick={createAccount}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Plan Details</h2>
          <label className="text-sm">Plan Start
            <input className="border p-2 rounded w-full" type="date" value={formData.planStart} onChange={(e) => handleChange('planStart', e.target.value)} />
          </label>
          <label className="text-sm">Plan End
            <input className="border p-2 rounded w-full" type="date" value={formData.planEnd} onChange={(e) => handleChange('planEnd', e.target.value)} />
          </label>
          <label className="text-sm">Billing Email
            <input className="border p-2 rounded w-full" type="email" value={formData.billingEmail} onChange={(e) => handleChange('billingEmail', e.target.value)} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.selfManaged} onChange={(e) => handleChange('selfManaged', e.target.checked)} />
            Self Managed Plan
          </label>
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
            <button className="bg-gray-200 p-2 rounded" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="bg-blue-600 text-white p-2 rounded" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Address & Emergency</h2>
          <label className="text-sm">Home Address
            <input className="border p-2 rounded w-full" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
          </label>
          <label className="text-sm">Emergency Contact Name
            <input className="border p-2 rounded w-full" value={formData.emergencyContact} onChange={(e) => handleChange('emergencyContact', e.target.value)} />
          </label>
          <label className="text-sm">Emergency Contact Phone
            <input className="border p-2 rounded w-full" value={formData.emergencyPhone} onChange={(e) => handleChange('emergencyPhone', e.target.value)} />
          </label>
          <div className="flex gap-2 justify-between">
            <button className="bg-gray-200 p-2 rounded" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="bg-blue-600 text-white p-2 rounded" onClick={() => setStep(4)}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Service Selection</h2>
          <ServiceSelector
            services={catalogue}
            value={formData.serviceCode}
            rate={formData.rate}
            onChange={(code, rate) => {
              setFormData({ ...formData, serviceCode: code, rate });
            }}
          />
          <div className="flex gap-2 justify-between">
            <button className="bg-gray-200 p-2 rounded" onClick={() => setStep(3)}>
              Back
            </button>
            <button className="bg-green-600 text-white p-2 rounded" onClick={saveParticipant}>
              Submit
            </button>
          </div>
        </div>
      )}

      {step === participantSteps.length + 1 && (
        <p className="text-green-700 font-semibold">Signup complete!</p>
      )}
    </div>
  );
}
