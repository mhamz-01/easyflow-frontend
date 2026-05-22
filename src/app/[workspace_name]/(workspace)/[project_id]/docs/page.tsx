"use client";

import { useState } from "react";
import ListingFilters from "@/src/components/custom/listing-filters";
import DocsListing from "./listing";
import { DateFilter } from "@/src/components/custom/listing-filters/sort-by-select";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    preset: null,
    range: null,
  });
  
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  return (
    <section className="px-4">
      <ListingFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        selectedMembers={selectedMembers}
        onMemberToggle={handleMemberToggle}
      />
      <DocsListing
        isPrivate={activeTab === "private"}
        search={search}
        dateFilter={dateFilter}
        selectedMembers={selectedMembers}
      />
    </section>
  );
};

export default Page;