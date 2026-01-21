import { Tabs, TabsList, TabsTrigger } from "../../shadcn/tabs";

const ListingFilterTabs = () => {
  return (
    <Tabs defaultValue="public" className="w-full max-w-[400px]">
      <TabsList className="bg-transparent gap-5">
        <TabsTrigger
          value="public"
          className="rounded-none border-0 pb-5 font-bold text-white
            dark:data-[state=active]:bg-transparent
            dark:data-[state=active]:border-b
            dark:data-[state=active]:border-b-primary-blue
            dark:data-[state=active]:text-primary-blue"
        >
          Public
        </TabsTrigger>

        <TabsTrigger
          value="private"
          className="rounded-none border-0 pb-5 font-bold text-white
            dark:data-[state=active]:bg-transparent
            dark:data-[state=active]:border-b
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
