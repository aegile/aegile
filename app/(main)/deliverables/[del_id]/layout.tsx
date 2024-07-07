// import { notFound } from "next/navigation";

// import { serverFetch } from "@/lib/server-utils";
import { NavCollapsedMenu, NavMenuBar } from "@/components/custom/nav-menu-bar";

// async function getDeliverableData(deliverableId: string) {
//   try {
//     const data = await serverFetch(`/api/deliverables/${deliverableId}`, "GET");
//     return data;
//   } catch (error) {
//     console.error("Failed to fetch data:", error);
//   }
// }

export default async function DeliverableLayout({
  params,
  children,
}: {
  params: { del_id: string };
  children: React.ReactNode;
}) {
  // const course: Course = await getCourse(params.course_id);
  // const deliverableData = getDeliverableData(params.del_id);
  // if (!deliverableData) {
  //   return notFound();
  // }
  const links = [
    {
      title: "Home",
      href: "",
      description: "Start here to get an overview of this deliverable!",
    },
    {
      title: "Submissions",
      href: "submissions",
      description: "View all the submission requirements for this deliverable.",
    },
    {
      title: "Settings",
      href: "settings",
      description: "Customize this deliverable",
    },
  ];
  return (
    <>
      <NavMenuBar route="deliverables" page_id={params.del_id} links={links} />
      <NavCollapsedMenu
        route="deliverables"
        page_id={params.del_id}
        links={links}
      />
      {children}
    </>
  );
}
