import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  LogOut,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  Wine,
  GlassWater,
  Beer,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import ItemFormModal from './ItemFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  subscribeToMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  seedDefaultMenuItems,
} from '../../services/menuService';
import { isFirebaseConfigured } from '../../firebase/config';

export default function AdminDashboard({ user, onSignOut }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromFirestore, setIsFromFirestore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSeeding, setIsSeeding] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Suscribirse a Firestore
  useEffect(() => {
    const unsubscribe = subscribeToMenuItems(
      (data, fromFirestore) => {
        setItems(data);
        setIsFromFirestore(fromFirestore);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error cargando menú:', error);
        setFeedback({
          type: 'error',
          message: 'Error al conectar con Firestore: ' + (error.message || 'Verifica la consola.'),
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Limpiar mensaje de feedback tras 4 segundos
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Contadores
  const counts = useMemo(() => {
    return {
      total: items.length,
      copas: items.filter((i) => i.category === 'copas').length,
      cocteles: items.filter((i) => i.category === 'cocteles').length,
      cervezas: items.filter((i) => i.category === 'cervezas').length,
    };
  }, [items]);

  // Filtrado
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.subtext && item.subtext.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Guardar (crear o editar)
  const handleSaveItem = async (itemData, itemId) => {
    setIsSaving(true);
    try {
      if (itemId) {
        await updateMenuItem(itemId, itemData);
        setFeedback({ type: 'success', message: `"${itemData.name}" actualizada con éxito.` });
      } else {
        await addMenuItem(itemData);
        setFeedback({ type: 'success', message: `"${itemData.name}" añadida a la carta.` });
      }
      setIsFormModalOpen(false);
      setItemToEdit(null);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'No se pudo guardar la bebida: ' + (err.message || 'Error desconocido'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Confirmar eliminación
  const handleDeleteItem = async (itemId) => {
    setIsDeleting(true);
    try {
      await deleteMenuItem(itemId);
      setFeedback({ type: 'success', message: 'Bebida eliminada de la base de datos.' });
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'No se pudo eliminar la bebida: ' + (err.message || 'Error desconocido'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Sembrar datos iniciales si está vacía la colección
  const handleSeedData = async () => {
    if (!window.confirm('¿Deseas migrar todas las 13 bebidas originales de Dalí Bar a Firestore?')) {
      return;
    }
    setIsSeeding(true);
    try {
      const count = await seedDefaultMenuItems();
      setFeedback({
        type: 'success',
        message: `¡Se han migrado exitosamente ${count} bebidas a Firestore!`,
      });
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'Error al migrar datos: ' + (err.message || 'Verifica permisos de Firestore'),
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'copas':
        return <Wine className="w-3.5 h-3.5" />;
      case 'cocteles':
        return <GlassWater className="w-3.5 h-3.5" />;
      case 'cervezas':
        return <Beer className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Dalí Bar"
              className="w-9 h-9 object-contain mix-blend-screen"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-neon text-lg text-white">Dalí Bar</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-[10px] font-sans font-medium text-zinc-300">
                  Panel de Administración
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans hidden sm:block">
                Gestión de carta en tiempo real (Firestore)
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Carta Pública</span>
            </Link>

            <button
              onClick={onSignOut}
              title="Cerrar sesión"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/20 border border-red-900/30 text-xs font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Banner de estado de Firestore */}
        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-sans flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Configuración de Firebase pendiente</p>
              <p className="mt-0.5 text-amber-200/80">
                Añade las credenciales de tu proyecto Firebase en el archivo <code className="px-1.5 py-0.5 bg-black/40 rounded text-amber-300">.env</code> para habilitar la sincronización en vivo y la persistencia en la nube. Mientras tanto, se muestran los datos locales de reserva.
              </p>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-sans flex items-center gap-3 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Stats & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-white">
              Gestión de Carta
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-400 font-sans">
                {user?.email ? `Conectado como ${user.email}` : 'Sesión activa'}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                <span className={`w-2 h-2 rounded-full ${isFromFirestore ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {isFromFirestore ? 'Firestore en vivo' : 'Memoria local'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {isFirebaseConfigured && items.length === 0 && !isLoading && (
              <button
                type="button"
                onClick={handleSeedData}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-colors"
              >
                <Database className="w-4 h-4 text-cyan-400" />
                <span>{isSeeding ? 'Migrando...' : 'Cargar Carta Inicial'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setItemToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-100 text-zinc-900 hover:bg-white transition-all shadow-[0_2px_12px_rgba(255,255,255,0.1)]"
            >
              <Plus className="w-4 h-4 text-zinc-900" />
              <span>Añadir Bebida</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-[#121212] border border-zinc-800/80">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Total Bebidas
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {counts.total}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                Copas
              </span>
              <Wine className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <span className="text-2xl font-bold text-white mt-1 block">
              {counts.copas}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                Cócteles
              </span>
              <GlassWater className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <span className="text-2xl font-bold text-white mt-1 block">
              {counts.cocteles}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                Cervezas
              </span>
              <Beer className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <span className="text-2xl font-bold text-white mt-1 block">
              {counts.cervezas}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#121212] border border-zinc-800/80 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todas ({counts.total})
            </button>
            <button
              onClick={() => setSelectedCategory('copas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'copas'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Copas ({counts.copas})
            </button>
            <button
              onClick={() => setSelectedCategory('cocteles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'cocteles'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Cócteles ({counts.cocteles})
            </button>
            <button
              onClick={() => setSelectedCategory('cervezas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'cervezas'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Cervezas ({counts.cervezas})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#121212] border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs font-sans focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
        </div>

        {/* Product Items Table / List */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-500 text-sm">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin mx-auto mb-3" />
            <span>Cargando bebidas de la base de datos...</span>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              const hasPhoto = Boolean(item.photo && !item.photo.includes('[INSERTAR FOTO]'));
              const photoSrc = hasPhoto
                ? item.photo.startsWith('/')
                  ? item.photo
                  : `/${item.photo}`
                : null;

              return (
                <div
                  key={item.id}
                  className="group p-3.5 sm:p-4 rounded-xl bg-[#121212] border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Info Left */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-[#0a0a0a] border border-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {photoSrc ? (
                        <img
                          src={photoSrc}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-sans font-semibold text-sm text-zinc-100">
                          {item.name}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
                          {getCategoryIcon(item.category)}
                          {item.category}
                        </span>
                        {item.popular && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-sans font-medium">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 truncate">
                        {item.subtext && <span className="truncate">{item.subtext}</span>}
                        {item.badge && (
                          <>
                            <span>•</span>
                            <span className="text-zinc-400">{item.badge}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price Right */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                    <span className="font-sans font-semibold text-sm sm:text-base text-zinc-100 tabular-nums px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800/80">
                      {item.price}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setItemToEdit(item);
                          setIsFormModalOpen(true);
                        }}
                        title="Editar bebida"
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Eliminar bebida"
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="py-16 text-center rounded-2xl bg-[#121212] border border-zinc-800/80 p-8 max-w-lg mx-auto">
            <p className="font-sans font-medium text-sm text-zinc-300 mb-1">
              No se encontraron bebidas
            </p>
            <p className="text-xs text-zinc-500 font-sans mb-5">
              {searchQuery
                ? `No hay coincidencias para "${searchQuery}".`
                : 'Aún no hay bebidas registradas en esta categoría.'}
            </p>
            <button
              onClick={() => {
                setItemToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-900 text-xs font-semibold hover:bg-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir primera bebida</span>
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <ItemFormModal
        isOpen={isFormModalOpen}
        itemToEdit={itemToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setItemToEdit(null);
        }}
        onSave={handleSaveItem}
        isSaving={isSaving}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        item={itemToDelete}
        onConfirm={handleDeleteItem}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}
