import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export default function ItemDetailModal({ item, onClose }) {
  if (!item) return null;

  // Comprobación de si es una ruta de imagen real o un placeholder
  const isImageFile = Boolean(
    item.photo && (
      item.photo.startsWith('IMAGENES/') ||
      item.photo.startsWith('/IMAGENES/') ||
      /\.(jpg|jpeg|png|webp|svg)$/i.test(item.photo)
    )
  );
  const imageSrc = isImageFile ? (item.photo.startsWith('/') ? item.photo : `/${item.photo}`) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Fondo oscurecido con fade-in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal de dos columnas con fade-in suave y scale: 0.95 a scale: 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl rounded-2xl bg-[#141414] border border-zinc-800 flex flex-col md:flex-row overflow-hidden shadow-2xl z-10 max-h-[92vh]"
        >
          {/* Columna Izquierda (Imagen): Ocupa la mitad del espacio con altura relativa en móvil y fondo #0a0a0a */}
          <div className="w-full md:w-1/2 h-[35vh] sm:h-72 md:h-auto md:min-h-full bg-[#0a0a0a] flex-shrink-0 relative flex items-center justify-center overflow-hidden">
            {isImageFile ? (
              <img
                src={imageSrc}
                alt={item.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center border-b md:border-b-0 md:border-r border-zinc-800/80">
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mb-3 text-zinc-300">
                  <Sparkles className="w-6 h-6 text-zinc-300" />
                </div>
                <span className="font-sans text-sm font-semibold text-zinc-200">
                  {item.photo}
                </span>
                <p className="text-xs text-zinc-500 mt-1 font-sans">
                  Fotografía de presentación
                </p>
              </div>
            )}
          </div>

          {/* Columna Derecha (Texto): Ocupa la otra mitad (w-full md:w-1/2 p-6 flex flex-col justify-center) */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center overflow-y-auto">
            {/* Categoría / Badge y Botón de cerrar superior */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {item.category === 'copas' ? 'Copa' : item.category === 'cocteles' ? 'Cóctel' : 'Cerveza'} {item.badge && `• ${item.badge}`}
              </span>

              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nombre y Precio */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                  {item.name}
                </h2>
                {item.subtext && (
                  <p className="font-sans text-xs text-zinc-400 mt-0.5">
                    {item.subtext}
                  </p>
                )}
              </div>

              <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 font-sans text-sm font-bold text-zinc-100 whitespace-nowrap">
                {item.price}
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-4 mb-4">
              <h4 className="font-sans text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Descripción
              </h4>
              <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Ingredientes Detallados */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-4">
                <h4 className="font-sans text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Ingredientes Detallados
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs font-sans px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Especificaciones adicionales */}
            {item.specs && item.specs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {item.specs.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-sans px-2 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/60 text-zinc-400"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}

            {/* Botón de cerrar */}
            <div className="mt-2 pt-4 border-t border-zinc-800/80">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

