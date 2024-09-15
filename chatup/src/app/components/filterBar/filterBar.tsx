import { filters } from "@/utils/constants/actionLists/filterActions";
import { FC, memo } from "react";
import { FilterBarProps } from "./FilterBar.types";

const FilterBar: FC<FilterBarProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="mx-2">
      <div className="flex items-center gap-2 py-2.5">
        {filters.map((filter) => (
          <button
            key={filter.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-2xl transition-all duration-300 ease-in-out focus:outline-none text-sm font-medium ${
              activeFilter === filter.name
                ? "bg-gray-900 text-slate-100"
                : "bg-slate-800 hover:bg-gradient-to-bl from-slate-600 to-slate-700 text-slate-300"
            }`}
            onClick={() => {
              setActiveFilter(filter.name);
            }}
          >
            {filter.icon}
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(FilterBar);
