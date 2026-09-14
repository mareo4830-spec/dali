import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplatterBackground from './components/SplatterBackground';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import QuickFilter from './components/QuickFilter';
import MenuCard from './components/MenuCard';
import ItemDetailModal from './components/ItemDetailModal';
import FooterInfo from './components/FooterInfo';
import { CATEGORIES, MENU_ITEMS } from './data/menuData';
import { RefreshCcw } from 'lucide-react';

export default function App() {
  // Solo 3 apartados: "copas", "cocteles" y "cervezas" (iniciando en "copas")
  const [activeCategory, setActiveCategory] = useState('copas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Contador de elementos por cada uno de los 3 apartados
  const itemCountMap = useMemo(() => {
    return {
      copas: MENU_ITEMS.filter((i) => i.category === 'copas').length,
      cocteles: MENU_ITEMS.filter((i) => i.category === 'cocteles').length,
      cervezas: MENU_ITEMS.filter((i) => i.category === 'cervezas').length,
    };
  }, []);

  // Filtrado reactivo de elementos por apartado y búsqueda
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subtext.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.specs.some((s) => s.toLowerCase().includes(q)) ||
        item.badge.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col justify-between font-sans selection:bg-zinc-800 selection:text-white">
      {/* Fondo liso oscuro sobrio */}
      <SplatterBackground />

      {/* Contenedor Principal */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex-1 flex flex-col">
        {/* Cabecera limpia con el logo */}
        <Header />

        {/* Sección de la Carta */}
        <main className="w-full flex-1 mt-2">
          {/* Selector de Categorías */}
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={(cat) => {
              setActiveCategory(cat);
              setSearchQuery('');
            }}
            itemCountMap={itemCountMap}
          />

          {/* Buscador Rápido */}
          <QuickFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalCount={filteredItems.length}
            activeFilterName={activeCategoryObj.label}
          />

          {/* Título de la Categoría Activa */}
          <div className="w-full max-w-4xl mx-auto flex items-baseline justify-between pb-3 pt-2 border-b border-zinc-900 mb-5">
            <div className="flex items-baseline gap-3">
              <h2 className="font-neon text-2xl sm:text-3xl text-white">
                {activeCategoryObj.label.charAt(0) + activeCategoryObj.label.slice(1).toLowerCase()}
              </h2>
              <span className="font-sans text-xs text-zinc-500 font-medium hidden sm:inline-block">
                — {activeCategoryObj.subtitle}
              </span>
            </div>

            <span className="font-sans text-xs text-zinc-500 font-medium">
              {filteredItems.length} productos
            </span>
          </div>

          {/* Lista de Elementos (Filas Limpias) */}
          {filteredItems.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 max-w-4xl mx-auto"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onSelect={(selected) => setSelectedItem(selected)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Estado sin resultados */
            <div className="bg-[#121212] rounded-xl p-10 text-center max-w-md mx-auto my-12 border border-zinc-800/80">
              <p className="font-sans font-medium text-sm text-zinc-300 mb-2">
                No hay resultados para "{searchQuery}"
              </p>
              <p className="text-xs text-zinc-500 font-sans mb-4">
                Prueba con otro término o restablece los filtros.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('copas');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 font-sans text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Restablecer filtros
              </button>
            </div>
          )}
        </main>

        {/* Pie de Información */}
        <FooterInfo />
      </div>

      {/* Modal Detallado de Producto */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
