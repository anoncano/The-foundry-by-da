'use client';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';

export const workerSteps = ['Account Setup', 'ABN Details', 'Dashboard Prep'];

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  operatingName: string;
  abn: string;
  gst: boolean;
  bsb: string;
  account: string;
  address: string;
  clientManager: boolean;
  automateInvoices: boolean;
}

export default function WorkerWizard({
  onStepChange,
  onComplete,
}: {
  onStepChange?: (n: number) => void;
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState('');
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    operatingName: '',
    abn: '',
    gst: false,
    bsb: '',
    account: '',
    address: '',
    clientManager: true,
    automateInvoices: true,
  });
  const router = useRouter();

  useEffect(() => {
    onStepChange?.(step);
    if (step === workerSteps.length + 1) {
      onComplete?.();
    }
  }, [step, onStepChange, onComplete]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const createAccount = async () => {
    const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
    setUid(cred.user.uid);
    await setDoc(doc(db, 'users', cred.user.uid), {
      role: 'worker',
      email: form.email,
    });
    setStep(2);
  };

  const saveWorker = async () => {
    const id = uid || auth.currentUser?.uid;
    if (!id) return;
    await setDoc(doc(db, 'workers', id), {
      name: form.name,
      phone: form.phone,
      operatingName: form.operatingName,
      abn: form.abn,
      gst: form.gst,
      bsb: form.bsb,
      account: form.account,
      address: form.address,
      clientManager: form.clientManager,
      automateInvoices: form.automateInvoices,
    });
    setStep(workerSteps.length + 1);
    router.push('/worker/dashboard');
  };

  return (
    <div className="p-4 border rounded flex flex-col gap-4 bg-white max-w-xl mx-auto">
      {step === 1 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Account Setup</h2>
          <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          <input className="border p-2 rounded" type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          <input className="border p-2 rounded" placeholder="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          <input className="border p-2 rounded" type="password" placeholder="Password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
          <button className="bg-blue-600 text-white p-2 rounded" onClick={createAccount}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">ABN Details</h2>
          <input className="border p-2 rounded" placeholder="Operating Name" value={form.operatingName} onChange={(e) => handleChange('operatingName', e.target.value)} />
          <input className="border p-2 rounded" placeholder="ABN" value={form.abn} onChange={(e) => handleChange('abn', e.target.value)} />
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={form.gst} onChange={(e) => handleChange('gst', e.target.checked)} />
            <span>GST Registered</span>
          </label>
          <input className="border p-2 rounded" placeholder="BSB" value={form.bsb} onChange={(e) => handleChange('bsb', e.target.value)} />
          <input className="border p-2 rounded" placeholder="Account Number" value={form.account} onChange={(e) => handleChange('account', e.target.value)} />
          <input className="border p-2 rounded" placeholder="Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
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
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Dashboard Prep</h2>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.clientManager} onChange={(e) => handleChange('clientManager', e.target.checked)} />
            <span>Use Client Manager</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.automateInvoices} onChange={(e) => handleChange('automateInvoices', e.target.checked)} />
            <span>Automate Invoices</span>
          </label>
          <div className="flex gap-2">
            <button className="bg-gray-200 p-2 rounded" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="bg-green-600 text-white p-2 rounded" onClick={saveWorker}>
              Finish
            </button>
          </div>
        </div>
      )}

      {step === workerSteps.length + 1 && <p className="text-green-700 font-semibold">Signup complete!</p>}
    </div>
  );
}
