import Image, { StaticImageData } from "next/image";
import { ElementType, ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

type TaskPopoverProps = {
  inputName: string;
  Icon?: ElementType;
  imgSrc?: StaticImageData;
  iconClassName?: string;
  children: ReactNode;
};

export default function TaskPopover({
  inputName,
  Icon,
  imgSrc,
  iconClassName,
  children,
}: TaskPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger>
        {Icon && <Icon className={cn("h-4 w-4", iconClassName)} />}
        {imgSrc && (
          <Image src={imgSrc} width={20} height={20} alt="popover icon" />
        )}
        {inputName}
        <ChevronDown />
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
}
