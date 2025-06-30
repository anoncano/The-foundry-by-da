import WorkerSidebar from '@/app/components/WorkerSidebar';

export default function DashboardPage() {
  return (
    <div className="flex">
      <WorkerSidebar />
      <div className="p-4">Dashboard</div>
    </div>
  );
}
