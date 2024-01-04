import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { fetchAPIRequest } from '@/lib/utils';

async function getCourses() {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = getCookie('accessToken', { cookies }) || '';
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const res = await fetch('http://localhost:5328/api/v1/courses', options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${res.status}: ${data.msg}`);
  }
  await fetchAPIRequest('/api/v1/courses', 'GET', token);
}

export default async function Home() {
  // console.log(getCookie('accessToken', { cookies }));
  // const myCourses = await getCourses();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Courses Page
    </main>
  );
}
