import { useState } from 'react';

const FilterBar = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Unread', 'Groups'];

  return (
    <div className="mx-2"> 
      <div className="flex items-center gap-2 py-2.5">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn px-4 py-2 rounded-md focus:outline-none font-medium ${
              activeFilter === filter
                ? 'bg-gray-900 text-slate-200'
                : 'bg-gray-800 hover:bg-gray-800 text-slate-400'
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;