"use client";

import React, { useState, useRef, useEffect } from "react";
import { Briefcase, ClipboardList, Clock, FileText, User, X, Download, Eye, Plus } from "lucide-react";

const statCards = [
  { title: "Draft Invoices", value: 2 },
  { title: "Sent Invoices", value: 5 },
  { title: "Active Clients", value: 3 },
];

const quickActions = [
  { title: "New Client", icon: <User size={28} />, modal: "client" },
  { title: "Log Shift", icon: <Clock size={28} />, modal: "shift" },
  { title: "Generate Invoice", icon: <FileText size={28} />, modal: "generate" },
  { title: "Send Invoice", icon: <Download size={28} />, modal: "send" },
];

function InvoiceBuilder({ onBack }) {
  const today = new Date().toISOString().split("T")[0];
  const nextInvoiceNumber = 126;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Create New Invoice</h2>
        <button onClick={onBack} className="text-sm text-indigo-600 hover:underline">← Back</button>
      </div>
      <form className="space-y-4">
        <select className="w-full border px-4 py-2 rounded">
          <option>Select Client</option>
          <option>Jane Doe</option>
          <option>Mark Smith</option>
        </select>
        <input className="w-full border px-4 py-2 rounded" placeholder={`Invoice #${nextInvoiceNumber}`} defaultValue={`Invoice #${nextInvoiceNumber}`} />
        <input className="w-full border px-4 py-2 rounded" type="date" defaultValue={today} />
        <div className="border rounded p-4 space-y-2">
          <h4 className="font-semibold">Service Details</h4>
          <input className="w-full border px-4 py-2 rounded" placeholder="Service Name" />
          <input className="w-full border px-4 py-2 rounded" placeholder="Hours Worked" type="number" />
          <input className="w-full border px-4 py-2 rounded" placeholder="Rate" type="number" />
          <div className="text-right font-bold">Total: $200.00</div>
        </div>
        <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create Invoice</button>
      </form>
    </div>
  );
}

function Modal({ type, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div ref={modalRef} className="bg-white p-6 rounded-xl shadow-2xl relative w-full max-w-md z-10">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4 capitalize">{type === "client" ? "New Client" : type === "shift" ? "Log Shift" : "Modal"}</h2>
        {type === "client" && (
          <form className="space-y-4">
            <input className="w-full border px-4 py-2 rounded" placeholder="Client Name" />
            <input className="w-full border px-4 py-2 rounded" placeholder="Email" type="email" />
            <input className="w-full border px-4 py-2 rounded" placeholder="Phone" />
            <textarea className="w-full border px-4 py-2 rounded" placeholder="Notes"></textarea>
            <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Client</button>
          </form>
        )}
        {type === "shift" && (
          <form className="space-y-4">
            <input className="w-full border px-4 py-2 rounded" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            <input className="w-full border px-4 py-2 rounded" placeholder="Start Time" type="time" />
            <input className="w-full border px-4 py-2 rounded" placeholder="End Time" type="time" />
            <textarea className="w-full border px-4 py-2 rounded" placeholder="Notes"></textarea>
            <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Log Shift</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-bold text-indigo-600">Da Foundry</h1>
        <div className="flex space-x-6 text-sm font-medium text-gray-700">
          <button onClick={() => setActiveTab("overview")} className="hover:text-indigo-600">Overview</button>
          <button onClick={() => setActiveTab("clients")} className="hover:text-indigo-600">Clients</button>
          <button onClick={() => setActiveTab("shifts")} className="hover:text-indigo-600">Shifts</button>
          <button onClick={() => setActiveTab("invoices")} className="hover:text-indigo-600">Invoices</button>
        </div>
        <div className="text-sm">John Worker ▼</div>
      </nav>

      <Modal type={activeModal} onClose={() => setActiveModal("")} />

      <main className="max-w-6xl mx-auto p-6">
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {statCards.map((card, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-md">
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-2xl font-semibold text-indigo-600">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (action.modal === "generate") {
                        setActiveTab("invoices");
                        setShowInvoiceBuilder(true);
                      } else {
                        setActiveModal(action.modal);
                      }
                    }}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-6 px-4 rounded-lg flex flex-col items-center justify-center space-y-2 shadow-md"
                  >
                    {action.icon}
                    <span>{action.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>- Shift logged with Jane – 2h (Community Access)</li>
                <li>- Invoice #125 sent to Plan Manager</li>
                <li>- New client added: Mark Smith</li>
              </ul>
            </div>
          </>
        )}

        {activeTab === "clients" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold">Clients</h2>
            <p className="text-sm text-gray-600">View and manage your client list.</p>
            <div className="border rounded p-4">
              <h3 className="font-semibold">Jane Doe</h3>
              <p className="text-sm text-gray-500">janedoe@email.com - 0400 123 456</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-semibold">Mark Smith</h3>
              <p className="text-sm text-gray-500">marksmith@email.com - 0400 654 321</p>
            </div>
          </div>
        )}

        {activeTab === "invoices" && !showInvoiceBuilder && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold">Invoices</h2>
            <p className="text-sm text-gray-600">Manage invoices grouped by clients.</p>
            <div className="text-right">
              <button onClick={() => setShowInvoiceBuilder(true)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">New Invoice</button>
            </div>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Jane Doe</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Invoice #124 - $300 - Draft</span>
                    <div className="space-x-2">
                      <button className="px-3 py-1 bg-indigo-500 text-white rounded text-sm">Preview</button>
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Send</button>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Mark Smith</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Invoice #123 - $180 - Sent</span>
                    <button className="px-3 py-1 bg-gray-400 text-white rounded text-sm">View</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoices" && showInvoiceBuilder && <InvoiceBuilder onBack={() => setShowInvoiceBuilder(false)} />}

        {!["overview", "invoices", "clients"].includes(activeTab) && (
          <div className="text-gray-500 text-sm p-8 border rounded bg-white">
            <p className="mb-2">This is the <strong>{activeTab}</strong> section. Build your UI here.</p>
            <p>You can add forms, lists, modals, etc. depending on the tab selected.</p>
          </div>
        )}
      </main>
    </div>
  );
}
