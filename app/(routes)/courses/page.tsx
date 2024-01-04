async function getCourses() {
  const serverUrl = process.env.NEXT_PUBLIC_VERCEL_URL || '127.0.0.1:5328';
  const res = await fetch(`http://${serverUrl}/api/v1/auth/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
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
