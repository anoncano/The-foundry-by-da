"use client";
import { useEffect, useState } from "react";
import { uploadNDIACatalogue } from "@/firebase/uploadNDIACatalogue";
import { getNDIACatalogue } from "@/lib/getNDIACatalogue";

export default function AdminPage() {
  const [year, setYear] = useState("2025-2026");
  const [catalogue, setCatalogue] = useState("{\n  \"services\": []\n}");
  const [status, setStatus] = useState("");
  const [services, setServices] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    getNDIACatalogue(year).then((c) => setServices(c.services));
  }, [year]);

  const handleUpload = async () => {
    try {
      const data = JSON.parse(catalogue);
      await uploadNDIACatalogue(data, year);
      setStatus("Catalogue uploaded");
    } catch {
      setStatus("Invalid JSON");
    }
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Upload Support Catalogue</h2>
          <input
            className="border p-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
          />
          <textarea
            className="border p-2 h-40"
            value={catalogue}
            onChange={(e) => setCatalogue(e.target.value)}
          />
          <button onClick={handleUpload} className="bg-blue-500 text-white p-2">
            Upload Catalogue
          </button>
          {status && <p className="text-green-600">{status}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Current Services ({year})</h2>
          <ul className="border p-2 h-40 overflow-auto text-sm space-y-1">
            {services.map((s) => (
              <li key={s.code} className="flex justify-between">
                <span>{s.name}</span>
                <span className="text-gray-500">{s.code}</span>
              </li>
            ))}
            {services.length === 0 && <li>No services loaded</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
