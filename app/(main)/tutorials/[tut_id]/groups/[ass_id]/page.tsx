export default function Page({
  params,
}: {
  params: { tut_id: string; ass_id: string };
}) {
  return (
    <>
      {params.tut_id} {params.ass_id}
    </>
  );
}
