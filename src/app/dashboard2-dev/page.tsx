"use client";
import React, { useState } from "react";

interface WorkerInfo {
  firstName: string;
  lastName: string;
  businessName: string;
  invoiceStart: string;
  bankName: string;
  bsb: string;
  accountNumber: string;
  email: string;
  address: string;
}

export default function WorkerSetupWizard() {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<WorkerInfo>({
    firstName: "",
    lastName: "",
    businessName: "",
    invoiceStart: "",
    bankName: "",
    bsb: "",
    accountNumber: "",
    email: "",
    address: "",
  });
  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };
  if (step === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow text-center space-y-4">
          <h2 className="text-2xl font-bold">Wizard Complete!</h2>
          <p className="text-gray-600">Proceed to your dashboard below.</p>
          <button onClick={() => setStep(1)} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Restart
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Worker Setup Wizard</h1>
        {step === 1 && (
          <>
            <label className="block mb-2 text-sm">First Name</label>
            <input name="firstName" className="w-full p-2 border rounded mb-4" value={info.firstName} onChange={handleChange} />
            <label className="block mb-2 text-sm">Last Name</label>
            <input name="lastName" className="w-full p-2 border rounded mb-4" value={info.lastName} onChange={handleChange} />
            <label className="block mb-2 text-sm">Business Name (optional)</label>
            <input name="businessName" className="w-full p-2 border rounded mb-4" value={info.businessName} onChange={handleChange} />
            <div className="text-right">
              <button onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded">Next</button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <label className="block mb-2 text-sm">Invoice Starting Number</label>
            <input name="invoiceStart" className="w-full p-2 border rounded mb-4" value={info.invoiceStart} onChange={handleChange} />
            <label className="block mb-2 text-sm">Bank Name</label>
            <input name="bankName" className="w-full p-2 border rounded mb-4" value={info.bankName} onChange={handleChange} />
            <label className="block mb-2 text-sm">BSB</label>
            <input name="bsb" className="w-full p-2 border rounded mb-4" value={info.bsb} onChange={handleChange} />
            <label className="block mb-2 text-sm">Account Number</label>
            <input name="accountNumber" className="w-full p-2 border rounded mb-4" value={info.accountNumber} onChange={handleChange} />
            <div className="flex justify-between">
              <button onClick={prev} className="px-4 py-2 border rounded">Back</button>
              <button onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded">Next</button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <label className="block mb-2 text-sm">Email</label>
            <input name="email" type="email" className="w-full p-2 border rounded mb-4" value={info.email} onChange={handleChange} />
            <label className="block mb-2 text-sm">Address</label>
            <input name="address" className="w-full p-2 border rounded mb-4" value={info.address} onChange={handleChange} />
            <div className="flex justify-between">
              <button onClick={prev} className="px-4 py-2 border rounded">Back</button>
              <button onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded">Next</button>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Confirm Details</h2>
            <pre className="bg-gray-100 p-2 rounded text-xs mb-4">{JSON.stringify(info, null, 2)}</pre>
            <div className="flex justify-between">
              <button onClick={prev} className="px-4 py-2 border rounded">Back</button>
              <button onClick={next} className="bg-green-600 text-white px-4 py-2 rounded">Finish</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
