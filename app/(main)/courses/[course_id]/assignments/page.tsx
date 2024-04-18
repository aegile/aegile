import { cookies } from 'next/headers';
import Image from 'next/image';

import { Mail } from './_components/mail';
import { mails } from './data';

export default function CourseAssignmentPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Mail
          accounts={[]}
          mails={mails}
          defaultLayout={[50, 655]}
          defaultCollapsed={false}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
