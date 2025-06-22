"use client";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import app from "../lib/firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, form.email, form.password);
      const uid = res.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) throw new Error("User profile not found");
      const { role } = userDoc.data();

      if (role === "admin") router.push("/admin");
      else if (role === "worker") router.push("/worker-dashboard");
      else if (role === "client") router.push("/client-dashboard");
      else throw new Error("Unknown user role.");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">Login</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Enter your email and password to continue</p>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin}>
          <label className="block mb-1 font-medium text-sm text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@email.com"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-indigo-300"
          />

          <label className="block mb-1 font-medium text-sm text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring focus:ring-indigo-300"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-medium rounded ${loading ? "bg-gray-500" : "bg-black hover:bg-gray-800"} transition`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
