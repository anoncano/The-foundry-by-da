import WorkerSidebar from '@/app/components/WorkerSidebar';
import ExpenseForm from '@/app/components/ExpenseForm';

export default function ExpensesPage() {
  return (
    <div className="flex">
      <WorkerSidebar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Expenses</h1>
        <ExpenseForm />
      </div>
    </div>
  );
}
