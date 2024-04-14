import { columns } from './columns';
import { DataTable } from '@/components/data-table/data-table';
import { Participant } from '@/lib/schemas';
import { DataTableToolbar } from './course-participants-table-toolbar';
import { EnrolParticipantsDialog } from './components/enrol-participants-dialog';

// async function getParticipants(course_id: string) {
//   const res = await fetchServerAPIRequest(
//     `/api/v1/courses/${course_id}/members`,
//     'GET'
//   );
//   if (res.status === 401)
//     throw new Error("You don't have permission to view this page.");
//   if (res.status === 403)
//     throw new Error('You are not authorized to view this page.');

//   const data = await res.json();
//   return data;
// }

export default async function CourseParticipantsPage({
  params,
}: {
  params: { course_id: string };
}) {
  // const members: Participant[] = await getParticipants(params.course_id);
  const members: Participant[] = [];

  return (
    <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 grid-flow-row">
      <div className="col-span-3">
        <DataTable
          columns={columns}
          data={members}
          DataTableToolbar={DataTableToolbar}
        />
      </div>
    </main>
  );
}
