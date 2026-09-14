import React from 'react';
import { motion } from 'framer-motion';
import { Wine, GlassWater, Beer } from 'lucide-react';

export default function CategoryTabs({ categories, activeCategory, setActiveCategory }) {
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'copas':
        return <Wine className="w-4 h-4" />;
      case 'cocteles':
        return <GlassWater className="w-4 h-4" />;
      case 'cervezas':
        return <Beer className="w-4 h-4" />;
      default:
        return <GlassWater className="w-4 h-4" />;
    }
  };

  return (
    <div className="sticky top-3 z-30 w-full max-w-xl mx-auto px-3 my-4">
      {/* Contenedor elegante y sobrio */}
      <div className="bg-[#121212] rounded-xl p-1 border border-zinc-800/80 shadow-lg backdrop-blur-md">
        <div className="grid grid-cols-3 gap-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {/* Pastilla animada activa sobria */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-lg bg-zinc-800/90 border border-zinc-700 shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}

                <span className={`transition-colors ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`}>
                  {getCategoryIcon(cat.id)}
                </span>

                <span className={`font-sans text-xs sm:text-sm tracking-wide transition-colors ${
                  isActive ? 'font-semibold text-white' : 'font-medium'
                }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
