import { DataTable } from '@/components/data-table/data-table';
import { columns } from './_components/columns';
import { DataTableToolbar } from './_components/course-assessments-table-toolbar';
import { WeeklyContentList } from './_components/weekly-content-list';
import { Assessment, WeeklyContent } from '@/lib/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import CourseMaterialsCard from './_components/course-materials-card';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default async function CourseHomePage() {
  // const assessments: Assessment[] = await getAssessments(params.course_id);
  const assessments: Assessment[] = [
    {
      id: 'ass_as9gyagya089ygss',
      assessment_name: 'Class Participation',
      type: 'Individual',
      weighting: '10%',
      length: null,
      due_date: 'Ongoing',
    },
    {
      id: 'ass_7yA7g65h8sfmuts6',
      assessment_name: 'Tutorial Activites',
      type: 'Individual',
      weighting: '10%',
      length: null,
      due_date: 'Weekly (Sunday 11:59pm)',
    },
    {
      id: 'ass_1a2b3c4d5e6f7g8h',
      assessment_name: 'Individual Project',
      type: 'Individual',
      weighting: '20%',
      length: '2000 words',
      due_date: 'Monday 20 April 11:59pm',
    },
    {
      id: 'ass_9i8j7k6l5m4n3o2p',
      assessment_name: 'Sandbox Group Assignment',
      type: 'Group',
      weighting: '20%',
      length: '10 Minutes',
      due_date: 'Monday 30 April 11:59pm',
    },
    {
      id: 'ass_q1w2e3r4t5y6u7i8',
      assessment_name: 'Final Exam',
      type: 'Individual',
      weighting: '40%',
      length: 'TBA',
      due_date: 'TBA',
    },
  ];

  const weeks: WeeklyContent[] = [
    {
      id: 'wkc_as9gyagya089ygss',
      name: 'Week 1: An Introduction to the Nature of Equity and an Overview of Equitable Remedies',
      dates: '10/02/2023 - 17/02/2023', 
      tasks: 'Readings and Tutorial Activities',
      status: 100,
    },
    {
      id: 'wkc_7yA7g65h8sfmuts6',
      name: 'Week 2: Equitable Property and Equity Fiduciary Obligations',
      dates: '18/02/2023 - 25/02/2023',
      tasks: 'Readings and Tutorial Activities',
      status: 96,
    },
    {
      id: 'wkc_1a2b3c4d5e6f7g8h',
      name: 'Week 3: The Law of Equitable Assignment',
      dates: '04/03/2023 - 12/03/2023',
      tasks: 'Readings and Tutorial Activities',
      status: 82,
    },
    {
      id: 'wkc_9i8j7k6l5m4n3o2p',
      name: 'Week 4: Trusts and the Fiduciary Workshop',
      dates: '13/03/2023 - 20/03/2023',
      tasks: 'Readings and Tutorial Activities',
      status: 48,
    },
    {
      id: 'wkc_q1w2e3r4t5y6u7i8',
      name: 'Week 5: Trusts Continued',
      dates: '21/03/2023 - 28/03/2023',
      tasks: 'Readings and Tutorial Activities',
      status: 0,
    },
  ]
  
  return (
    <main className="grid h-screen w-full flex-1 gap-4 bg-muted/40 pl-4 pt-4 pb-0 2xl:pr-6 sm:pl-6 md:gap-8 2xl:grid-cols-4 grid-flow-row">
      {/* h-[calc(100vh-6.5rem)] */}
      <ScrollArea className='h-[calc(100vh-7.5rem)] 2xl:col-span-3 pb-4 pr-4 sm:pr-6 2xl:pr-0'>
        <div className="space-y-4 2xl:pr-3">
          <div className="space-y-4 pb-4">
            <div className='flex justify-between items-center'>
              <div className="flex-col">
                <h1 className="text-xl font-bold">Assessments Hub</h1>
                <h1 className="text-sm">Click on an assessment to learn more</h1>
              </div>
              <Sheet>
                <SheetTrigger asChild className='2xl:hidden inline'>
                  <Button variant="outline">Course Materials</Button>
                </SheetTrigger>
                <SheetContent className='p-0'>
                  <ScrollArea className='h-screen p-8 pb-4'>
                    <CourseMaterialsCard />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
            <DataTable
              columns={columns}
              data={assessments}
              DataTableToolbar={DataTableToolbar}
              togglePagination={false}
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-xl font-bold">Course Content</h1>
            <div className="space-y-3">
              <WeeklyContentList
                items={weeks}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="2xl:col-span-1 2xl:block overflow-y-auto hidden">
        <ScrollArea className="h-[calc(100vh-7.5rem)] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl border rounded-br-none rounded-bl-none border-b-0 p-8 pb-4">
          <CourseMaterialsCard/>
        </ScrollArea>
      </div>
    </main>
  );
}
