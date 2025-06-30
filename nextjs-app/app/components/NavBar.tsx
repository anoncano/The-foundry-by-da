import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign Up</Link>
      <Link href="/admin">Admin</Link>
      <Link href="/worker">Worker</Link>
      <Link href="/worker-dashboard">Dashboard</Link>
      <Link href="/client">Client</Link>
    </nav>
  );
}
