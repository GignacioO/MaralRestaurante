
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { AdminContext } from '../App';
import { Plus, Edit2, Trash2, FileDown, Camera, X, LayoutGrid, List, Search, UtensilsCrossed } from 'lucide-react';
import { APP_VERSION, RESTAURANT_DATA, INITIAL_MENU } from '../constants';

interface EditingItem {
  catId: string;
  idx: number;
  name: string;
  price: string;
  desc: string;
  image?: string;
  hasSide: boolean;
  sideName: string;
  sidePrice: string;
}

const MenuSection: React.FC = () => {
  const admin = useContext(AdminContext);
  const [activeTab, setActiveTab] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (admin?.menu.length && !activeTab) {
      setActiveTab(admin.menu[0].id);
    }
  }, [admin?.menu, activeTab]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results: any[] = [];
    admin?.menu.forEach(cat => {
      cat.items.forEach(item => {
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ ...item, catName: cat.name });
        }
      });
    });
    return results;
  }, [searchQuery, admin?.menu]);

  if (!admin) return null;

  const handleAddItem = (catId: string) => {
    const newItem = { name: 'Nuevo Plato', price: '$0', desc: 'Descripción...', image: '' };
    admin.updateMenu(admin.menu.map(cat => cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat));
  };

  const handlePriceChange = (val: string, isSide = false) => {
    if (!editingItem) return;
    const numbersOnly = val.replace(/\D/g, '');
    const formatted = numbersOnly === '' ? '$' : `$${numbersOnly}`;
    if (isSide) setEditingItem({ ...editingItem, sidePrice: formatted });
    else setEditingItem({ ...editingItem, price: formatted });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const finalPrice = editingItem.price === '$' ? '$0' : editingItem.price;
    const newMenu = admin.menu.map(cat => {
      if (cat.id === editingItem.catId) {
        const newItems = [...cat.items];
        newItems[editingItem.idx] = {
          name: editingItem.name,
          price: finalPrice,
          desc: editingItem.desc,
          image: editingItem.image,
          side: editingItem.hasSide ? { name: editingItem.sideName, price: editingItem.sidePrice } : undefined
        };
        return { ...cat, items: newItems };
      }
      return cat;
    });
    admin.updateMenu(newMenu);
    setEditingItem(null);
  };

  const activeCategory = admin.menu.find(c => c.id === activeTab);

  const renderItem = (item: any, idx: number, catId: string) => {
    const hasSide = !!item.side;
    const sidePriceNum = hasSide ? parseInt(item.side?.price.replace(/\D/g, '') || '0') : 0;
    const mainPriceNum = parseInt(item.price.replace(/\D/g, '') || '0');
    const totalPrice = sidePriceNum > 0 ? `$${mainPriceNum + sidePriceNum}` : item.price;
    const displayName = sidePriceNum === 0 && hasSide ? `${item.name} (con ${item.side.name})` : item.name;

    if (viewMode === 'list') {
      return (
        <div key={idx} className="py-4 border-b border-zinc-900 group relative">
          <div className="flex justify-between items-baseline gap-4">
            <div className="flex-1">
              <h4 className="text-zinc-100 font-bold uppercase tracking-tight text-sm">
                {displayName}
                {sidePriceNum > 0 && <span className="ml-2 text-[10px] text-amber-500 font-normal">+ {item.side.name}</span>}
              </h4>
              <p className="text-zinc-500 text-xs mt-1 font-light italic">{item.desc}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-amber-500 font-serif font-bold">{totalPrice}</span>
              {admin.isAdmin && (
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingItem({ catId, idx, ...item, hasSide: !!item.side, sideName: item.side?.name || '', sidePrice: item.side?.price || '$0' })} className="text-zinc-500 hover:text-amber-500"><Edit2 size={12} /></button>
                  <button onClick={() => admin.updateMenu(admin.menu.map(c => c.id === catId ? {...c, items: c.items.filter((_, i) => i !== idx)} : c))} className="text-zinc-500 hover:text-red-500"><Trash2 size={12} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="group flex gap-4 items-start bg-zinc-900/20 p-4 rounded-sm border border-transparent hover:border-zinc-800 transition-all">
        <div className="w-20 h-20 shrink-0 bg-zinc-800 overflow-hidden">
          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Camera size={20} /></div>}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-bold text-zinc-100 uppercase">{displayName}</h4>
            <span className="text-amber-500 font-bold text-sm">{totalPrice}</span>
          </div>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed italic">{item.desc}</p>
          {sidePriceNum > 0 && <p className="text-[10px] text-amber-500/70 mt-1 uppercase tracking-widest">Incluye {item.side.name}</p>}
          {admin.isAdmin && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditingItem({ catId, idx, ...item, hasSide: !!item.side, sideName: item.side?.name || '', sidePrice: item.side?.price || '$0' })} className="p-1.5 bg-zinc-800 text-amber-500 rounded-sm hover:bg-zinc-700"><Edit2 size={12} /></button>
              <button onClick={() => admin.updateMenu(admin.menu.map(c => c.id === catId ? {...c, items: c.items.filter((_, i) => i !== idx)} : c))} className="p-1.5 bg-zinc-800 text-red-500 rounded-sm hover:bg-zinc-700"><Trash2 size={12} /></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="menu" className="py-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header de Sección con Buscador */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 no-print">
          <div>
            <h2 className="text-3xl font-bold serif flex items-center gap-3">
              <UtensilsCrossed className="text-amber-500" size={24} /> Nuestra Carta
            </h2>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar plato..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs focus:border-amber-500 outline-none transition-all"
              />
            </div>
            <div className="flex bg-zinc-900 p-1 rounded-md border border-zinc-800">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-zinc-500 hover:text-white'}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-zinc-500 hover:text-white'}`}><List size={16} /></button>
            </div>
            <button onClick={() => window.print()} className="p-2 text-zinc-500 hover:text-amber-500 border border-zinc-800 rounded-md" title="Descargar PDF"><FileDown size={18} /></button>
          </div>
        </div>

        {/* Resultados de Búsqueda */}
        {searchQuery && (
          <div className="mb-12 bg-zinc-900/30 p-6 border border-amber-500/20 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-amber-500 mb-4 font-bold">Resultados para: {searchQuery}</h3>
            <div className="grid md:grid-cols-2 gap-x-12">
              {searchResults.length > 0 ? searchResults.map((item, i) => renderItem(item, i, 'search')) : <p className="text-zinc-500 text-xs italic">No se encontraron platos.</p>}
            </div>
          </div>
        )}

        {/* Navegación de Categorías */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 no-print">
          {admin.menu.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full border transition-all ${activeTab === cat.id ? 'bg-amber-600 border-amber-500 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
            >
              {cat.name} {cat.items.length > 0 && <span className="ml-1 opacity-50">({cat.items.length})</span>}
            </button>
          ))}
        </div>

        {/* Grilla de Platos */}
        <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 gap-8' : 'grid-cols-1 gap-0'}`}>
          {activeCategory?.items.map((item, idx) => renderItem(item, idx, activeTab))}
          
          {admin.isAdmin && activeCategory && (
            <button onClick={() => handleAddItem(activeTab)} className="border border-dashed border-zinc-800 p-8 flex flex-col items-center justify-center gap-2 hover:border-amber-500/50 text-zinc-600 hover:text-amber-500 transition-all no-print">
              <Plus size={24} />
              <span className="text-[10px] uppercase font-bold tracking-widest">Nuevo Plato en {activeCategory.name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Modal Pro */}
      {editingItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl p-8 shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold serif text-amber-500 italic">Configuración del Plato</h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Nombre del Plato</label>
                    <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-sm focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Precio Base</label>
                    <input type="text" value={editingItem.price} onChange={e => handlePriceChange(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-sm font-bold text-amber-500 focus:border-amber-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-sm">
                    <label className="flex items-center gap-3 cursor-pointer group mb-4">
                      <input type="checkbox" checked={editingItem.hasSide} onChange={e => setEditingItem({...editingItem, hasSide: e.target.checked})} className="hidden" />
                      <div className={`w-5 h-5 border flex items-center justify-center transition-all ${editingItem.hasSide ? 'bg-amber-600 border-amber-500' : 'border-zinc-700'}`}>
                        {editingItem.hasSide && <Plus size={14} />}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-zinc-300">¿Incluye Guarnición?</span>
                    </label>
                    {editingItem.hasSide && (
                      <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                        <input type="text" placeholder="Ej: Papas Fritas o Ensalada" value={editingItem.sideName} onChange={e => setEditingItem({...editingItem, sideName: e.target.value})} className="w-full bg-black border border-zinc-800 p-2 text-xs outline-none focus:border-amber-500" />
                        <input type="text" placeholder="Precio Extra (o $0)" value={editingItem.sidePrice} onChange={e => handlePriceChange(e.target.value, true)} className="w-full bg-black border border-zinc-800 p-2 text-xs text-amber-500 outline-none focus:border-amber-500" />
                        <p className="text-[9px] text-zinc-500 italic">Si el precio es $0, se mostrará en el título. Si tiene precio, se sumará al total.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Imagen (URL o Archivo)</label>
                <div className="flex gap-2">
                  <input type="text" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} placeholder="https://..." className="flex-1 bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none" />
                  <button onClick={() => fileInputRef.current?.click()} className="bg-zinc-800 px-4 hover:bg-zinc-700"><Camera size={18} /></button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = () => setEditingItem({...editingItem, image: r.result as string});
                      r.readAsDataURL(f);
                    }
                  }} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Descripción</label>
                <textarea value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} rows={2} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-amber-500" />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-zinc-900">
              <button onClick={() => setEditingItem(null)} className="px-6 py-3 text-zinc-500 text-xs font-bold uppercase hover:text-white">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-10 py-3 bg-amber-600 text-white text-xs font-bold uppercase hover:bg-amber-500 shadow-xl shadow-amber-900/20">Aplicar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;
