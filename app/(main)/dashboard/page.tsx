import { TaskCreationDialog } from '@/components/aegile/task-creation-dialog';

export default async function DashboardPage() {
  return (
    <div className="grid h-full items-center justify-center">
      <h1>Dashboard</h1>
      <TaskCreationDialog />
    </div>
  );
}
