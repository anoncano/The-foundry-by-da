import Link from "next/link";

export default function WorkerDashboard() {
  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Worker Dashboard</h1>
      <p className="mb-2">Navigate to the new modules below.</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link href="/worker/dashboard" className="text-blue-600 underline">
            Open New Dashboard
          </Link>
        </li>
        <li>
          <Link href="/worker/clients" className="text-blue-600 underline">
            Manage Clients
          </Link>
        </li>
        <li>
          <Link href="/worker/shifts" className="text-blue-600 underline">
            Log Shifts
          </Link>
        </li>
      </ul>
    </div>
  );
}
