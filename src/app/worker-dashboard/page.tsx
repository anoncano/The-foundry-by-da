"use client";

import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import {
  Clock,
  FileText,
  User,
  X,
  Download,
  ClipboardList,
} from "lucide-react";

const statCards = [
  { title: "Draft Invoices", key: "invoices" },
  { title: "Active Clients", key: "clients" },
  { title: "Services", key: "services" },
];

const quickActions = [
  { title: "New Client", icon: <User size={28} />, modal: "client" },
  { title: "Log Shift", icon: <Clock size={28} />, modal: "shift" },
  { title: "New Service", icon: <ClipboardList size={28} />, modal: "service" },
  {
    title: "Generate Invoice",
    icon: <FileText size={28} />,
    modal: "generate",
  },
  { title: "Send Invoice", icon: <Download size={28} />, modal: "send" },
];

interface Service {
  name: string;
  rate: string;
  unit: string;
  type: "service" | "product";
}

interface Client {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  services: string[];
}

interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
}

interface Invoice {
  id: number;
  client: string;
  date: string;
  items: InvoiceItem[];
  status: "draft" | "sent";
}

const workerInfo = {
  name: "John Worker",
  tradingName: "John Worker Services",
  abn: "123456789",
  address: "123 Worker St, Exampleville",
  bankName: "ABC Bank",
  bsb: "123-456",
  accountNumber: "12345678",
};

