"use client";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to The Foundry</h1>
        <p className="text-gray-600 mb-8">Track jobs. Send invoices. Work smarter.</p>

        <div className="flex flex-col gap-4">
          <Link href="/login">
            <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">Login</button>
          </Link>

          {!showRoleSelect && (
            <button
              className="w-full border border-black text-black py-2 rounded hover:bg-gray-100 transition"
              onClick={() => setShowRoleSelect(true)}
            >
              Sign Up
            </button>
          )}

          {showRoleSelect && (
            <div className="flex flex-col gap-2">
              <Link href="/worker-signup">
                <button className="w-full border border-indigo-600 text-indigo-600 py-2 rounded hover:bg-indigo-50 transition">
                  I'm a Worker
                </button>
              </Link>

              <Link href="/client-signup">
                <button className="w-full border border-emerald-600 text-emerald-600 py-2 rounded hover:bg-emerald-50 transition">
                  I'm a Client
                </button>
              </Link>

              <button
                className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                onClick={() => setShowRoleSelect(false)}
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
