import ListingFilters from "@/src/components/custom/listing-filters";
import DocsListing from "./listing";

const page = () => {
  return (
    <section className="px-4">
      {/* filters */}
      <ListingFilters />
      {/* docs listing */}
      <DocsListing />
    </section>
  );
};

export default page;
