
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { BookOpenText, CalendarRange, ChevronRight, MessageSquareText } from 'lucide-react';

import { cn } from '@/lib/utils';

import { User } from '@/lib/types';
import CourseTeacherCard from './course-teacher-card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CourseMaterialsCard() {
  const teachers: User[] = [
    {
      id: 'usr_as9gyagya089ygss',
      email: 'alex@email.com',
      first_name: 'Alex',
      last_name: 'Xu',
      handle: 'alexxu123',
      // image: null,
      role: 'lecturer in charge',
    },
    {
      id: 'usr_7yA7g65h8sfmuts6',
      email: 'sam@emial.com',
      first_name: 'Sam',
      last_name: 'Smith',
      handle: 'samsmith',
      // image: null,
      role: 'lecturer',
    },
    {
      id: 'usr_1a2b3c4d5e6f7g8h',
      email: 'john@email.com',
      first_name: 'John',
      last_name: 'Doe',
      handle: 'johndoe',
      // image: null,
      role: 'tutor',
    },
    {
      id: 'usr_9i8j7k6l5m4n3o2p',
      email: 'jane@email.com',
      first_name: 'Jane',
      last_name: 'Doe',
      handle: 'janedoe',
      // image: null,
      role: 'tutor',
    },
    {
      id: 'usr_q1w2e3r4t5y6u7i8',
      email: 'bob@email.com',
      first_name: 'Bob',
      last_name: 'Smith',
      handle: 'bobsmith',
      // image: null,
      role: 'tutor',
    },
    {
      id: 'usr_z1x2c3v4b5n6m7l8',
      email: 'alice@email.com',
      first_name: 'Alice',
      last_name: 'Johnson',
      handle: 'alicejohnson',
      // image: null,
      // role: 'tutor',
    },
    {
      id: 'usr_z1x2c3v4b5n6m7l8',
      email: 'alice@email.com',
      first_name: 'Alice',
      last_name: 'Johnson',
      handle: 'alicejohnson',
      // image: null,
      // role: 'tutor',
    },
    {
      id: 'usr_z1x2c3v4b5n6m7l8',
      email: 'alice@email.com',
      first_name: 'Alice',
      last_name: 'Johnson',
      handle: 'alicejohnson',
      // image: null,
      // role: 'tutor',
    },
    {
      id: 'usr_z1x2c3v4b5n6m7l8',
      email: 'alice@email.com',
      first_name: 'Alice',
      last_name: 'Johnson',
      handle: 'alicejohnson',
      // image: null,
      // role: 'tutor',
    },
    {
      id: 'usr_z1x2c3v4b5n6m7l8',
      email: 'alice@email.com',
      first_name: 'Alice',
      last_name: 'Johnson',
      handle: 'alicejohnson',
      // image: null,
      // role: 'tutor',
    },
  ]
  
  return (
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col space-y-2">
          <div className='pb-3 text-xl font-bold'>Course Materials</div>
          <button
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all duration-300 bg-background/80 hover:bg-accent',
            )}
            // onClick={}
          >          
            <CalendarRange className="h-35 w-35"/>
            <div className="grow w-full font-semibold text-lg line-clamp-1">Course Outline</div>
            <ChevronRight className="h-25 w-25"/>
          </button>
          <button
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all duration-300 bg-background/80 hover:bg-accent',
            )}
            // onClick={}
          >          
            <MessageSquareText className="h-25 w-25"/>
            <div className="w-full font-semibold text-lg line-clamp-1">Announcements & Forums</div>
            <ChevronRight className="h-25 w-25"/>
          </button>
          <button
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all duration-300 bg-background/80 hover:bg-accent',
            )}
            // onClick={}
          >          
            <BookOpenText className="h-25 w-25"/>
            <div className="w-full font-semibold text-lg line-clamp-1">Reading Guide</div>
            <ChevronRight className="h-25 w-25"/>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className='text-xl font-bold pb-3'>Teaching Team</div>
          <div className='flex flex-col gap-4'>
            {teachers.map((teacher, index) => (
              <CourseTeacherCard key={index} item={teacher}/>
            ))}
          </div>
        </div>
      </div>
  );
}