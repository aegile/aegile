// import { notFound } from "next/navigation";

// import { serverFetch } from "@/lib/server-utils";
import { NavCollapsedMenu, NavMenuBar } from "@/components/custom/nav-menu-bar";

export default async function TutorialsLayout({
  params,
  children,
}: {
  params: { tut_id: string };
  children: React.ReactNode;
}) {
  const links = [
    {
      title: "Home",
      href: "",
      description: "Start here to get an overview of this tutorial.",
    },
    {
      title: "Projects",
      href: "projects",
      description: "Access the tutorial's project groups for each assignment.",
    },
    {
      title: "Members",
      href: "members",
      description: "View and manage tutorial members.",
    },
    {
      title: "Settings",
      href: "settings",
      description: "Customize this tutorial.",
    },
  ];
  return (
    <>
      <NavMenuBar route="tutorials" page_id={params.tut_id} links={links} />
      <NavCollapsedMenu
        route="tutorials"
        page_id={params.tut_id}
        links={links}
      />
      {children}
    </>
  );
}
