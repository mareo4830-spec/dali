import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/menuData';

const INITIAL_FORM_STATE = {
  name: '',
  category: 'copas',
  price: '',
  badge: '',
  subtext: '',
  photo: '',
  neonColor: 'cyan',
  popular: false,
  description: '',
  specsString: '',
};

export default function ItemFormModal({ isOpen, itemToEdit, onClose, onSave, isSaving }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState('');

  const isEditing = Boolean(itemToEdit);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        category: itemToEdit.category || 'copas',
        price: itemToEdit.price || '',
        badge: itemToEdit.badge || '',
        subtext: itemToEdit.subtext || '',
        photo: itemToEdit.photo || '',
        neonColor: itemToEdit.neonColor || 'cyan',
        popular: Boolean(itemToEdit.popular),
        description: itemToEdit.description || '',
        specsString: Array.isArray(itemToEdit.specs) ? itemToEdit.specs.join(', ') : '',
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setError('');
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre de la bebida es obligatorio');
      return;
    }
    if (!formData.price.trim()) {
      setError('El precio es obligatorio (ej. 5€)');
      return;
    }

    // Procesar especificaciones separadas por coma
    const specs = formData.specsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: formData.price.trim(),
      badge: formData.badge.trim(),
      subtext: formData.subtext.trim(),
      photo: formData.photo.trim(),
      neonColor: formData.neonColor,
      popular: formData.popular,
      description: formData.description.trim(),
      specs,
    };

    onSave(payload, itemToEdit?.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSaving ? onClose : undefined}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-2xl bg-[#141414] border border-zinc-800 shadow-2xl z-10 my-auto overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
            <div>
              <h2 className="font-sans font-semibold text-lg text-white">
                {isEditing ? 'Editar Bebida' : 'Añadir Nueva Bebida'}
              </h2>
              <p className="font-sans text-xs text-zinc-400 mt-0.5">
                {isEditing
                  ? 'Modifica los datos de la bebida en Firestore'
                  : 'Añade una nueva referencia a la carta digital'}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Nombre de la bebida <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej. Gin Tonic Hendrick's, Mojito de Fresa..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              {/* Categoría */}
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Categoría <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors capitalize cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label} ({cat.subtitle})
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio */}
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Precio <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="ej. 5€, 8.50€"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              {/* Subtítulo / Subtext */}
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Subtexto corto
                </label>
                <input
                  type="text"
                  value={formData.subtext}
                  onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                  placeholder="ej. Ginebra Premium & Tónica Botánica"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              {/* Badge / Etiqueta */}
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Etiqueta / Badge
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="ej. CÓCTEL DE AUTOR, POP-ART FROZEN"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              {/* Foto (Ruta local o URL) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Ruta de foto o URL de imagen
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="ej. IMAGENES/Mojito de fresa.jpg o URL web"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                  {formData.photo && (
                    <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] border border-zinc-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img
                        src={formData.photo.startsWith('/') ? formData.photo : `/${formData.photo}`}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="font-sans text-[11px] text-zinc-500">
                  Puedes usar imágenes de la carpeta <code className="text-zinc-400">IMAGENES/</code> (ej: IMAGENES/BUBALOO.jpg) o cualquier enlace https.
                </p>
              </div>

              {/* Color Neón de Acento */}
              <div className="space-y-1.5">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Color Neón de acento
                </label>
                <select
                  value={formData.neonColor}
                  onChange={(e) => setFormData({ ...formData, neonColor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors capitalize cursor-pointer"
                >
                  <option value="cyan">Cian Neón (#00f0ff)</option>
                  <option value="magenta">Magenta Neón (#ff0055)</option>
                  <option value="yellow">Amarillo Neón (#eaff00)</option>
                </select>
              </div>

              {/* Popular / Destacado */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-zinc-100 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-zinc-300">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Marcar como Recomendado / Popular</span>
                  </div>
                </label>
              </div>

              {/* Especificaciones / Specs */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Especificaciones (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.specsString}
                  onChange={(e) => setFormData({ ...formData, specsString: e.target.value })}
                  placeholder="ej. Vaso alto, Hielo frappé, Fruta natural"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-sans text-xs font-medium text-zinc-300">
                  Descripción completa
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción detallada de la elaboración, sabor y presentación..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-zinc-800 text-zinc-100 placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-100 text-zinc-900 hover:bg-white transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Actualizar Bebida' : 'Crear Bebida'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
