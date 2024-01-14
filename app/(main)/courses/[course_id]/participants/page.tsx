import { columns } from './columns';
import { DataTable } from '@/components/data-table/data-table';
import { Participant } from '@/lib/schemas';
import { fetchServerAPIRequest } from '@/lib/server-utils';
import { DataTableToolbar } from './course-participants-table-toolbar';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

async function getParticipants(course_id: string) {
  const res = await fetchServerAPIRequest(
    `/api/v1/courses/${course_id}/members`,
    'GET'
  );
  if (res.status === 401)
    throw new Error("You don't have permission to view this page.");
  if (res.status === 403)
    throw new Error('You are not authorized to view this page.');

  const data = await res.json();
  return data;
  return [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'z5555555@ad.unsw.edu.au',
      handle: 'z5555555',
      role: 'tutor',
      image: 'null',
    },
    {
      id: '2',
      first_name: 'Lex',
      last_name: 'Xu',
      email: 'z5309038@ad.unsw.edu.au',
      handle: 'z5309038',
      role: 'admin',
      image: 'null',
    },
    {
      id: '3',
      first_name: 'Lex',
      last_name: 'Xu',
      email: 'z5309038@ad.unsw.edu.au',
      handle: 'z5309038',
      role: 'student',
      image: 'null',
    },
  ];
}

export default async function CourseParticipantsPage({
  params,
}: {
  params: { course_id: string };
}) {
  const members: Participant[] = await getParticipants(params.course_id);

  return (
    <div className="h-full">
      {/* <pre>
        <p>{JSON.stringify(members, null, 4)}</p>
      </pre> */}
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold tracking-tight flex items-center">
          <Users className="mr-2" /> Participants
        </h3>
        <Button variant="default">Add/Invite Participant</Button>
      </div>
      <div className="w-full py-4">
        <DataTable
          columns={columns}
          data={members}
          DataTableToolbar={DataTableToolbar}
        />
      </div>
    </div>
  );
}
