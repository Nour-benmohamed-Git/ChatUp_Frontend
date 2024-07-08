import SearchField from "@/app/components/searchField/SearchField";
import { FC, memo } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { SearchBarProps } from "./SearchBar.types";

const SearchBar: FC<SearchBarProps> = ({
  setParamToSearch,
  searchResults,
  currentSearchIndex,
  setCurrentSearchIndex,
}) => {
  const handleNavigateSearchResults = (direction: "up" | "down") => {
    if (searchResults.length === 0) return;
    if (direction === "up") {
      setCurrentSearchIndex((prev) => Math.max(prev - 1, 0));
    } else {
      setCurrentSearchIndex((prev) =>
        Math.min(prev + 1, searchResults.length - 1)
      );
    }
  };
  return (
    <div className="flex w-full items-center gap-4 p-4">
      <div className="relative flex-grow">
        <SearchField
          id="search_messages"
          name="search_field"
          placeholder="Search"
          setParamToSearch={setParamToSearch}
        />
        <div className="absolute right-4 bottom-1/2 transform translate-y-1/2 flex items-center gap-2 md:hidden">
          <button
            disabled={!searchResults.length}
            onClick={() => handleNavigateSearchResults("down")}
            className={`p-2 rounded-full transition-colors ${
              searchResults.length
                ? "text-gold-900 hover:text-gold-300"
                : "text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Navigate up"
          >
            <IoIosArrowUp size={20} />
          </button>
          <button
            disabled={!searchResults.length}
            onClick={() => handleNavigateSearchResults("up")}
            className={`p-2 rounded-full transition-colors ${
              searchResults.length
                ? "text-gold-900 hover:text-gold-300"
                : "text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Navigate down"
          >
            <IoIosArrowDown size={20} />
          </button>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2">
        {searchResults.length ? (
          <span className="hidden md:inline-block text-center text-gray-100 text-sm min-w-24 max-w-24 truncate">
            {currentSearchIndex + 1} of {searchResults.length}
          </span>
        ) : null}
        <button
          disabled={!searchResults.length}
          onClick={() => handleNavigateSearchResults("down")}
          className={`p-2 rounded-full transition-colors ${
            searchResults.length
              ? "text-gold-900 hover:text-gold-300"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Navigate up"
        >
          <IoIosArrowUp size={20} />
        </button>
        <button
          disabled={!searchResults.length}
          onClick={() => handleNavigateSearchResults("up")}
          className={`p-2 rounded-full transition-colors ${
            searchResults.length
              ? "text-gold-900 hover:text-gold-300"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Navigate down"
        >
          <IoIosArrowDown size={20} />
        </button>
      </div>
    </div>
  );
};

export default memo(SearchBar);
