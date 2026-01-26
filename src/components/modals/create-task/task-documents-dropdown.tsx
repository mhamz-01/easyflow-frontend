import { singleDoc } from "@/src/types/documents";
import { Dispatch, SetStateAction } from "react";
import { Field, FieldGroup, FieldLabel } from "../../shadcn/field";
import { Checkbox } from "../../shadcn/checkbox";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import Image from "next/image";
import docsIcon from "@/public/icons/docs.svg";
type propsType = {
  filteredDocs: Partial<singleDoc>[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
};

const TaskDocumentDropdown = ({
  filteredDocs,
  isOpen,
  setIsOpen,
}: propsType) => {
  const { setValue, getValues, watch } = useFormContext();

  const isDocumentChecked = (id: number): boolean => {
    const existingDocs = getValues("documents") || [];
    return existingDocs.includes(id);
  };
  const handleSelectDocument = (id: number) => {
    const existingDocs: number[] = getValues("documents") || [];

    const updatedDocs = existingDocs.includes(id)
      ? existingDocs.filter((docId) => docId !== id)
      : [...existingDocs, id];

    setValue("documents", updatedDocs);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute z-50 top-10 mt-1 w-full rounded-md border bg-background shadow">
      {/* Header with close icon */}
      <div className="flex justify-end px-3 py-2 border-b">
        {/* <p className="text-sm font-medium">
          {watch("documents")?.length || 0} document(s) selected
        </p> */}
        <X
          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(false)}
        />
      </div>

      {filteredDocs.length > 0 ? (
        <ul className="max-h-48 overflow-auto">
          {filteredDocs.map((doc) => (
            <FieldGroup
              key={doc.id}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
            >
              <Field orientation="horizontal">
                <FieldLabel htmlFor={`doc-${doc.id}-checkbox`}>
                  <Image
                    src={docsIcon}
                    width={20}
                    height={20}
                    alt="Doc image"
                  />
                  {doc.documentName}
                </FieldLabel>
                <Checkbox
                  id={`doc-${doc.id}-checkbox`}
                  checked={isDocumentChecked(doc.id || 0)}
                  onCheckedChange={() => {
                    if (doc.id) handleSelectDocument(doc.id);
                  }}
                />
              </Field>
            </FieldGroup>
          ))}
        </ul>
      ) : (
        <p className="text-sm px-4 py-3">No result found</p>
      )}
    </div>
  );
};

export default TaskDocumentDropdown;
