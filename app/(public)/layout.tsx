import Link from "next/link";
import Image from "next/image";
import gistrLogo from "../images/icon-48.png";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="p-4 max-w-md mx-auto min-h-screen flex flex-col">
      <Link href="/" className="mt-8 self-center">
        <h2 className="flex items-center">
          <Image
            src={gistrLogo}
            className="mr-1 flex-shrink-0"
            alt="Gistr Logo"
            width="48"
            height="48"
          />
          <span className="text-4xl font-bold">Gistr</span>
        </h2>
      </Link>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
