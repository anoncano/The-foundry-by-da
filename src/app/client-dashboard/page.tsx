"use client";
import Link from "next/link";

export default function ClientDashboardPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>
        <p className="text-gray-600 mb-6">Placeholder page for client features.</p>
        <Link href="/">
          <button className="border border-gray-800 px-4 py-2 rounded hover:bg-gray-50">Back Home</button>
        </Link>
      </div>
    </div>
  );
}
