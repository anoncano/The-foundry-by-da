import WorkerSidebar from '@/app/components/WorkerSidebar';
import ShiftLogger from '@/app/components/ShiftLogger';

export default function ShiftsPage() {
  return (
    <div className="flex">
      <WorkerSidebar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Shifts</h1>
        <ShiftLogger />
      </div>
    </div>
  );
}
