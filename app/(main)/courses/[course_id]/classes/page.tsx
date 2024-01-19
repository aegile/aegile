import { fetchServerAPIRequest } from '@/lib/server-utils';

import { Button } from '@/components/ui/button';
import { Presentation } from 'lucide-react';
import UpcomingClasses from './_components/upcoming-classes';
import { ClassCreationDialog } from './_components/class-creation-dialog';
import GridListViewCard from '@/components/grid-list-view-card';
import ClassGridCard from './_components/class-grid-card';

async function getTutorials(course_id: string) {
  const res = await fetchServerAPIRequest(
    `/api/v1/tutorials/crs/${course_id}`,
    'GET'
  );
  if (res.status === 401)
    throw new Error("You don't have permission to view this page.");
  if (res.status === 400)
    return { error: "The course you are attempting to access doesn't exist." };
  const data = await res.json();
  return data;
}

export default async function CourseClassesPage({
  params,
}: {
  params: { course_id: string };
}) {
  const tutorials: Class[] = await getTutorials(params.course_id);
  console.log('🚀 ~ tutorials:', tutorials);

  return (
    <div className="h-full flex flex-col space-y-3">
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold tracking-tight flex items-center">
          <Presentation className="mr-2" /> Classes
        </h3>
      </div>
      {/* <div className="flex-grow flex flex-col pb-3 md:pb-0 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:grid-rows-3 lg:grid-rows-2 gap-5 md:overflow-y-auto">
        <div className="md:col-span-2 md:row-span-2"> */}
      <div className="flex-grow space-y-5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:grid-rows-2 gap-5 md:overflow-y-auto">
        <div className="md:col-span-2 lg:row-span-2">
          <GridListViewCard
            dataName="classes"
            items={tutorials}
            GridItemComponent={ClassGridCard}
            ListItemComponent={() => <></>}
            ItemCreationComponent={ClassCreationDialog}
          />
        </div>
        {/* <div className="w-full row-span-full"></div> */}
        <UpcomingClasses />
        <UpcomingClasses />
      </div>
    </div>
  );
}
