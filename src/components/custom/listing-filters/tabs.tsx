"use client";

import { Tabs, TabsList, TabsTrigger } from "../../shadcn/tabs";

interface ListingFilterTabsProps {
  value: "public" | "private";
  onChange: (value: "public" | "private") => void;
}

const ListingFilterTabs = ({ value, onChange }: ListingFilterTabsProps) => {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as "public" | "private")}
      className="w-full max-w-100"
    >
      <TabsList className="bg-transparent gap-5">
        <TabsTrigger
          value="public"
          className="rounded-none border-0 pb-5 font-bold text-muted-foreground shadow-none
            data-[state=active]:shadow-none
            data-[state=active]:border-b
            dark:data-[state=active]:bg-transparent
            dark:data-[state=active]:border-b-primary-blue
            dark:data-[state=active]:text-primary-blue"
        >
          Public
        </TabsTrigger>
        <TabsTrigger
          value="private"
          className="rounded-none border-0 pb-5 font-bold text-muted-foreground shadow-none
            data-[state=active]:shadow-none
            data-[state=active]:border-b
            dark:data-[state=active]:bg-transparent
            dark:data-[state=active]:border-b-primary-blue
            dark:data-[state=active]:text-primary-blue"
        >
          Private
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ListingFilterTabs;