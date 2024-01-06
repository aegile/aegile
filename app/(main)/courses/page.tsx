import { fetchServerAPIRequest } from '@/lib/utils';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { toast } from 'sonner';

async function getCourses() {
  const token = getCookie('accessToken', { cookies }) || '';
  // try {
  //   return await fetchServerAPIRequest('/api/v1/courses', 'GET', token);
  // } catch (error) {
  //   const err = error as Error;
  //   return { error: err.message };
  // }
}

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <div className="grid h-full items-center justify-center">
      <h1>Courses Page</h1>
    </div>
  );
}
