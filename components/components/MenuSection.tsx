
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { AdminContext } from '../App';
import { Plus, Edit2, Trash2, FileDown, Camera, X, LayoutGrid, List, Search, UtensilsCrossed } from 'lucide-react';

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

  useEffect(() => {
    if (admin?.menu.length && !activeTab) {
      setActiveTab(admin.menu[0].id);
    }
  }, [admin?.menu, activeTab]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results: any[] = [];
    admin?.menu.forEach(cat => {
      cat.items.forEach((item, idx) => {
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ ...item, catId: cat.id, idx });
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

  // ESTA FUNCIÓN CUMPLE EL REQUISITO DE BORRAR AL CLICKEAR
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof EditingItem) => {
    if (!editingItem) return;
    const val = String(editingItem[field]);
    const defaults = ['Nuevo Plato', '$0', 'Descripción...', 'Ej: Papas Fritas o Ensalada', '$'];
    
    if (defaults.includes(val) || val.trim() === '') {
      setEditingItem({ ...editingItem, [field]: field === 'price' || field === 'sidePrice' ? '$' : '' });
    } else {
      e.target.select();
    }
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
    const finalPrice = (editingItem.price === '$' || editingItem.price === '') ? '$0' : editingItem.price;
    const newMenu = admin.menu.map(cat => {
      if (cat.id === editingItem.catId) {
        const newItems = [...cat.items];
        newItems[editingItem.idx] = {
          name: editingItem.name || 'Sin nombre',
          price: finalPrice,
          desc: editingItem.desc,
          image: editingItem.image,
          side: editingItem.hasSide ? { 
            name: editingItem.sideName || 'Guarnición', 
            price: editingItem.sidePrice === '$' ? '$0' : editingItem.sidePrice 
          } : undefined
        };
        return { ...cat, items: newItems };
      }
      return cat;
    });
    admin.updateMenu(newMenu);
    setEditingItem(null);
  };

  const renderItem = (item: any, idx: number, catId: string) => {
    const hasSide = !!item.side;
    const sidePriceNum = hasSide ? parseInt(item.side?.price.replace(/\D/g, '') || '0') : 0;
    const mainPriceNum = parseInt(item.price.replace(/\D/g, '') || '0');
    const totalPrice = sidePriceNum > 0 ? `$${mainPriceNum + sidePriceNum}` : item.price;
    const displayName = sidePriceNum === 0 && hasSide ? `${item.name} (con ${item.side.name})` : item.name;

    if (viewMode === 'list') {
      return (
        <div key={`${catId}-${idx}`} className="py-4 border-b border-zinc-900 group relative">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center w-full">
                <h4 className="text-zinc-100 font-bold uppercase tracking-tight text-sm">
                  {displayName}
                  {sidePriceNum > 0 && <span className="ml-2 text-[10px] text-amber-500 font-normal tracking-wider">+ {item.side.name}</span>}
                </h4>
                <span className="text-amber-500 font-serif font-bold whitespace-nowrap ml-4">{totalPrice}</span>
              </div>
              <p className="text-zinc-500 text-xs mt-1 font-light italic">{item.desc}</p>
            </div>
            {admin.isAdmin && (
              <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity self-center no-print">
                <button onClick={() => setEditingItem({ catId, idx, ...item, hasSide: !!item.side, sideName: item.side?.name || '', sidePrice: item.side?.price || '$0' })} className="text-zinc-500 hover:text-amber-500"><Edit2 size={12} /></button>
                <button onClick={() => admin.updateMenu(admin.menu.map(c => c.id === catId ? {...c, items: c.items.filter((_, i) => i !== idx)} : c))} className="text-zinc-500 hover:text-red-500"><Trash2 size={12} /></button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={`${catId}-${idx}`} className="group flex gap-4 items-start bg-zinc-900/20 p-4 rounded-sm border border-transparent hover:border-zinc-800 transition-all">
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
            <div className="mt-3 flex gap-2 no-print">
              <button onClick={() => setEditingItem({ catId, idx, ...item, hasSide: !!item.side, sideName: item.side?.name || '', sidePrice: item.side?.price || '$0' })} className="p-1.5 bg-zinc-800 text-amber-500 rounded-sm hover:bg-zinc-700"><Edit2 size={12} /></button>
              <button onClick={() => admin.updateMenu(admin.menu.map(c => c.id === catId ? {...c, items: c.items.filter((_, i) => i !== idx)} : c))} className="p-1.5 bg-zinc-800 text-red-500 rounded-sm hover:bg-zinc-700"><Trash2 size={12} /></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const activeCategory = admin.menu.find(c => c.id === activeTab);

  return (
    <section id="menu" className="py-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4">
        {/* BUSCADOR Y CONTROLES */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 no-print">
          <h2 className="text-3xl font-bold serif flex items-center gap-3">
            <UtensilsCrossed className="text-amber-500" size={24} /> Nuestra Carta
          </h2>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Escribe el nombre del plato..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 outline-none transition-all placeholder:text-zinc-600"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 shadow-2xl z-50 max-h-64 overflow-y-auto rounded-sm border-t-amber-500 border-t-2">
                  {searchResults.length > 0 ? searchResults.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors group">
                      <span className="text-xs text-zinc-300 font-bold uppercase group-hover:text-white">{item.name}</span>
                      <span className="text-xs text-amber-500 font-bold ml-4">{item.price}</span>
                    </div>
                  )) : (
                    <div className="p-4 text-xs text-zinc-500 italic text-center">No se encontraron resultados</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex bg-zinc-900 p-1 rounded-sm border border-zinc-800">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-zinc-500 hover:text-white'}`} title="Con Fotos"><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-sm transition-all ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-zinc-500 hover:text-white'}`} title="Sin Fotos"><List size={16} /></button>
            </div>

            <button onClick={() => window.print()} className="p-2 text-zinc-500 hover:text-amber-500 border border-zinc-800 rounded-sm" title="Guardar PDF">
              <FileDown size={18} />
            </button>
          </div>
        </div>

        {/* TABS DE CATEGORÍAS */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 no-print">
          {admin.menu.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full border transition-all ${activeTab === cat.id ? 'bg-amber-600 border-amber-500 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* LISTADO DINÁMICO */}
        <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 gap-8' : 'grid-cols-1 gap-0'}`}>
          {activeCategory?.items.length ? activeCategory.items.map((item, idx) => renderItem(item, idx, activeTab)) : (
            <div className="col-span-full py-12 text-center text-zinc-600 italic text-sm">
              Esta categoría se encuentra vacía.
            </div>
          )}
          
          {admin.isAdmin && activeCategory && (
            <button onClick={() => handleAddItem(activeTab)} className="border border-dashed border-zinc-800 p-8 flex flex-col items-center justify-center gap-2 hover:border-amber-500/50 text-zinc-600 hover:text-amber-500 transition-all no-print rounded-sm">
              <Plus size={24} />
              <span className="text-[10px] uppercase font-bold tracking-widest">Añadir Plato</span>
            </button>
          )}
        </div>
      </div>

      {/* EDITOR MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl p-8 shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold serif text-amber-500 italic">Editor del Menú</h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Nombre del Plato</label>
                    <input type="text" value={editingItem.name} onFocus={(e) => handleInputFocus(e, 'name')} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-sm focus:border-amber-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Precio Base</label>
                    <input type="text" value={editingItem.price} onFocus={(e) => handleInputFocus(e, 'price')} onChange={e => handlePriceChange(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-sm font-bold text-amber-500 focus:border-amber-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-sm">
                    <label className="flex items-center gap-3 cursor-pointer group mb-4">
                      <input type="checkbox" checked={editingItem.hasSide} onChange={e => setEditingItem({...editingItem, hasSide: e.target.checked})} className="hidden" />
                      <div className={`w-5 h-5 border flex items-center justify-center transition-all ${editingItem.hasSide ? 'bg-amber-600 border-amber-500' : 'border-zinc-700'}`}>
                        {editingItem.hasSide && <Plus size={14} className="text-white" />}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-zinc-300 group-hover:text-amber-500">¿Lleva Guarnición?</span>
                    </label>
                    {editingItem.hasSide && (
                      <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                        <input type="text" placeholder="Ej: Papas Fritas o Ensalada" value={editingItem.sideName} onFocus={(e) => handleInputFocus(e, 'sideName')} onChange={e => setEditingItem({...editingItem, sideName: e.target.value})} className="w-full bg-black border border-zinc-800 p-2 text-xs outline-none focus:border-amber-500" />
                        <input type="text" placeholder="Precio Extra (o $0)" value={editingItem.sidePrice} onFocus={(e) => handleInputFocus(e, 'sidePrice')} onChange={e => handlePriceChange(e.target.value, true)} className="w-full bg-black border border-zinc-800 p-2 text-xs text-amber-500 outline-none focus:border-amber-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">URL de la Imagen</label>
                <input type="text" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-amber-500" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 tracking-widest">Descripción</label>
                <textarea value={editingItem.desc} onFocus={(e) => handleInputFocus(e, 'desc')} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} rows={2} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-amber-500 resize-none" />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-zinc-900">
              <button onClick={() => setEditingItem(null)} className="px-6 py-3 text-zinc-500 text-xs font-bold uppercase hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-10 py-3 bg-amber-600 text-white text-xs font-bold uppercase hover:bg-amber-500 shadow-xl shadow-amber-900/20 transition-all active:scale-95">Aplicar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;
