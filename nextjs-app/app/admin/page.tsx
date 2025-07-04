"use client";
import { useEffect, useState } from "react";
import { uploadNDIACatalogue } from "@/firebase/uploadNDIACatalogue";
import { getNDIACatalogue } from "@/lib/getNDIACatalogue";
import { parseNDIACSV } from "@/lib/parseNDIACSV";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { recordAudit } from "@/lib/recordAudit";
import { firebaseConfig } from "@/firebase/firebase";

function AuditLogList() {
  const [logs, setLogs] = useState<{ id: string; action: string; at: string }[]>([]);
  useEffect(() => {
    getDocs(query(collection(db, 'auditLogs'))).then((snap) => {
      const arr: { id: string; action: string; at: string }[] = [];
      snap.forEach((d) => {
        const data = d.data() as { action?: string; at?: string };
        arr.push({ id: d.id, action: data.action ?? '', at: data.at ?? '' });
      });
      setLogs(arr);
    });
  }, []);
  return (
    <ul className="border p-2 h-32 overflow-auto text-sm space-y-1">
      {logs.map((l) => (
        <li key={l.id} className="flex justify-between">
          <span>{l.action}</span>
          <span className="text-gray-500">{l.at}</span>
        </li>
      ))}
      {logs.length === 0 && <li>No logs</li>}
    </ul>
  );
}

export default function AdminPage() {
  const [year, setYear] = useState("2025-2026");
  const [catalogue, setCatalogue] = useState("");
  const [status, setStatus] = useState("");
  const [services, setServices] = useState<{ code: string; name: string }[]>([]);
  const [userTotals, setUserTotals] = useState<{ uid: string; total: number }[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [pricing, setPricing] = useState({ inboundSms: 0, outboundSms: 0, inboundMms: 0, outboundMms: 0 });
  const [users, setUsers] = useState<{ id: string; role: string }[]>([]);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('participant');
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  useEffect(() => {
    getNDIACatalogue(year).then((c) => setServices(c.services));
  }, [year]);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'smsPricing'))
      .then((snap) => {
        if (snap.exists()) {
          setPricing({
            inboundSms: snap.data().inboundSms ?? 0,
            outboundSms: snap.data().outboundSms ?? 0,
            inboundMms: snap.data().inboundMms ?? 0,
            outboundMms: snap.data().outboundMms ?? 0,
          });
        }
      })
      .catch(() => setStatus('Failed to load pricing'));
  }, []);

  useEffect(() => {
    const start = Timestamp.fromDate(new Date(startDate));
    const end = Timestamp.fromDate(new Date(endDate));
    const q = query(
      collection(db, 'messages'),
      where('createdAt', '>=', start),
      where('createdAt', '<=', end)
    );
    getDocs(q)
      .then((snap) => {
        let total = 0;
        const map = new Map<string, number>();
        snap.forEach((d) => {
          const data = d.data() as { uid?: string; cost?: number };
          const uid = data.uid ?? 'unknown';
          const cost = data.cost ?? 0;
          total += cost;
          map.set(uid, (map.get(uid) ?? 0) + cost);
        });
        setTotalCost(total);
        setUserTotals(Array.from(map.entries()).map(([uid, total]) => ({ uid, total })));
      })
      .catch(() => setStatus('Failed to load usage'));
  }, [startDate, endDate]);

  useEffect(() => {
      getDocs(collection(db, 'users')).then((snap) => {
        const list: { id: string; role: string }[] = [];
        snap.forEach((d) => {
          const data = d.data() as { role?: string };
          list.push({ id: d.id, role: data.role ?? '' });
        });
        setUsers(list);
      });
  }, []);

  const handleUpload = async () => {
    try {
      const data = JSON.parse(catalogue);
      await uploadNDIACatalogue(data, year);
      setStatus("Catalogue uploaded");
      await recordAudit('uploaded catalogue');
    } catch {
      setStatus("Invalid JSON");
    }
  };

  const handleCSV = async (file: File) => {
    const text = await file.text();
    try {
      const data = parseNDIACSV(text);
      setCatalogue(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus(msg);
    }
  };

  const assignRole = async () => {
    if (!userId) return;
    await setDoc(doc(db, 'users', userId), { role }, { merge: true });
    setStatus('Role updated');
    await recordAudit(`assigned role ${role} to ${userId}`);
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
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCSV(file);
            }}
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
          <h2 className="font-semibold">SMS Pricing</h2>
          <label className="text-sm">Inbound SMS ($)
            <input
              className="border p-1 w-full"
              type="number"
              step="0.01"
              value={pricing.inboundSms}
              onChange={(e) => setPricing({ ...pricing, inboundSms: parseFloat(e.target.value) })}
            />
          </label>
          <label className="text-sm">Outbound SMS ($)
            <input
              className="border p-1 w-full"
              type="number"
              step="0.01"
              value={pricing.outboundSms}
              onChange={(e) => setPricing({ ...pricing, outboundSms: parseFloat(e.target.value) })}
            />
          </label>
          <label className="text-sm">Inbound MMS ($)
            <input
              className="border p-1 w-full"
              type="number"
              step="0.01"
              value={pricing.inboundMms}
              onChange={(e) => setPricing({ ...pricing, inboundMms: parseFloat(e.target.value) })}
            />
          </label>
          <label className="text-sm">Outbound MMS ($)
            <input
              className="border p-1 w-full"
              type="number"
              step="0.01"
              value={pricing.outboundMms}
              onChange={(e) => setPricing({ ...pricing, outboundMms: parseFloat(e.target.value) })}
            />
          </label>
          <button
            onClick={async () => {
              await setDoc(doc(db, 'settings', 'smsPricing'), pricing);
              await recordAudit('updated sms pricing');
            }}
            className="bg-blue-500 text-white p-2"
          >
            Save Pricing
          </button>
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
          <h2 className="font-semibold">Usage ({startDate} - {endDate})</h2>
          <div className="flex gap-2 text-sm">
            <input type="date" className="border p-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" className="border p-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <table className="border text-sm mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2">User</th>
                <th className="px-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {userTotals.map((u) => (
                <tr key={u.uid} className="border-t">
                  <td className="px-2">{u.uid}</td>
                  <td className="px-2 text-right">${u.total.toFixed(2)}</td>
                </tr>
              ))}
              {userTotals.length === 0 && (
                <tr>
                  <td className="px-2" colSpan={2}>No usage</td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="text-sm">Period Total: ${totalCost.toFixed(2)}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Manage Users</h2>
          <label className="text-sm">User ID
            <input className="border p-1 w-full" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </label>
          <label className="text-sm">Role
            <select className="border p-1 w-full" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="participant">Participant</option>
              <option value="worker">Worker</option>
              <option value="chatAdmin">Chat Admin</option>
              <option value="subAdmin">Sub Admin</option>
            </select>
          </label>
          <button className="bg-blue-500 text-white p-2" onClick={assignRole}>Save Role</button>
          <ul className="text-sm border p-2 h-32 overflow-auto mt-2">
            {users.map((u) => (
              <li key={u.id} className="flex justify-between"><span>{u.id}</span><span>{u.role}</span></li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Audit Logs</h2>
          <AuditLogList />
        </div>
      </div>
    </div>
  );
}
