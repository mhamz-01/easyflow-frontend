import Image, { StaticImageData } from "next/image";
import { ElementType, ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { ChevronDown } from "lucide-react";
import { cn, formatDate } from "@/src/lib/utils";

type TaskPopoverProps = {
  value?: string | Date;
  inputName: string;
  Icon?: ElementType;
  imgSrc?: StaticImageData;
  iconClassName?: string;
  children: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
};

export default function TaskPopover({
  value,
  inputName,
  Icon,
  imgSrc,
  iconClassName,
  children,
  side = "bottom",
}: TaskPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger>
        {Icon && <Icon className={cn("h-4 w-4", iconClassName)} />}
        {imgSrc && (
          <Image src={imgSrc} width={20} height={20} alt="popover icon" />
        )}
        {value
          ? value instanceof Date
            ? formatDate(value)
            : value
          : inputName}
        <ChevronDown />
      </PopoverTrigger>
      <PopoverContent side={side}>{children}</PopoverContent>
    </Popover>
  );
}
