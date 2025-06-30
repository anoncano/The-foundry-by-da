import WorkerSidebar from '@/app/components/WorkerSidebar';
import InvoiceForm from '@/app/components/InvoiceForm';

export default function InvoicesPage() {
  return (
    <div className="flex">
      <WorkerSidebar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Invoices</h1>
        <InvoiceForm />
      </div>
    </div>
  );
}
