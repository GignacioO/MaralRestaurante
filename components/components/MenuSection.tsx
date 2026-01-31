
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AdminContext } from '../App';
import { Plus, Edit2, Trash2, Download, Loader2, Camera, X, Save, Upload, Link as LinkIcon, Code, Copy, Check } from 'lucide-react';
import { APP_VERSION, RESTAURANT_DATA, REVIEWS } from '../constants';

interface EditingItem {
  catId: string;
  idx: number;
  name: string;
  price: string;
  desc: string;
  image?: string;
}

const MenuSection: React.FC = () => {
  const admin = useContext(AdminContext);
  const [activeTab, setActiveTab] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpenExport = () => setShowExportModal(true);
    window.addEventListener('open-github-export', handleOpenExport);
    return () => window.removeEventListener('open-github-export', handleOpenExport);
  }, []);

  useEffect(() => {
    if (admin?.menu.length && !activeTab) {
      setActiveTab(admin.menu[0].id);
    }
  }, [admin?.menu, activeTab]);

  if (!admin) return null;

  const handleDownload = () => {
    setShowToast(true);
    setTimeout(() => {
      window.print();
      setShowToast(false);
    }, 1000);
  };

  const handleAddItem = (catId: string) => {
    const newItem = { name: 'Nuevo Plato', price: '$0', desc: 'Descripción...', image: '' };
    const newMenu = admin.menu.map(cat => {
      if (cat.id === catId) return { ...cat, items: [...cat.items, newItem] };
      return cat;
    });
    admin.updateMenu(newMenu);
  };

  const handleDeleteItem = (catId: string, itemIdx: number) => {
    if (!confirm('¿Eliminar este plato?')) return;
    const newMenu = admin.menu.map(cat => {
      if (cat.id === catId) {
        const newItems = [...cat.items];
        newItems.splice(itemIdx, 1);
        return { ...cat, items: newItems };
      }
      return cat;
    });
    admin.updateMenu(newMenu);
  };

  const handlePriceChange = (val: string) => {
    if (!editingItem) return;
    // Extraemos solo los dígitos del valor ingresado
    const numbersOnly = val.replace(/\D/g, '');
    // Siempre mantenemos el signo $, si no hay números ponemos solo el $
    const formattedPrice = numbersOnly === '' ? '$' : `$${numbersOnly}`;
    setEditingItem({ ...editingItem, price: formattedPrice });
  };

  const handlePriceFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    
    if (editingItem.price === '$0') {
      // Si es el valor por defecto, lo dejamos solo en "$" para que escriba directo
      setEditingItem({ ...editingItem, price: '$' });
    } else {
      // Si ya tiene precio, movemos el cursor al final
      const val = e.target.value;
      // Pequeño delay para asegurar que el navegador no resetee el cursor
      setTimeout(() => {
        if (priceInputRef.current) {
          const len = priceInputRef.current.value.length;
          priceInputRef.current.setSelectionRange(len, len);
        }
      }, 0);
    }
  };

  const handlePriceClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Al hacer clic, siempre forzamos el cursor al final si ya tiene contenido
    if (priceInputRef.current) {
      const len = priceInputRef.current.value.length;
      priceInputRef.current.setSelectionRange(len, len);
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    // Si el precio quedó vacío o solo con $, ponemos $0 por defecto
    const finalPrice = (editingItem.price === '$' || editingItem.price === '') ? '$0' : editingItem.price;
    
    const newMenu = admin.menu.map(cat => {
      if (cat.id === editingItem.catId) {
        const newItems = [...cat.items];
        newItems[editingItem.idx] = {
          name: editingItem.name,
          price: finalPrice,
          desc: editingItem.desc,
          image: editingItem.image
        };
        return { ...cat, items: newItems };
      }
      return cat;
    });
    admin.updateMenu(newMenu);
    setEditingItem(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      const reader = new FileReader();
      reader.onloadend = () => setEditingItem({ ...editingItem, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const activeCategory = admin.menu.find(c => c.id === activeTab);

  const generateGithubCode = () => {
    const currentVer = parseFloat(APP_VERSION);
    const nextVer = (currentVer + 0.1).toFixed(1);
    return `
export const APP_VERSION = "${nextVer}";
export const RESTAURANT_DATA = ${JSON.stringify(RESTAURANT_DATA, null, 2)};
export interface MenuItem { name: string; price: string; desc: string; image?: string; }
export interface MenuCategory { id: string; name: string; items: MenuItem[]; }
export const INITIAL_MENU: MenuCategory[] = ${JSON.stringify(admin.menu, null, 2)};
export const REVIEWS = ${JSON.stringify(REVIEWS, null, 2)};
`.trim();
  };

  return (
    <section id="menu" className="py-24 bg-zinc-900/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 no-print">
          <h2 className="text-4xl md:text-5xl font-bold serif mb-4">Nuestra Carta</h2>
          <p className="text-zinc-500 uppercase tracking-widest text-sm mb-6">Sabores que cuentan una historia</p>
          <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 no-print">
          {admin.menu.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === category.id ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Platos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {activeCategory?.items.map((item, idx) => (
            <div key={idx} className="group relative flex gap-6 items-start">
              <div className="w-24 h-24 shrink-0 overflow-hidden bg-zinc-800 border border-zinc-700">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700"><Camera size={24} /></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">{item.name}</h4>
                  <span className="text-amber-500 font-serif italic text-sm">{item.price}</span>
                </div>
                <p className="text-zinc-500 text-sm leading-snug font-light italic">{item.desc}</p>
                
                {admin.isAdmin && (
                  <div className="mt-3 flex gap-2 no-print">
                    <button onClick={() => setEditingItem({ catId: activeTab, idx, ...item })} className="p-2 bg-zinc-800 text-amber-500 hover:bg-zinc-700 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteItem(activeTab, idx)} className="p-2 bg-zinc-800 text-red-500 hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {admin.isAdmin && (
            <button onClick={() => handleAddItem(activeTab)} className="border-2 border-dashed border-zinc-800 p-8 flex flex-col items-center justify-center gap-2 hover:border-amber-500/50 transition-colors no-print">
              <Plus className="text-zinc-600" size={32} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">Agregar nuevo plato</span>
            </button>
          )}
        </div>

        <div className="mt-24 text-center p-12 border border-zinc-800/50 bg-zinc-950/30 no-print">
          <button 
            onClick={handleDownload}
            className="px-12 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-xl flex items-center gap-3 mx-auto"
          >
            <Download size={18} /> Descargar Carta PDF
          </button>
        </div>
      </div>

      {/* MODAL DE EDICIÓN CON VALIDACIÓN DE PRECIO MEJORADA */}
      {editingItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold uppercase tracking-widest text-amber-500">Editar Plato</h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Nombre</label>
                  <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Precio (Números Solamente)</label>
                  <div className="relative">
                    <input 
                      ref={priceInputRef}
                      type="text" 
                      value={editingItem.price} 
                      onChange={e => handlePriceChange(e.target.value)} 
                      onFocus={handlePriceFocus}
                      onClick={handlePriceClick}
                      placeholder="$0"
                      className="w-full bg-black border border-zinc-800 p-3 text-amber-500 font-bold outline-none focus:border-amber-500" 
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Imagen</label>
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-zinc-800 p-3 text-[10px] uppercase font-bold hover:bg-zinc-700">Subir Foto</button>
                  <button onClick={() => setEditingItem({...editingItem, image: prompt('URL de imagen:') || ''})} className="flex-1 bg-zinc-800 p-3 text-[10px] uppercase font-bold hover:bg-zinc-700">Usar Link</button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Descripción</label>
                <textarea value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} rows={3} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none focus:border-amber-500 resize-none" />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => setEditingItem(null)} className="px-6 py-3 text-zinc-500 text-xs font-bold uppercase">Cerrar</button>
              <button onClick={handleSaveEdit} className="px-10 py-3 bg-amber-600 text-white text-xs font-bold uppercase hover:bg-amber-500">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PUBLICACIÓN */}
      {showExportModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/95">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl flex flex-col h-[80vh] shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
              <h3 className="text-xl font-bold text-amber-500 uppercase tracking-widest">Publicar Cambios Permanentes</h3>
              <button onClick={() => setShowExportModal(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 p-6 overflow-hidden">
              <textarea 
                readOnly 
                value={generateGithubCode()}
                className="w-full h-full bg-black text-green-500 font-mono text-xs p-6 border border-zinc-800 rounded outline-none resize-none"
              />
            </div>
            <div className="p-6 border-t border-zinc-800 flex justify-between items-center">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Versión actual: {APP_VERSION}</p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generateGithubCode());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-8 py-3 bg-white text-black font-bold text-xs uppercase flex items-center gap-2 hover:bg-zinc-200"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '¡Copiado!' : 'Copiar Código'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200]">
          <div className="bg-white text-black px-10 py-6 shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-amber-600" size={32} />
            <p className="font-bold uppercase tracking-[0.2em] text-xs">Preparando Impresión...</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;
