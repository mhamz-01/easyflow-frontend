import Image, { type StaticImageData } from "next/image";
import { cn } from "@/src/lib/utils";

type AppPreviewFrameProps = {
  screenshotSrc?: StaticImageData | string;
  screenshotAlt?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
};

// Drop a real product screenshot in via `screenshotSrc` — everything else
// (browser chrome, glow, border) stays as-is.
const AppPreviewFrame = ({
  screenshotSrc,
  screenshotAlt = "EasyFlow workspace",
  fit = "cover",
  priority = false,
  // Frame never renders wider than max-w-5xl (64rem/1024px); without an
  // explicit `sizes`, next/image assumes 100vw and fetches a full-viewport-
  // width image on large monitors even though the frame is capped.
  sizes = "(min-width: 1024px) 1024px, 100vw",
}: AppPreviewFrameProps) => {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(13,142,255,0.25),transparent)] blur-2xl"
      />

      <div className="overflow-hidden rounded-xl border border-border bg-background-200 shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-primary-pink/70" />
          <span className="size-2.5 rounded-full bg-primary-yellow/70" />
          <span className="size-2.5 rounded-full bg-primary-green/70" />
        </div>

        <div className="relative aspect-[16/10] w-full bg-background">
          {screenshotSrc ? (
            <Image
              src={screenshotSrc}
              alt={screenshotAlt}
              fill
              sizes={sizes}
              quality={70}
              className={cn(fit === "cover" ? "object-cover object-top" : "object-contain")}
              priority={priority}
              loading={priority ? undefined : "lazy"}
            />
          ) : (
            <div className="flex h-full w-full flex-col gap-3 p-6">
              <div className="flex gap-3">
                <div className="h-24 w-40 shrink-0 rounded-lg border border-border bg-background-200" />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="h-3 w-2/3 rounded bg-background-200" />
                  <div className="h-3 w-1/2 rounded bg-background-200" />
                  <div className="h-3 w-5/6 rounded bg-background-200" />
                </div>
              </div>
              <div className="grid flex-1 grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-background-200" />
                <div className="rounded-lg border border-border bg-background-200" />
                <div className="rounded-lg border border-border bg-background-200" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppPreviewFrame;
