"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/shadcn/breadcrumb";
import { Home, Settings } from "lucide-react";
import Link from "next/link";

const SettingsHeaderBreadcrums = () => {
  return (
    <Breadcrumb className="py-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Home size={18} />
          <Link href="/home">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Settings size={18} />
          <BreadcrumbPage className="capitalize">Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SettingsHeaderBreadcrums;
