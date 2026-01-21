import ListingFilters from "@/src/components/custom/listing-filters";
import DocsListing from "./listing";
import { DocsHeader } from "./header";

const page = () => {
  return (
    <section className="px-4">
      <DocsHeader />
      {/* filters */}
      <ListingFilters />
      {/* docs listing */}
      <DocsListing />
    </section>
  );
};

export default page;
