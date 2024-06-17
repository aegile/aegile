import { Separator } from "@/components/ui/separator";

import { RolesPermissionsForm } from "./roles-permissions-form";

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Roles & Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Configure what permissions each role can have.
        </p>
      </div>
      <Separator />
      <RolesPermissionsForm />
    </div>
  );
}
