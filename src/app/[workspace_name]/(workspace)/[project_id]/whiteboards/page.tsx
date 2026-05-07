import ListingFilters from "@/src/components/custom/listing-filters";
import WhiteboardsListing from "./listing";

const page = () => {
  return (
    <section className="px-4">
      {/* filters */}
      <ListingFilters />
      {/* Whiteboards Listing */}
      <WhiteboardsListing />
    </section>
  );
};

export default page;
