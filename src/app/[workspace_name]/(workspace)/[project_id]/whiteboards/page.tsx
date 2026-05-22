'use client'


import ListingFilters from "@/src/components/custom/listing-filters";
import WhiteboardsListing from "./listing";
import { useState } from "react";
import { DateFilter } from "@/src/components/custom/listing-filters/sort-by-select";


const page = () => {
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
      {/* filters */}
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
      {/* Whiteboards Listing */}
      <WhiteboardsListing isPrivate={activeTab === "private"} search={search}  dateFilter={dateFilter}
        selectedMembers={selectedMembers} />
    </section>
  );
};

export default page;
