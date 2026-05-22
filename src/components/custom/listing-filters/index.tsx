"use client";

import ListingFilterTabs from "./tabs";
import SortBySelect, { DateFilter } from "./sort-by-select";
import ExpandableSearchInput from "../expandable-search-input";

interface ListingFiltersProps {
  activeTab: "public" | "private";
  onTabChange: (value: "public" | "private") => void;
  search: string;
  onSearchChange: (value: string) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  selectedMembers: number[];
  onMemberToggle: (memberId: number) => void;
}

const ListingFilters = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  selectedMembers,
  onMemberToggle,
}: ListingFiltersProps) => {
  return (
    <div className="flex max-[520px]:flex-col max-[520px]:items-start max-[520px]:space-y-2 items-center justify-between my-5">
      <ListingFilterTabs value={activeTab} onChange={onTabChange} />
      <div className="flex max-[340px]:flex-col max-[340px]:items-start max-[340px]:space-y-2 items-center gap-2">
        <ExpandableSearchInput value={search} onChange={onSearchChange} />
        <SortBySelect
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
          selectedMembers={selectedMembers}
          onMemberToggle={onMemberToggle}
        />
      </div>
    </div>
  );
};

export default ListingFilters;