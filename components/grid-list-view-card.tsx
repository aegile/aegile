import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { LayoutGrid, LayoutList } from 'lucide-react';

import DataNotFound from '@/components/page-ui/data-not-found';

// import { CourseCreationDialog } from './course-creation-dialog';

export default function GridListViewCard<T>({
  dataName,
  items,
  GridItemComponent,
  ListItemComponent,
  ItemCreationComponent,
}: {
  dataName: string;
  items: T[];
  GridItemComponent: React.ElementType<{ item: T }>;
  ListItemComponent: React.ElementType<{ item: T }>;
  ItemCreationComponent: React.ElementType;
}) {
  return (
    <Tabs defaultValue="grid-view" className="h-full">
      <Card className="w-full flex flex-col h-full max-h-[750px] sm:max-h-full">
        <CardHeader>
          <CardTitle>
            {dataName.charAt(0).toUpperCase() + dataName.slice(1)}
          </CardTitle>
          <CardDescription>View and manage your {dataName}.</CardDescription>
          <div className="flex items-center ml-auto space-x-2">
            {ItemCreationComponent && <ItemCreationComponent />}
            <TabsList>
              <TabsTrigger value="grid-view">
                <LayoutGrid className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="list-view">
                <LayoutList className="w-5 h-5" />
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent
          className="h-full overflow-y-auto"
          style={{ scrollbarGutter: 'stable' }}
        >
          {!items.length ? (
            <DataNotFound dataName="items" />
          ) : (
            <>
              <TabsContent value="grid-view">
                <div className="grid w-full gap-6 auto-rows-min sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {items.map((item, index) => (
                    <GridItemComponent key={index} item={item} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="list-view">
                <div className="flex flex-col w-full gap-6">
                  {items.map((item, index) => (
                    <ListItemComponent key={index} item={item} />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
}
