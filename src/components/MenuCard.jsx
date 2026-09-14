import React from 'react';
import { motion } from 'framer-motion';

export default function MenuCard({ item, onSelect }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={() => onSelect(item)}
      className="group relative w-full py-3.5 px-4 sm:px-5 rounded-xl bg-[#121212] border border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-900/70 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_12px_rgba(0,240,255,0.08)] cursor-pointer flex items-center justify-between gap-3 transition-all duration-200 select-none"
    >
      {/* Nombre del producto a la izquierda */}
      <div className="flex items-baseline gap-2 min-w-0 pr-1">
        <span className="font-sans font-medium text-sm sm:text-base text-zinc-200 group-hover:text-white transition-colors truncate">
          {item.name}
        </span>
        {item.subtext && (
          <span className="font-sans text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors hidden sm:inline truncate">
            ({item.subtext})
          </span>
        )}
      </div>

      {/* Línea de puntos sutil entre el nombre y el precio */}
      <div className="flex-1 mx-2 border-b border-dotted border-zinc-800 group-hover:border-zinc-600/80 transition-colors min-w-[20px]" />

      {/* Precio a la derecha */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-sans font-semibold text-sm sm:text-base text-zinc-100 group-hover:text-white transition-colors tabular-nums">
          {item.price}
        </span>
      </div>
    </motion.div>
  );
}

