import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav>
        <ul>
          <li>
            <Link href="/main/home">Home</Link>
          </li>
          <li>
            <Link href="/main/about">About</Link>
          </li>
          <li>
            <Link href="/main/contact">Contact</Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
      {children}
    </section>
  );
}
