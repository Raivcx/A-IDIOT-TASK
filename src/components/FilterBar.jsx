import React from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({ filter, setFilter }) => {
  const filters = ['Todas', 'Pendentes', 'Concluídas'];

  return (
    <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-2 text-gray-400">
        <Filter size={18} />
        <span className="font-medium text-sm">Filtros:</span>
      </div>
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f 
                ? 'bg-neonCyan text-spaceGray shadow-[0_0_10px_rgba(125,207,255,0.3)]' 
                : 'bg-spaceGray text-gray-400 border border-gray-700 hover:border-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
