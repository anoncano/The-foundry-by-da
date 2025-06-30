import WorkerSidebar from '@/app/components/WorkerSidebar';
import SMSPlaceholder from '@/app/components/SMSPlaceholder';

export default function AutomationPage() {
  return (
    <div className="flex">
      <WorkerSidebar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Automation</h1>
        <SMSPlaceholder />
      </div>
    </div>
  );
}
