import DndListContext from './DndListContext';

export default async function ProjectsPage() {
  return (
    // <div className="h-screen flex flex-col p-8 space-y-6 overflow-y-auto">
    //   <div className="flex items-center justify-between">
    //     <h2 className="text-3xl font-semibold tracking-tight">My Courses</h2>
    //   </div>
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <DndListContext />
    </main>
    // </div>
  );
}
