import Link from 'next/link';

export default function WorkerSidebar() {
  return (
    <aside className="flex flex-col gap-2 p-4 border-r min-w-40">
      <Link href="/worker/dashboard">Dashboard</Link>
      <Link href="/worker/clients">Clients</Link>
      <Link href="/worker/shifts">Shifts</Link>
      <Link href="/worker/invoices">Invoices</Link>
      <Link href="/worker/expenses">Expenses</Link>
      <Link href="/worker/automation">Automation</Link>
    </aside>
  );
}
