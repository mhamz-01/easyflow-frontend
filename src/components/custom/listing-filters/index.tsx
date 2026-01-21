"use client";

import ListingFilterTabs from "./tabs";
import SortBySelect from "./sort-by-select";
import ExpandableSearchInput from "../expandable-search-input";

const ListingFilters = () => {
  return (
    <div className="flex max-[520px]:flex-col max-[520px]:items-start max-[520px]:space-y-2 items-center justify-between my-5">
      {/* Tabs */}
      <ListingFilterTabs />
      <div className="flex max-[340px]:flex-col max-[340px]:items-start max-[340px]:space-y-2 items-center gap-2">
        {/* Search */}
        <ExpandableSearchInput />
        {/* Filters */}
        <SortBySelect />
      </div>
    </div>
  );
};

export default ListingFilters;
