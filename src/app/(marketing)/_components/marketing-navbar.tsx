import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { Button } from "@/src/components/shadcn/button";
import ScrollProgressBar from "./scroll-progress-bar";

const MarketingNavbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <ScrollProgressBar />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="EasyFlow" className="h-7 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-100 md:flex">
          <a href="#showcase" className="transition-colors hover:text-foreground">
            Product
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/sign-up">Get started free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MarketingNavbar;
