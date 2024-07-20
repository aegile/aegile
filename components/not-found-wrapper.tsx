import React from "react";
import Image from "next/image";

export default function NotFoundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerIsEmpty =
    React.Children.count(children) === 0 ||
    (React.Children.count(children) === 1 &&
      React.isValidElement(children) &&
      React.Children.count(children.props.children) === 0);

  if (containerIsEmpty) {
    return (
      <div className="my-auto flex h-full w-full flex-grow flex-col justify-center text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/illustrations/not-found/not-found-empty-box.svg"
            alt="Data not found."
            width={300}
            height={300}
            className="object-scale-down"
          />
        </div>
        <h3 className="mb-2 text-2xl font-semibold">No items found</h3>
        <p className="text-muted-foreground">
          It looks like there are no items to display. Please try again later.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
