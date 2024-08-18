import debounce from "lodash.debounce";
import { FC, memo, useEffect, useMemo } from "react";
import { MdSearch } from "react-icons/md";
import { SearchFieldProps } from "./SearchField.types";

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
    <div className="flex w-full">
      <div className="flex items-center w-full relative bg-gray-900 h-9 rounded-md pl-16 pr-9">
        <button className="absolute left-4 text-gold-900 rounded-full">
          <MdSearch size={24} />
        </button>
        <input
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={debouncedResults}
          className="w-full bg-gray-900 text-sm outline-none text-slate-200"
        />
      </div>
    </div>
  );
};
export default memo(SearchField);
