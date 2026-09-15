import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, item, onConfirm, onCancel, isDeleting }) {
  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isDeleting ? onCancel : undefined}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-2xl bg-[#141414] border border-zinc-800 p-6 shadow-2xl z-10 select-none"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h3 className="font-sans font-semibold text-lg text-white mb-1">
                ¿Eliminar bebida?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Estás a punto de eliminar <span className="text-zinc-200 font-medium font-sans">"{item.name}"</span> ({item.category}). Esta acción se reflejará inmediatamente en la carta digital y no se puede deshacer.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              disabled={isDeleting}
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onConfirm(item.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-red-600/90 text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <span>Eliminar bebida</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
