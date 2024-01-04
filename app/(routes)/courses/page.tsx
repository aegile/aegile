import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { fetchAPIRequest } from '@/lib/utils';

async function getCourses() {
  const res = await fetchAPIRequest(
    'http://localhost:5328/api/v1/courses',
    'GET'
  );
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
