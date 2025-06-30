"use client";
import { useState } from "react";
import { uploadNDIACatalogue } from "@/firebase/uploadNDIACatalogue";

export default function AdminPage() {
  const [year, setYear] = useState("2025-2026");
  const [catalogue, setCatalogue] = useState("{\n  \"services\": []\n}");
  const [status, setStatus] = useState("");

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
    <div className="p-8 flex flex-col gap-4 max-w-xl">
      <h1 className="text-2xl font-bold">Admin Page</h1>
      <p>This demo lets you upload a support catalogue document.</p>
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
      {status && <p>{status}</p>}
    </div>
  );
}
