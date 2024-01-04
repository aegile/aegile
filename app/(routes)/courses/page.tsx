import { cookies } from 'next/headers';

async function getCourses() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');

  const res = await fetch('http://127.0.0.1:5000/api/v1/courses', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.value}`,
    },
  });
  // console.log(res.json());
}

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <div className="grid h-full items-center justify-center">Courses Page</div>
  );
}
