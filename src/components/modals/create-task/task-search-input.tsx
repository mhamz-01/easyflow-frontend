import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../shadcn/input-group";
import { Dispatch, SetStateAction } from "react";

type propsType = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};
export default function TaskSearchInput({
  search,
  setSearch,
  setIsOpen,
}: propsType) {
  return (
    <InputGroup>
      <InputGroupInput
        placeholder="Search..."
        value={search}
        onFocus={() => setIsOpen && setIsOpen(true)}
        onChange={(e) => setSearch(e.target.value)}
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
