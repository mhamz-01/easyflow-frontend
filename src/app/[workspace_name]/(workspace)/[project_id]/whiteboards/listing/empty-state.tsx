import { Button } from "@/src/components/shadcn/button";

const DocsListingEmptyState = () => {
  return (
    <div className="p-6 border rounded-md space-y-1">
      <h1 className="text-h1 font-medium">No Whiteboards created yet.</h1>
      <p className="text-sm mb-4">
        Create your first whiteboard and share it with your team
      </p>
      <Button variant={"primary"}>Create New Whiteboard</Button>
    </div>
  );
};

export default DocsListingEmptyState;
