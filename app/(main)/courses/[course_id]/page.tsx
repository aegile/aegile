export default function SpecificCoursePage({
  params,
}: {
  params: { course_id: string };
}) {
  return (
    <div className="grid h-full items-center justify-center">
      <h1>Course #{params.course_id}</h1>
    </div>
  );
}
