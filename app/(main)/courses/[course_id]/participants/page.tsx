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
  const members: Participant[] = [
    {
      id: 'usr_as9gyagya089ygss',
      email: 'alex@email.com',
      first_name: 'Alex',
      last_name: 'Xu',
      handle: 'alexxu123',
      image: null,
      role: 'student',
    },
    {
      id: 'usr_7yA7g65h8sfmuts6',
      email: 'sam@emial.com',
      first_name: 'Sam',
      last_name: 'Smith',
      handle: 'samsmith',
      image: null,
      role: 'tutor',
    },
    {
      id: 'usr_1a2b3c4d5e6f7g8h',
      email: 'john@email.com',
      first_name: 'John',
      last_name: 'Doe',
      handle: 'johndoe',
      image: null,
      role: 'admin',
    },
    {
      id: 'usr_9i8j7k6l5m4n3o2p',
      email: 'jane@email.com',
      first_name: 'Jane',
      last_name: 'Doe',
      handle: 'janedoe',
      image: null,
      role: 'tutor',
    },
    {
      id: 'usr_q1w2e3r4t5y6u7i8',
      email: 'bob@email.com',
      first_name: 'Bob',
      last_name: 'Smith',
      handle: 'bobsmith',
      image: null,
      role: 'student',
    },
    {
      id: 'usr_z1x2c3v4b5n6m7l8',
      email: 'alice@email.com',
      first_name: 'Alice',
      last_name: 'Johnson',
      handle: 'alicejohnson',
      image: null,
      role: 'tutor',
    },
  ];

  return (
    <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 grid-flow-row">
      <div className="col-span-3">
        <DataTable
          columns={columns}
          data={members}
          DataTableToolbar={DataTableToolbar}
          togglePagination={true}
        />
      </div>
    </main>
  );
}
