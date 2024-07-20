import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/server-utils";
import { Separator } from "@/components/ui/separator";
import { ClientDateTime } from "@/components/custom/client-datetime";

async function getTutorialData(tutorialId: string) {
  try {
    const data = await serverFetch(`/api/tutorials/${tutorialId}`, "GET");
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export default async function TutorialHomePage({
  params,
}: {
  params: { tut_id: string };
}) {
  const tutorialData = await getTutorialData(params.tut_id);
  if (!tutorialData) {
    return notFound();
  }

  const { day, location, start_time, end_time, name } = tutorialData;

  return (
    <div className="px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">
          Tutorial - {name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {day}, <ClientDateTime datetime={start_time} variant="ISO" />
          {" - "}
          <ClientDateTime datetime={end_time} variant="ISO" />, @{location}
        </p>
      </div>
      <Separator className="my-6" />
    </div>
  );
}
