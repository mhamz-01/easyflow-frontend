import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const MarketingFooter = () => {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="EasyFlow" className="h-6 w-auto" />
        </div>

        <p className="text-sm text-gray-100">
          © {new Date().getFullYear()} EasyFlow. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm text-gray-100">
          <Link href="/sign-in" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className="transition-colors hover:text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
