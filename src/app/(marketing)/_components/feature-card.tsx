import Image from "next/image";
import type { Feature, FeatureAccent } from "../_data/features";
import { Badge } from "@/src/components/shadcn/badge";
import { cn } from "@/src/lib/utils";

const ACCENT_STYLES: Record<FeatureAccent, { chip: string; icon: string }> = {
  blue: { chip: "bg-primary-blue/10", icon: "text-primary-blue" },
  green: { chip: "bg-primary-green/10", icon: "text-primary-green" },
  yellow: { chip: "bg-primary-yellow/10", icon: "text-primary-yellow" },
  pink: { chip: "bg-primary-pink/10", icon: "text-primary-pink" },
};

const FeatureCard = ({ title, description, accent, iconSrc, icon: Icon, badge }: Feature) => {
  const styles = ACCENT_STYLES[accent];

  return (
    <div className="group relative flex h-full flex-col gap-4 rounded-xl border border-border bg-background-200 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-blue/40 hover:shadow-lg hover:shadow-primary-blue/5">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-lg",
            styles.chip,
          )}
        >
          {iconSrc ? (
            <Image src={iconSrc} alt="" className="size-5" />
          ) : Icon ? (
            <Icon className={cn("size-5", styles.icon)} />
          ) : null}
        </div>
        {badge && (
          <Badge variant="outline" className="text-gray-100">
            {badge}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-h1 font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-100">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
