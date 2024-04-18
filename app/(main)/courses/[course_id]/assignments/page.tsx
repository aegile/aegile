import { cookies } from 'next/headers';
import Image from 'next/image';

import { Mail } from './_components/mail';
import { mails } from './data';

export default function CourseAssignmentPage() {
  return (
    // <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 grid-flow-row">
    <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8">
      {/* <div className="hidden flex-col md:flex"> */}
      <Mail
        accounts={[]}
        mails={mails}
        defaultLayout={[50, 655]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
      {/* </div> */}
    </main>
  );
}
