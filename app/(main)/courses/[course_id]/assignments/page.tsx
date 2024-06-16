import { AssignmentInbox } from "./_components/assignment-inbox";
import { assignments } from "./data";

export default function CourseAssignmentPage() {
  return (
    // <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 grid-flow-row">
    <main className="grid flex-1 flex-grow gap-4 p-4 pb-0 sm:px-6 md:gap-8">
      <AssignmentInbox items={assignments} />
    </main>
  );
}
