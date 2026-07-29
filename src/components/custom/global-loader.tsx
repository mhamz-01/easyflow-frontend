import Image from "next/image";
import logo from "@/public/images/logo.png";
import { Spinner } from "@/src/components/shadcn/spinner";

// Full-screen loading state shown while the app resolves auth/workspace
// state before routing the visitor somewhere — used at the root gate and
// anywhere else that needs a top-level "figuring things out" screen.
const GlobalLoader = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Image src={logo} alt="EasyFlow" className="h-8 w-auto animate-pulse" priority />
      <Spinner className="size-5 text-muted-foreground" />
    </div>
  );
};

export default GlobalLoader;
