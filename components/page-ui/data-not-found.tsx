import Image from 'next/image';
import React from 'react';

export default function DataNotFound({ dataName }: { dataName: string }) {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <Image
        src="/illustrations/not-found/not-found-blank-canvas.svg"
        // src={`/illustrations/not-found/not-found-${dataName}.svg`} // not-found-courses.svg, not-found-deliverables.svg, not-found-submissions.svg
        alt="Data not found."
        width={200}
        height={200}
        className="object-scale-down"
      />
      <h2 className="mt-10 mx-auto text-3xl font-semibold tracking-tight">
        No {dataName} found ...
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-4 text-balance">
        Contact your relevant administrators to add you to your {dataName}.
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-4 text-balance">
        Start by creating a new course.
      </p>
    </div>
  );
}
