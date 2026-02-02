
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { AdminContext } from '../App';
import { Plus, Edit2, Trash2, FileDown, Camera, X, LayoutGrid, List, Search, UtensilsCrossed, ArrowRight, CheckCircle2, Sparkles, ShieldAlert } from 'lucide-react';

interface EditingItem {
  catId: string;
  idx: number;
  isExtra: boolean;
  name: string;
  price: string;
  desc: string;
  image?: string;
}

const MenuSection: React.FC = () => {
  const admin = useContext(AdminContext);
  const [activeTab, setActiveTab] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (admin?.menu.length && !activeTab) {
      setActiveTab(admin.menu[0].id);
    }
  }, [admin?.menu, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getExtraLabel = (catId: string) => {
    if (catId === 'pastas') return 'Salsas Artesanales';
    if (catId === 'minutas') return 'Guarniciones';
    return 'Adicionales';
  };

  const getExtraItemPrefix = (catId: string) => {
    if (catId === 'pastas') return 'Salsa';
    if (catId === 'minutas') return 'Guarnición';
    return 'Extra';
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results: any[] = [];
    admin?.menu.forEach(cat => {
      cat.items.forEach((item, idx) => {
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ ...item, catId: cat.id, categoryName: cat.name, idx, isExtra: false });
        }
      });
      cat.extras?.forEach((item, idx) => {
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ ...item, catId: cat.id, categoryName: `${cat.name} (${getExtraItemPrefix(cat.id)})`, idx, isExtra: true });
        }
      });
    });
    return results;
  }, [searchQuery, admin?.menu]);

  if (!admin) return null;

  const handleAddItem = (catId: string, isExtra: boolean = false) => {
    const defaultName = isExtra ? `Nueva ${getExtraItemPrefix(catId)}` : 'Nuevo Plato';
    const newItem = { name: defaultName, price: '$0', desc: 'Descripción...', image: '' };
    
    let newIdx = 0;
    const newMenu = admin.menu.map(cat => {
      if (cat.id === catId) {
        if (isExtra) {
          const currentExtras = cat.extras || [];
          newIdx = currentExtras.length;
          return { ...cat, extras: [...currentExtras, newItem] };
        }
        newIdx = cat.items.length;
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    });
    
    admin.updateMenu(newMenu);

    setEditingItem({
      catId,
      idx: newIdx,
      isExtra,
      ...newItem
    });
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof EditingItem) => {
    if (!editingItem) return;
    const val = String(editingItem[field as keyof EditingItem]);
    const defaults = ['Nuevo Plato', 'Nueva Salsa', 'Nueva Guarnición', '$0', 'Descripción...', '$'];
    
    if (defaults.includes(val) || val.trim() === '') {
      setEditingItem({ ...editingItem, [field]: field === 'price' ? '$' : '' });
    } else {
      e.target.select();
    }
  };

  const handlePriceChange = (val: string) => {
    if (!editingItem) return;
    const numbersOnly = val.replace(/\D/g, '');
    const formatted = numbersOnly === '' ? '$' : `$${numbersOnly}`;
    setEditingItem({ ...editingItem, price: formatted });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const finalPrice = (editingItem.price === '$' || editingItem.price === '') ? '$0' : editingItem.price;
    const newMenu = admin.menu.map(cat => {
      if (cat.id === editingItem.catId) {
        if (editingItem.isExtra) {
          const newExtras = [...(cat.extras || [])];
          newExtras[editingItem.idx] = {
            name: editingItem.name || 'Sin nombre',
            price: finalPrice,
            desc: editingItem.desc
          };
          return { ...cat, extras: newExtras };
        } else {
          const newItems = [...cat.items];
          newItems[editingItem.idx] = {
            name: editingItem.name || 'Sin nombre',
            price: finalPrice,
            desc: editingItem.desc,
            image: editingItem.image,
            side: undefined // Eliminamos cualquier rastro de acompañamiento incluido
          };
          return { ...cat, items: newItems };
        }
      }
      return cat;
    });
    admin.updateMenu(newMenu);
    setEditingItem(null);
  };

  const renderItem = (item: any, idx: number, catId: string, isExtra: boolean = false) => {
    const priceDisplay = item.price;
    
    if (isExtra) {
      return (
        <div key={`extra-${catId}-${idx}`} className="py-4 px-4 bg-zinc-900/20 border-b border-zinc-900 group relative flex justify-between items-center transition-all hover:bg-zinc-900/40">
          <div className="flex-1">
            <div className="flex justify-between items-center w-full">
              <h5 className="text-zinc-200 font-bold uppercase tracking-widest text-[11px] flex items-center gap-2">
                <Sparkles size={10} className="text-amber-500/50" /> {item.name}
              </h5>
              <div className="flex items-center gap-4">
                <span className="text-amber-500 font-serif font-bold text-sm">{priceDisplay}</span>
                {admin.isAdmin && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                    <button onClick={() => setEditingItem({ catId, idx, isExtra: true, ...item })} className="text-zinc-600 hover:text-amber-500 p-1"><Edit2 size={12} /></button>
                    <button onClick={() => admin.updateMenu(admin.menu.map(c => c.id === catId ? {...c, extras: c.extras?.filter((_, i) => i !== idx)} : c))} className="text-zinc-600 hover:text-red-500 p-1"><Trash2 size={12} /></button>
                  </div>
                )}
              </div>
            </div>
            {item.desc && <p className="text-zinc-600 text-[10px] italic mt-0.5">{item.desc}</p>}
          </div>
        </div>
      );
    }

    if (viewMode === 'list') {
      return (
        <div key={`${catId}-${idx}`} className="py-6 border-b border-zinc-900 group relative">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center w-full">
                <h4 className="text-zinc-100 font-bold uppercase tracking-tight text-sm">
                  {item.name}
                </h4>
                <div className="flex items-center gap-4">
                  <span className="text-amber-500 font-serif font-bold whitespace-nowrap">{priceDisplay}</span>
                  {admin.isAdmin && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                      <button onClick={() => setEditingItem({ catId, idx, isExtra: false, ...item })} className="text-zinc-500 hover:text-amber-500"><Edit2 size={12} /></button>
                      <button onClick={() => admin.updateMenu(admin.menu.map(c => c.id === catId ? {...c, items: c.items.filter((_, i) => i !== idx)} : c))} className="text-zinc-500 hover:text-red-500"><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-zinc-500 text-[11px] mt-1 font-light italic leading-relaxed">{item.desc}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={`${catId}-${idx}`} className="group flex gap-5 items-stretch bg-zinc-900/10 p-5 rounded-sm border border-zinc-900/50 hover:border-zinc-800 transition-all hover:bg-zinc-900/20">
        <div className="w-24 h-24 shrink-0 bg-zinc-900 overflow-hidden rounded-sm relative shadow-lg">
          {item.image ? <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-zinc-800"><Camera size={24} /></div>}
        </div>
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-sm font-bold text-zinc-100 uppercase leading-tight">{item.name}</h4>
              <span className="text-amber-500 font-bold text-sm shrink-0">{priceDisplay}</span>
            </div>
            <p className="text-zinc-500 text-[11px] mt-2 leading-relaxed italic line-clamp-2">{item.desc}</p>
          </div>
          
          <div className="flex justify-end mt-4">
            {admin.isAdmin && (
              <div className="flex gap-2 no-print opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => setEditingItem({ catId, idx, isExtra: false, ...item })} className="p-1.5 bg-zinc-800 text-amber-500 rounded-sm hover:bg-zinc-700 transition-colors shadow-lg"><Edit2 size={12} /></button>
                <button onClick={() => admin.updateMenu(admin.menu.map(c => c.id === catId ? {...c, items: c.items.filter((_, i) => i !== idx)} : c))} className="p-1.5 bg-zinc-800 text-red-500 rounded-sm hover:bg-zinc-700 transition-colors shadow-lg"><Trash2 size={12} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const activeCategory = admin.menu.find(c => c.id === activeTab);

  return (
    <section id="menu" className="py-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4">
        {/* INDICADOR DE MODO ADMIN */}
        {admin.isAdmin && (
          <div className="mb-8 flex items-center gap-4 p-4 bg-amber-600/10 border border-amber-600/30 rounded-sm no-print animate-pulse">
            <ShieldAlert className="text-amber-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Panel de Control Activo: Haz clic en cualquier elemento para editar</span>
          </div>
        )}

        {/* ENCABEZADO Y BUSCADOR */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 no-print">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl font-bold serif flex items-center gap-3 mb-2">
              <UtensilsCrossed className="text-amber-500" size={24} /> Nuestra Carta
            </h2>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Selección Premium Maral</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-2/3 justify-end">
            <div className="relative flex-1 max-w-md group" ref={searchRef}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-amber-500' : 'text-zinc-600 group-hover:text-zinc-400'}`} size={16} />
              <input 
                type="text" 
                placeholder="Buscar plato, salsa o guarnición..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm py-3.5 pl-12 pr-4 text-xs focus:border-amber-500/50 outline-none transition-all placeholder:text-zinc-600 shadow-xl"
              />
              
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-[100] max-h-[420px] overflow-y-auto rounded-sm border-t-amber-500 backdrop-blur-2xl">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/40">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Encontrados ({searchResults.length})</span>
                      </div>
                      {searchResults.map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            setActiveTab(item.catId);
                            setSearchQuery('');
                            setTimeout(() => {
                              const el = document.getElementById(`item-${item.catId}-${item.idx}`);
                              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }}
                          className="flex justify-between items-center p-4 border-b border-zinc-900 hover:bg-amber-600/10 cursor-pointer transition-all group/res"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-zinc-100 font-bold uppercase tracking-tight group-hover/res:text-amber-500 transition-colors">
                                {item.name}
                              </span>
                              <span className="text-[9px] px-2 py-0.5 bg-zinc-900 text-zinc-600 rounded-full uppercase font-bold tracking-tighter">
                                {item.categoryName}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-amber-500 font-serif font-bold">{item.price}</span>
                            <ArrowRight size={12} className="text-zinc-800 group-hover/res:text-amber-500 group-hover/res:translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center">
                      <Search size={32} className="mx-auto text-zinc-900 mb-4" />
                      <p className="text-xs text-zinc-700 italic">No hay resultados.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex bg-zinc-900 p-1 rounded-sm border border-zinc-800 shadow-lg shrink-0 h-fit self-center">
              <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-all text-[10px] font-bold uppercase tracking-wider ${viewMode === 'grid' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                <LayoutGrid size={14} /> Fotos
              </button>
              <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-all text-[10px] font-bold uppercase tracking-wider ${viewMode === 'list' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                <List size={14} /> Lista
              </button>
            </div>

            <button onClick={() => window.print()} className="p-3 text-zinc-500 hover:text-amber-500 border border-zinc-800 rounded-sm shadow-lg h-fit self-center transition-colors" title="Exportar Menú">
              <FileDown size={20} />
            </button>
          </div>
        </div>

        {/* TABS DE CATEGORÍAS */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 no-print">
          {admin.menu.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={`px-8 py-3.5 text-[10px] uppercase font-bold tracking-[0.25em] rounded-sm border transition-all ${activeTab === cat.id ? 'bg-amber-600 border-amber-500 text-white shadow-2xl shadow-amber-900/30' : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* LISTADO DE PLATOS */}
        <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 gap-x-12 gap-y-12' : 'grid-cols-1 gap-0'}`}>
          {activeCategory?.items.length ? activeCategory.items.map((item, idx) => (
            <div id={`item-${activeTab}-${idx}`} key={`${activeTab}-${idx}`} className="scroll-mt-32">
              {renderItem(item, idx, activeTab)}
            </div>
          )) : (
            <div className="col-span-full py-24 text-center bg-zinc-900/10 border border-dashed border-zinc-800 rounded-sm">
              <UtensilsCrossed size={48} className="mx-auto text-zinc-900 mb-6" strokeWidth={1} />
              <p className="text-zinc-600 italic text-sm tracking-wide">Esta sección está esperando tus platos.</p>
            </div>
          )}
          
          {admin.isAdmin && activeCategory && (
            <button onClick={() => handleAddItem(activeTab, false)} className="border-2 border-dashed border-zinc-900 p-10 flex flex-col items-center justify-center gap-3 hover:border-amber-500/40 text-zinc-800 hover:text-amber-500 transition-all no-print rounded-sm bg-zinc-900/5 h-full min-h-[180px] group">
              <Plus size={40} strokeWidth={1} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Añadir {activeCategory.name === 'Entradas' ? 'Entrada' : 'Plato Principal'}</span>
            </button>
          )}
        </div>

        {/* SUB-SECCIÓN DE GUARNICIONES O SALSAS */}
        {activeCategory && (activeCategory.id === 'minutas' || activeCategory.id === 'pastas') && (
          <div className="mt-24 pt-20 border-t-4 border-zinc-900/50 relative">
            <div className="flex flex-col items-center mb-12">
              <h3 className="text-3xl serif italic text-amber-500 font-bold uppercase tracking-[0.3em] mb-4">
                {getExtraLabel(activeCategory.id)}
              </h3>
              <div className="w-24 h-1 bg-amber-500/30"></div>
              <p className="mt-6 text-[11px] text-zinc-500 uppercase tracking-widest font-black italic max-w-md text-center">
                Completa tu plato con nuestras opciones seleccionadas de {getExtraItemPrefix(activeCategory.id).toLowerCase()}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategory.extras?.map((extra, idx) => renderItem(extra, idx, activeCategory.id, true))}
              
              {admin.isAdmin && (
                <button 
                  onClick={() => handleAddItem(activeCategory.id, true)} 
                  className="flex items-center justify-center gap-3 border-2 border-dashed border-amber-600/30 p-8 hover:border-amber-500 text-amber-500/60 hover:text-amber-500 transition-all no-print rounded-sm bg-amber-600/5 group min-h-[100px]"
                >
                  <Plus size={24} className="group-hover:scale-125 transition-transform" />
                  <span className="text-[11px] uppercase font-black tracking-widest">Nueva {getExtraItemPrefix(activeCategory.id)}</span>
                </button>
              )}
            </div>
            
            <div className="mt-12 p-6 bg-zinc-900/10 border border-zinc-900 rounded-sm text-center">
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] italic no-print font-bold">
                ⚠️ Importante: Los precios de los acompañamientos se adicionan al valor del plato principal.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* EDITOR MODAL PREMIUM */}
      {editingItem && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl p-10 shadow-[0_0_120px_rgba(0,0,0,1)] my-auto relative border-t-8 border-t-amber-600 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10 border-b border-zinc-900 pb-8">
              <div>
                <h3 className="text-3xl font-bold serif text-zinc-100 italic tracking-tight">
                  {editingItem.isExtra ? `Editar ${getExtraItemPrefix(editingItem.catId)}` : 'Editor Maestro'}
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.4em] mt-2">
                  {editingItem.isExtra ? 'Subcategoría de Acompañamiento' : 'Plato Principal'} en {admin.menu.find(c => c.id === editingItem.catId)?.name}
                </p>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-3 text-zinc-700 hover:text-white transition-colors bg-zinc-900 rounded-full"><X size={24} /></button>
            </div>
            
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-600 block mb-4 tracking-[0.2em]">Nombre del Item</label>
                    <input 
                      type="text" 
                      value={editingItem.name} 
                      onFocus={(e) => handleInputFocus(e, 'name')} 
                      onChange={e => setEditingItem({...editingItem, name: e.target.value})} 
                      className="w-full bg-zinc-900 border border-zinc-800 p-5 text-sm focus:border-amber-500 outline-none transition-all rounded-sm text-zinc-100 font-semibold" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-600 block mb-4 tracking-[0.2em]">Precio Sugerido</label>
                    <input 
                      type="text" 
                      value={editingItem.price} 
                      onFocus={(e) => handleInputFocus(e, 'price')} 
                      onChange={e => handlePriceChange(e.target.value)} 
                      className="w-full bg-zinc-900 border border-zinc-800 p-5 text-sm font-bold text-amber-500 focus:border-amber-500 outline-none transition-all rounded-sm" 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {editingItem.isExtra ? (
                    <div className="p-8 border border-zinc-900 bg-zinc-900/20 rounded-sm flex flex-col items-center justify-center text-center h-full">
                      <Sparkles size={32} className="text-amber-500/30 mb-4" />
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest leading-relaxed">Este acompañamiento aparecerá en la sección inferior dedicada a {getExtraLabel(editingItem.catId)}</p>
                    </div>
                  ) : (
                    <div className="p-8 border border-zinc-900 bg-zinc-900/20 rounded-sm flex flex-col items-center justify-center text-center h-full">
                      <UtensilsCrossed size={32} className="text-amber-500/30 mb-4" />
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest leading-relaxed">Define los detalles de este plato. Los acompañamientos se seleccionan por separado desde su sección correspondiente.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-10">
                {!editingItem.isExtra && (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-600 block mb-4 tracking-[0.2em]">Imagen del Plato (URL)</label>
                    <div className="flex gap-4 items-start">
                      <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center shadow-lg rounded-sm">
                        {editingItem.image ? <img src={editingItem.image} className="w-full h-full object-cover" /> : <Camera size={24} className="text-zinc-800" />}
                      </div>
                      <textarea 
                        value={editingItem.image || ''} 
                        onChange={e => setEditingItem({...editingItem, image: e.target.value})} 
                        placeholder="https://images.unsplash.com/..." 
                        className="flex-1 bg-zinc-900 border border-zinc-800 p-4 text-[11px] outline-none focus:border-amber-500 text-zinc-500 h-20 resize-none font-mono" 
                      />
                    </div>
                  </div>
                )}

                <div className={editingItem.isExtra ? 'col-span-2' : ''}>
                  <label className="text-[10px] uppercase font-bold text-zinc-600 block mb-4 tracking-[0.2em]">Descripción Gastronómica</label>
                  <textarea 
                    value={editingItem.desc} 
                    onFocus={(e) => handleInputFocus(e, 'desc')} 
                    onChange={e => setEditingItem({...editingItem, desc: e.target.value})} 
                    rows={3} 
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 text-[11px] outline-none focus:border-amber-500 resize-none text-zinc-400 leading-relaxed font-light" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end gap-6 pt-10 border-t border-zinc-900">
              <button onClick={() => setEditingItem(null)} className="px-8 py-4 text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em] hover:text-white transition-all">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-14 py-4 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-amber-500 shadow-3xl shadow-amber-900/50 active:scale-95 transition-all">Sincronizar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;
