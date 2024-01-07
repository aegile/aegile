import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

const images = [
  '/pages/hero-library.jpg',
  '/pages/hero-lecture.jpg',
  '/pages/hero-tutorial.jpg',
];

type PageProps = {
  pageName: string;
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative h-dvh h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <Image
          src={images[Math.floor(Math.random() * images.length)]}
          width={1920}
          height={1080}
          alt="Authentication"
          className="absolute h-full inset-0 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/aegile-horizontal-text.svg"
            width={125}
            height={50}
            alt="aegile logo with text on the right of the logo"
            className="filter brightness-110"
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut
              voluptatibus cumque maxime itaque quod ullam illo vitae porro iste
              suscipit laborum, molestiae at sapiente facere repellendus,
              officiis quae repudiandae maiores?&rdquo;
            </p>
            <footer className="text-sm">John Smith</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">{children}</div>
    </div>
  );
}
