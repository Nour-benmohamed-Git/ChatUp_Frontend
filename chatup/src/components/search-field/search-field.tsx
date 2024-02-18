import debounce from "lodash.debounce";
import { FC, memo, useEffect, useMemo } from "react";
import { MdSearch } from "react-icons/md";
import { SearchFieldProps } from "./search-field.types";

const SearchField: FC<SearchFieldProps> = (props) => {
  const { id, name, placeholder, setParamToSearch } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setParamToSearch && setParamToSearch(value);
  };
  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);
  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  }, []);
  return (
    <div className="px-2 py-2.5">
      <div className="flex items-center relative bg-gray-900 h-9 rounded-md pl-16 pr-9">
        <button className="absolute left-4 text-gold-900 rounded-full">
          <MdSearch size={24} />
        </button>
        <input
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={debouncedResults}
          className="bg-gray-900 text-sm outline-none text-slate-400"
        />
      </div>
    </div>
  );
};
export default memo(SearchField);
