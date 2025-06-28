"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function WorkerSignupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    tradingName: "",
    abn: "",
    gstRegistered: "No",
    address: "",
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("✅ Worker signed up:", form);
    // TODO: Save to Firebase/auth
    router.push("/worker-dashboard");
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Worker Signup</h1>

      {step === 1 && (
        <>
          <label>Full Name</label>
          <input name="fullName" onChange={handleChange} value={form.fullName} className="w-full mb-4 p-2 border rounded" />

          <label>Email</label>
          <input name="email" type="email" onChange={handleChange} value={form.email} className="w-full mb-4 p-2 border rounded" />

          <label>Phone</label>
          <input name="phone" onChange={handleChange} value={form.phone} className="w-full mb-4 p-2 border rounded" />

          <button onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <label>Trading Name (optional)</label>
          <input name="tradingName" onChange={handleChange} value={form.tradingName} className="w-full mb-4 p-2 border rounded" />

          <label>ABN</label>
          <input name="abn" onChange={handleChange} value={form.abn} className="w-full mb-4 p-2 border rounded" />

          <label>Registered for GST?</label>
          <select name="gstRegistered" value={form.gstRegistered} onChange={handleChange} className="w-full mb-4 p-2 border rounded">
            <option>No</option>
            <option>Yes</option>
          </select>

          <label>Business Address (optional)</label>
          <input name="address" onChange={handleChange} value={form.address} className="w-full mb-4 p-2 border rounded" />

          <div className="flex justify-between">
            <button onClick={prev} className="px-4 py-2 border rounded">Back</button>
            <button onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded">Next</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Confirm Your Details</h2>
          <pre className="text-sm bg-gray-100 p-4 rounded border mb-4">{JSON.stringify(form, null, 2)}</pre>
          <div className="flex justify-between">
            <button onClick={prev} className="px-4 py-2 border rounded">Back</button>
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
          </div>
        </>
      )}
    </div>
  );
}
