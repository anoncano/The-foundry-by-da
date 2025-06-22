"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../lib/firebase";
import { useRouter } from "next/navigation";

const auth = getAuth(app);
const db = getFirestore(app);

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        setIsAdmin(true);
      } else {
        router.push("/unauthorised"); // or 404
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p className="text-center mt-10">Checking access...</p>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">You have full access.</p>

        <ul className="list-disc pl-6 text-gray-800">
          <li>NDIS signup link generation</li>
          <li>User manager</li>
          <li>NDIA data uploader</li>
          <li>Invoice oversight</li>
        </ul>
      </div>
    </div>
  );
}
