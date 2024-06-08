import { User } from '@/lib/types';

import { MessageCircleMore } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';

interface CourseTeacherCardProps {
  item: User;
  children?: React.ReactNode;
}

export default function CourseTeacherCard ({ 
  item, 
  children
} : CourseTeacherCardProps) {

  const initials: string = item.first_name.charAt(0) + item.last_name.charAt(0);

  function capitalizeRole(role: string | undefined): string {
    if (!role) {
      return "No assigned role";
    }
    let wordArr: string[] = role.split(" ");
    return wordArr.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
  }

  return (
    <div className='flex gap-2'>
      <Avatar>
        <AvatarImage src={item?.image} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className='flex w-full flex-col pl-2'>
        <h4 className='font-semibold text-lg pb-0.5'>{item.first_name + ' ' + item.last_name}</h4>
        <div className='text-sm'>Role: {capitalizeRole(item?.role)}</div>
        <div className='text-sm'>Email: {item.email}</div>
      </div>

      <Button variant="ghost" size="icon">
        <MessageCircleMore/>
      </Button>
    </div>
  );
} 