"use client";
import { useEffect, useState } from "react";
import { uploadNDIACatalogue } from "@/firebase/uploadNDIACatalogue";
import { getNDIACatalogue } from "@/lib/getNDIACatalogue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { firebaseConfig } from "@/firebase/firebase";

export default function AdminPage() {
  const [year, setYear] = useState("2025-2026");
  const [catalogue, setCatalogue] = useState("{\n  \"services\": []\n}");
  const [status, setStatus] = useState("");
  const [services, setServices] = useState<{ code: string; name: string }[]>([]);
  const [messages, setMessages] = useState<{ to: string; body: string; cost: number }[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    getNDIACatalogue(year).then((c) => setServices(c.services));
    getDocs(collection(db, "messages")).then((snap) => {
      let total = 0;
      const rows: { to: string; body: string; cost: number }[] = [];
      snap.forEach((d) => {
        const data = d.data() as { to?: string; body?: string; cost?: number };
        const cost = data.cost ?? 0;
        total += cost;
        rows.push({ to: data.to ?? "", body: data.body ?? "", cost });
      });
      setMessages(rows);
      setTotalCost(total);
    });
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
      <p className="text-sm text-gray-600">Connected to Firebase project: {firebaseConfig.projectId}</p>
      <p className="text-sm text-gray-600">Twilio extension reads from the <code>messages</code> collection.</p>
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
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Outbound Messages</h2>
          <table className="border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2">To</th>
                <th className="px-2">Body</th>
                <th className="px-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 whitespace-nowrap">{m.to}</td>
                  <td className="px-2">{m.body}</td>
                  <td className="px-2 text-right">${m.cost.toFixed(2)}</td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td className="px-2" colSpan={3}>
                    No messages
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="text-sm">Total Cost: ${totalCost.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
