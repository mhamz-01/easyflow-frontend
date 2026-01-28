"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/shadcn/breadcrumb";
import Link from "next/link";

type BreadcrumbItemConfig = {
  label: React.ReactNode;
  path: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItemConfig[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isLink = item.path && item.path !== "#";

          return (
            <div key={index} className="flex items-center gap-3">
              <BreadcrumbItem>
                {isLink && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.path}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
