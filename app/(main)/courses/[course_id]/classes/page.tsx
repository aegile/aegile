import { fetchServerAPIRequest } from '@/lib/server-utils';

import { Button } from '@/components/ui/button';
import { Presentation } from 'lucide-react';
import UpcomingClasses from './upcoming-classes';
import { ClassCreationDialog } from './class-creation-dialog';
import GridListViewCard from '@/components/grid-list-view-card';

// async function getTutorials() {
//   const res = await fetchServerAPIRequest('/api/v1/tutorials', 'GET');
//   if (res.status === 401)
//     throw new Error("You don't have permission to view this page.");
//   if (res.status === 400)
//     return { error: "You don't have permission to view this page." };
//   const data = await res.json();
//   return data;
// }

export default async function CourseClassesPage() {
  // const tutorials = await getTutorials();

  return (
    <div className="h-full flex flex-col space-y-3">
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold tracking-tight flex items-center">
          <Presentation className="mr-2" /> Classes
        </h3>
      </div>
      <div className="flex-grow space-y-5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:grid-rows-2 gap-5 md:overflow-y-auto">
        <div className="md:col-span-2 row-span-full">
          <GridListViewCard
            dataName="classes"
            items={[]}
            GridItemComponent={() => <></>}
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
