"use client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-2xl font-bold">Join The Foundry</h1>
      <button
        className="bg-blue-600 text-white p-3 rounded w-64"
        onClick={() => router.push('/signup/participant')}
      >
        I&apos;m a Participant
      </button>
      <button
        className="bg-green-600 text-white p-3 rounded w-64"
        onClick={() => router.push('/signup/worker')}
      >
        I&apos;m a Worker
      </button>
    </div>
  );
}