function InvoiceBuilder({
  onBack,
  services,
  clients,
  onSave,
  invoice,
}: {
  onBack: () => void;
  services: Service[];
  clients: Client[];
  onSave: (inv: Invoice) => void;
  invoice?: Invoice;
}) {
  const today = new Date().toISOString().split("T")[0];
  const nextInvoiceNumber = invoice?.id || 126;

  const [client, setClient] = useState(invoice?.client || "");
  const [invoiceNumber, setInvoiceNumber] = useState<number>(nextInvoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(invoice?.date || today);
  const [title, setTitle] = useState("Invoice");
  const [note, setNote] = useState("");

  const [items, setItems] = useState(
    invoice
      ? invoice.items.map((it) => ({
          service: it.description,
          custom: "",
          qty: String(it.qty),
          rate: String(it.rate),
          unit: "",
        }))
      : [{ service: "", custom: "", qty: "", rate: "", unit: "" }],
  );
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title || "Invoice", 105, 20, { align: "center" });
    doc.setFontSize(12);

    doc.text(workerInfo.tradingName || workerInfo.name, 10, 30);
    doc.text(`ABN: ${workerInfo.abn}`, 10, 36);
    doc.text(workerInfo.address, 10, 42);

    doc.text(`Client: ${client}`, 140, 30);
    doc.text(`Date: ${invoiceDate}`, 140, 36);
    doc.text(`Invoice #: ${invoiceNumber}`, 140, 42);

    doc.line(10, 48, 200, 48);
    doc.text("Description", 10, 56);
    doc.text("Qty", 120, 56);
    doc.text("Rate", 150, 56);
    doc.text("Amount", 190, 56, { align: "right" });
    doc.line(10, 58, 200, 58);

    let total = 0;
    let y = 66;
    items.forEach((item) => {
      const desc = item.service === "custom" ? item.custom : item.service;
      const amount =
        parseFloat(item.qty || "0") * parseFloat(item.rate || "0");
      total += amount;
      doc.text(desc || "-", 10, y);
      doc.text(item.qty || "-", 120, y);
      doc.text(item.rate ? `$${item.rate}` : "-", 150, y);
      doc.text(`$${amount.toFixed(2)}`, 190, y, { align: "right" });
      y += 8;
    });

    doc.line(10, y - 4, 200, y - 4);
    doc.text(`Total: $${total.toFixed(2)}`, 190, y + 4, { align: "right" });

    doc.text("Please pay to:", 10, y + 16);
    doc.text(workerInfo.bankName, 10, y + 22);
    doc.text(
      `BSB: ${workerInfo.bsb}  Account: ${workerInfo.accountNumber}`,
      10,
      y + 28,
    );
    if (note) {
      doc.text(note, 10, y + 40);
    }

    setPdfUrl(doc.output("datauristring"));
  }, [client, invoiceNumber, invoiceDate, items, title, note]);

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Create New Invoice</h2>
        <button
          onClick={onBack}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back
        </button>
      </div>
      <div className="space-y-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const invoiceData: Invoice = {
              id: invoiceNumber,
              client,
              date: invoiceDate,
              items: items.map((it) => ({
                description: it.service === "custom" ? it.custom : it.service,
                qty: Number(it.qty || 0),
                rate: Number(it.rate || 0),
              })),
              status: "draft",
            };
            onSave(invoiceData);
            onBack();
          }}
        >
          <select
            className="w-full border px-4 py-2 rounded"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="Invoice Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder={`Invoice #${nextInvoiceNumber}`}
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(Number(e.target.value))}
          />
          <input
            className="w-full border px-4 py-2 rounded"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
          <div className="border rounded p-4 space-y-4">
            <h4 className="font-semibold">Service Details</h4>
            {items.map((item, idx) => (
              <div key={idx} className="grid md:grid-cols-4 gap-2 items-end">
                <div className="md:col-span-2">
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={item.service}
                    onChange={(e) => {
                      const value = e.target.value;
                      setItems((prev) =>
                        prev.map((it, i) => {
                          if (i !== idx) return it;
                          if (value === "custom") {
                            return { ...it, service: value, rate: "", unit: "" };
                          }
                          const svc = services.find((s) => s.name === value);
                          return {
                            ...it,
                            service: value,
                            rate: svc ? svc.rate : "",
                            unit: svc ? svc.unit : "",
                          };
                        }),
                      );
                    }}
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                  {item.service === "custom" && (
                    <input
                      className="w-full border px-2 py-1 rounded mt-2"
                      placeholder="Custom Service"
                      value={item.custom}
                      onChange={(e) => {
                        const value = e.target.value;
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === idx ? { ...it, custom: value } : it,
                          ),
                        );
                      }}
                    />
                  )}
                </div>
                <input
                  className="border px-2 py-1 rounded"
                  placeholder={item.unit || "Qty"}
                  type="number"
                  value={item.qty}
                  onChange={(e) => {
                    const value = e.target.value;
                    setItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, qty: value } : it,
                      ),
                    );
                  }}
                />
                <input
                  className="border px-2 py-1 rounded"
                  placeholder="Rate"
                  type="number"
                  value={item.rate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, rate: value } : it,
                      ),
                    );
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setItems((prev) => [
                  ...prev,
                  { service: "", custom: "", qty: "", rate: "", unit: "" },
                ])
              }
              className="text-indigo-600 text-sm mt-2"
            >
              + Add Service
            </button>
          </div>
          <textarea
            className="w-full border px-2 py-1 rounded"
            placeholder="Notes"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <div className="text-right font-bold">
            Total:{" "}
            {items
              .reduce(
                (sum, it) =>
                  sum + parseFloat(it.qty || "0") * parseFloat(it.rate || "0"),
                0,
              )
              .toFixed(2)}
          </div>
          <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Save Draft
          </button>
        </form>
        <div className="w-full h-96 border">
          {pdfUrl && (
            <iframe
              title="Invoice Preview"
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Modal({
  type,
  onClose,
  onAddClient,
  onAddService,
  clients,
  services,
}: {
  type: string;
  onClose: () => void;
  onAddClient: (client: Client) => void;
  onAddService: (service: Service) => void;
  clients: Client[];
  services: Service[];
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        event.target instanceof Node &&
        !modalRef.current.contains(event.target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-2xl relative w-full max-w-md z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {type === "client"
            ? "New Client"
            : type === "shift"
              ? "Log Shift"
              : type === "service"
                ? "New Service"
                : "Modal"}
        </h2>
        {type === "client" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const selected = formData.getAll("svc") as string[];
              onAddClient({
                name: String(formData.get("name")),
                email: String(formData.get("email")),
                phone: String(formData.get("phone")),
                notes: String(formData.get("notes")),
                services: selected,
              });
              onClose();
            }}
          >
            <input name="name" className="w-full border px-4 py-2 rounded" placeholder="Client Name" />
            <input name="email" className="w-full border px-4 py-2 rounded" placeholder="Email" type="email" />
            <input name="phone" className="w-full border px-4 py-2 rounded" placeholder="Phone" />
            <textarea name="notes" className="w-full border px-4 py-2 rounded" placeholder="Notes"></textarea>
            <div>
              <p className="text-sm font-medium">Services</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {services.map((s) => (
                  <label key={s.name} className="text-sm">
                    <input type="checkbox" name="svc" value={s.name} className="mr-1" />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Client</button>
          </form>
        )}
        {type === "shift" && (
          <form className="space-y-4">
            <select
              className="w-full border px-4 py-2 rounded"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
            <select className="w-full border px-4 py-2 rounded">
              <option value="">Select Service</option>
              {(selectedClient
                ? services.filter((s) =>
                    clients
                      .find((c) => c.name === selectedClient)
                      ?.services.includes(s.name),
                  )
                : services
              ).map((s) => (
                <option key={s.name}>{s.name}</option>
              ))}
            </select>
            <input
              className="w-full border px-4 py-2 rounded"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
            <input
              className="w-full border px-4 py-2 rounded"
              placeholder="Start Time"
              type="time"
            />
            <input
              className="w-full border px-4 py-2 rounded"
              placeholder="End Time"
              type="time"
            />
            <textarea
              className="w-full border px-4 py-2 rounded"
              placeholder="Notes"
            ></textarea>
            <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Log Shift
            </button>
          </form>
        )}
        {type === "service" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAddService({
                name: String(formData.get("name")),
                rate: String(formData.get("rate")),
                unit: String(formData.get("unit")),
                type: "service",
              });
              onClose();
            }}
          >
            <input name="name" className="w-full border px-4 py-2 rounded" placeholder="Service Name" />
            <input name="rate" className="w-full border px-4 py-2 rounded" placeholder="Rate" type="number" />
            <input name="unit" className="w-full border px-4 py-2 rounded" placeholder="Unit (e.g. hrs)" />
            <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Service</button>
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
  const [editingService, setEditingService] = useState<number | null>(null);
  const [draftInvoices, setDraftInvoices] = useState<Invoice[]>([
    {
      id: 124,
      client: "Jane Doe",
      date: "2025-06-21",
      items: [{ description: "Community Access", qty: 2, rate: 50 }],
      status: "draft",
    },
  ]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>();
  const [clients, setClients] = useState<Client[]>([
    {
      name: "Jane Doe",
      email: "janedoe@email.com",
      phone: "0400 123 456",
      services: ["Community Access"],
    },
    {
      name: "Mark Smith",
      email: "marksmith@email.com",
      phone: "0400 654 321",
      services: ["Domestic Assistance"],
    },
  ]);
  const [services, setServices] = useState<Service[]>([
    { name: "Community Access", rate: "50", unit: "hrs", type: "service" },
    { name: "Domestic Assistance", rate: "45", unit: "hrs", type: "service" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-bold text-indigo-600">Da Foundry</h1>
        <div className="flex space-x-6 text-sm font-medium text-gray-700">
          <button
            onClick={() => setActiveTab("overview")}
            className="hover:text-indigo-600"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className="hover:text-indigo-600"
          >
            Clients
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className="hover:text-indigo-600"
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab("shifts")}
            className="hover:text-indigo-600"
          >
            Shifts
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className="hover:text-indigo-600"
          >
            Invoices
          </button>
        </div>
        <div className="text-sm">John Worker ▼</div>
      </nav>

      <Modal
        type={activeModal}
        onClose={() => setActiveModal("")}
        onAddClient={(c) => setClients((prev) => [...prev, c])}
        onAddService={(s) => setServices((prev) => [...prev, s])}
        clients={clients}
        services={services}
      />

      <main className="max-w-6xl mx-auto p-6">
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {statCards.map((card, idx) => {
                const value =
                  card.key === "invoices"
                    ? draftInvoices.length
                    : card.key === "clients"
                      ? clients.length
                      : services.length;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(card.key)}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md w-full text-left"
                  >
                    <p className="text-gray-500 text-sm">{card.title}</p>
                    <p className="text-2xl font-semibold text-indigo-600">
                      {value}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
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

            <div className="bg-white p-4 rounded-xl shadow">
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
            <p className="text-sm text-gray-600">
              View and manage your client list.
            </p>
            {clients.map((c, idx) => (
              <div key={idx} className="border rounded p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-500">
                  {c.email} - {c.phone}
                </p>
                {c.notes && <p className="text-xs mt-1">{c.notes}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === "services" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold">Services</h2>
            <p className="text-sm text-gray-600">
              Your offered services and hourly rates.
            </p>
            {services.map((s, idx) => (
              <div key={idx} className="border rounded p-4 flex justify-between items-center">
                {editingService === idx ? (
                  <div className="flex-1 space-y-2">
                    <input
                      value={s.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setServices((prev) =>
                          prev.map((sv, i) => (i === idx ? { ...sv, name: value } : sv)),
                        );
                      }}
                      className="w-full border px-2 py-1 rounded"
                    />
                    <div className="flex space-x-2">
                      <input
                        value={s.rate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setServices((prev) =>
                            prev.map((sv, i) => (i === idx ? { ...sv, rate: value } : sv)),
                          );
                        }}
                        className="border px-2 py-1 rounded w-24"
                        type="number"
                      />
                      <input
                        value={s.unit}
                        onChange={(e) => {
                          const value = e.target.value;
                          setServices((prev) =>
                            prev.map((sv, i) => (i === idx ? { ...sv, unit: value } : sv)),
                          );
                        }}
                        className="border px-2 py-1 rounded w-24"
                      />
                      <select
                        value={s.type}
                        onChange={(e) => {
                          const value = e.target.value as "service" | "product";
                          setServices((prev) =>
                            prev.map((sv, i) => (i === idx ? { ...sv, type: value } : sv)),
                          );
                        }}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="service">Service</option>
                        <option value="product">Product</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-sm text-gray-500">${s.rate}/{s.unit}</p>
                  </div>
                )}
                <div className="space-x-2">
                  {editingService === idx ? (
                    <button
                      className="text-sm text-green-600"
                      onClick={() => setEditingService(null)}
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      className="text-sm text-indigo-600"
                      onClick={() => setEditingService(idx)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "shifts" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold">Shifts</h2>
            <p className="text-sm text-gray-600">
              Recent shifts you have logged.
            </p>
            <div className="border rounded p-4">
              <p className="text-sm">
                22 Jun 2025 - Jane Doe - 2h Community Access
              </p>
            </div>
            <div className="border rounded p-4">
              <p className="text-sm">
                20 Jun 2025 - Mark Smith - 3h Domestic Assistance
              </p>
            </div>
          </div>
        )}

        {activeTab === "invoices" && !showInvoiceBuilder && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold">Invoices</h2>
            <p className="text-sm text-gray-600">
              Manage invoices grouped by clients.
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowInvoiceBuilder(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                New Invoice
              </button>
              <div className="text-sm font-medium">
                Estimated Tax: $
                {(
                  draftInvoices
                    .reduce(
                      (sum, inv) =>
                        sum +
                        inv.items.reduce((s, it) => s + it.qty * it.rate, 0),
                      0,
                    ) * 0.3
                ).toFixed(2)}
              </div>
              <button
                onClick={() => setDraftInvoices([])}
                className="px-3 py-1 border rounded text-sm"
              >
                Archive FY
              </button>
            </div>
            <div className="space-y-4">
              {clients.map((c) => {
                const clientInvoices = draftInvoices.filter(
                  (d) => d.client === c.name,
                );
                if (!clientInvoices.length) return null;
                const total = clientInvoices.reduce(
                  (sum, inv) =>
                    sum + inv.items.reduce((s, it) => s + it.qty * it.rate, 0),
                  0,
                );
                return (
                  <div key={c.name} className="border rounded p-4">
                    <h3 className="font-semibold mb-2">
                      {c.name} - ${total.toFixed(2)}
                    </h3>
                    <ul className="space-y-2">
                      {clientInvoices.map((inv) => (
                        <li
                          key={inv.id}
                          className="flex justify-between items-center"
                        >
                          <span>
                            Invoice #{inv.id} - $
                            {inv.items
                              .reduce((s, it) => s + it.qty * it.rate, 0)
                              .toFixed(2)}
                            - {inv.status}
                          </span>
                          <div className="space-x-2">
                            <button
                              className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
                              onClick={() => {
                                setEditingInvoice(inv);
                                setShowInvoiceBuilder(true);
                              }}
                            >
                              Preview
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "invoices" && showInvoiceBuilder && (
          <InvoiceBuilder
            onBack={() => {
              setShowInvoiceBuilder(false);
              setEditingInvoice(undefined);
            }}
            services={services}
            clients={clients}
            invoice={editingInvoice}
            onSave={(inv) => {
              setDraftInvoices((prev) => {
                const existing = prev.findIndex((d) => d.id === inv.id);
                if (existing >= 0) {
                  const copy = [...prev];
                  copy[existing] = inv;
                  return copy;
                }
                return [...prev, inv];
              });
            }}
          />
        )}

        {!["overview", "invoices", "clients", "services"].includes(
          activeTab,
        ) && (
          <div className="text-gray-500 text-sm p-8 border rounded bg-white">
            <p className="mb-2">
              This is the <strong>{activeTab}</strong> section. Build your UI
              here.
            </p>
            <p>
              You can add forms, lists, modals, etc. depending on the tab
              selected.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
