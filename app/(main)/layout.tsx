import { cookies } from 'next/headers';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MenuBar } from '@/components/menu-bar';
import { Users2 } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layout = cookies().get('react-resizable-panels:layout');
  const collapsed = cookies().get('react-resizable-panels:collapsed');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <div className="h-screen">
      <MenuBar
        accounts={[
          { label: 'Alex Xu', email: 'alex@email.com', icon: <Users2 /> },
        ]}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={3}
      >
        {children}
      </MenuBar>
    </div>
  );
}
