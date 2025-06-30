import WorkerSidebar from '@/app/components/WorkerSidebar';
import ClientForm from '@/app/components/ClientForm';

export default function ClientsPage() {
  return (
    <div className="flex">
      <WorkerSidebar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Clients</h1>
        <ClientForm />
      </div>
    </div>
  );
}
