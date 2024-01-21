import { FC, memo } from "react";
import { MdSearch } from "react-icons/md";
import { SearchFieldProps } from "./search-field.types";

const SearchField: FC<SearchFieldProps> = (props) => {
  const { id, name, placeholder, autoComplete } = props;
  return (
    <div className="bg-slate-700 px-2 py-2.5">
      <div className="flex items-center relative bg-gray-900 h-9 rounded-md pl-16 pr-9">
        <button className="absolute left-4 text-gold-900 rounded-full">
          <MdSearch size={24} />
        </button>
        <input
          id={id}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="bg-gray-900 text-sm outline-none text-gray-500"
        />
      </div>
    </div>
  );
};
export default memo(SearchField);
