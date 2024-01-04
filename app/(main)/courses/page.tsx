import { fetchServerAPIRequest } from '@/lib/utils';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

async function getCourses() {
  const token = getCookie('accessToken', { cookies }) || '';
  const res = await fetchServerAPIRequest('/api/v1/courses', 'GET', token);
}

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <div className="grid h-full items-center justify-center">
      <h1>Courses Page</h1>
    </div>
  );
}
