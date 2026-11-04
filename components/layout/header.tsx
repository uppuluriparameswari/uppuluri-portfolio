
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
      <Link
        href="/"
        aria-label="Uppuluri Parameswari Home"
        className="group pointer-events-auto select-none focus-visible:outline-none"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={48}
          height={48}
          priority
          className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110 dark:invert"
        />
      </Link>

      <div className="pointer-events-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
