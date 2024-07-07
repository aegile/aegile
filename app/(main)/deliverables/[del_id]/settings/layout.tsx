import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  params: { del_id: string };
  children: React.ReactNode;
}

export default function SettingsLayout({
  params,
  children,
}: SettingsLayoutProps) {
  const sidebarNavItems = [
    {
      title: "General",
      href: `/deliverables/${params.del_id}/settings`,
    },
    {
      title: "Submissions",
      href: `/deliverables/${params.del_id}/settings/submissions`,
    },
    {
      title: "Advanced",
      href: `/deliverables/${params.del_id}/settings/advanced`,
    },
  ];
  return (
    <div className="flex-grow space-y-6 px-10 pb-16 pt-6">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">
          Deliverable Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage settings and preferences related to this deliverable.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="top-16 -mx-4 w-full self-start lg:sticky lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
