import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { fetchAPIRequest } from '@/lib/utils';

async function getCourses() {
  const token = getCookie('accessToken', { cookies }) || '';
  const res = await fetchAPIRequest('/api/v1/courses', 'GET', token);
  console.log(res);
}

export default async function Home() {
  // console.log(getCookie('accessToken', { cookies }));
  const myCourses = await getCourses();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Courses Page
    </main>
  );
}
