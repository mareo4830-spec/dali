import React from 'react';
import { Search, X } from 'lucide-react';

export default function QuickFilter({ searchQuery, setSearchQuery, totalCount, activeFilterName }) {
  return (
    <div className="w-full max-w-xl mx-auto px-3 mb-5">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-zinc-500 pointer-events-none flex items-center">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Buscar en ${activeFilterName.toLowerCase()}...`}
          className="w-full pl-10 pr-12 py-2 rounded-lg bg-[#141414] border border-zinc-800 text-zinc-200 placeholder-zinc-500 font-sans text-xs sm:text-sm focus:outline-none focus:border-zinc-600 transition-colors"
        />

        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1 rounded-md text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-3.5 font-sans font-medium text-[11px] text-zinc-500 pointer-events-none">
            {totalCount} items
          </div>
        )}
      </div>
    </div>
  );
}
