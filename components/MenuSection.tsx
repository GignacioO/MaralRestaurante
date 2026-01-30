
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AdminContext } from '../App';
import { Plus, Edit2, Trash2, Download, Loader2, Camera, X, Save, Upload, Link as LinkIcon, RotateCcw, RotateCw, Code, Copy, Check } from 'lucide-react';
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

  useEffect(() => {
    if (admin?.menu.length && !activeTab) {
      setActiveTab(admin.menu[0].id);
    }
  }, [admin?.menu, activeTab]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!admin) return null;

  const handleDownload = () => {
    setShowToast(true);
    setTimeout(() => window.print(), 800);
  };

  const handleAddItem = (catId: string) => {
    const newItem = { name: 'Nuevo Plato', price: 'Consultar', desc: 'Descripción del plato...', image: '' };
    const newMenu = admin.menu.map(cat => {
      if (cat.id === catId) return { ...cat, items: [...cat.items, newItem] };
      return cat;
    });
    admin.updateMenu(newMenu);
    setEditingItem({ catId, idx: (admin.menu.find(c => c.id === catId)?.items.length || 0) - 1, ...newItem });
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

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const newMenu = admin.menu.map(cat => {
      if (cat.id === editingItem.catId) {
        const newItems = [...cat.items];
        newItems[editingItem.idx] = {
          name: editingItem.name,
          price: editingItem.price,
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

  const generateGithubCode = () => {
    const currentVer = parseFloat(APP_VERSION);
    const nextVer = (currentVer + 0.1).toFixed(1);
    
    const code = `
export const APP_VERSION = "${nextVer}";

export const RESTAURANT_DATA = ${JSON.stringify(RESTAURANT_DATA, null, 2)};

export interface MenuItem {
  name: string;
  price: string;
  desc: string;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const INITIAL_MENU: MenuCategory[] = ${JSON.stringify(admin.menu, null, 2)};

export const REVIEWS = ${JSON.stringify(REVIEWS, null, 2)};
`;
    return code.trim();
  };

  const handleCopyCode = () => {
    const code = generateGithubCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const activeCategory = admin.menu.find(c => c.id === activeTab);

  return (
    <section id="menu" className="py-24 bg-zinc-900/50 relative">
      {/* Barra de Herramientas Admin */}
      {admin.isAdmin && (
        <div className="sticky top-20 z-40 flex justify-center mb-8 no-print gap-2">
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-full shadow-2xl flex items-center gap-1">
            <button 
              onClick={admin.undo}
              disabled={!admin.canUndo}
              title="Deshacer cambio"
              className={`p-2 rounded-full transition-all ${admin.canUndo ? 'text-zinc-100 hover:bg-zinc-800' : 'text-zinc-700 cursor-not-allowed'}`}
            >
              <RotateCcw size={18} />
            </button>
            <div className="w-px h-4 bg-zinc-800 mx-1"></div>
            <button 
              onClick={admin.redo}
              disabled={!admin.canRedo}
              title="Rehacer cambio"
              className={`p-2 rounded-full transition-all ${admin.canRedo ? 'text-zinc-100 hover:bg-zinc-800' : 'text-zinc-700 cursor-not-allowed'}`}
            >
              <RotateCw size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setShowExportModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
          >
            <Code size={16} /> Publicar Cambios
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 no-print">
          <h2 className="text-4xl md:text-5xl font-bold serif mb-4">Nuestra Carta</h2>
          <p className="text-zinc-500 uppercase tracking-widest text-sm mb-6">Todos los precios están sujetos a cambios</p>
          <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-16 no-print">
          {admin.menu.map((category) => (
            <div key={category.id} className="flex items-center gap-1 group/cat">
              <button
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === category.id
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {category.name}
              </button>
            </div>
          ))}
          {admin.isAdmin && (
            <button 
              onClick={() => {
                const name = prompt('Nombre de la nueva categoría:');
                if (name) {
                  const newId = Date.now().toString();
                  admin.updateMenu([...admin.menu, { id: newId, name, items: [] }]);
                  setActiveTab(newId);
                }
              }} 
              className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-full"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {/* Platos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {activeCategory?.items.map((item, idx) => (
            <div key={idx} className="group relative flex flex-col sm:flex-row gap-6 items-start sm:items-center min-h-[100px]">
              {item.image ? (
                <div className="w-full sm:w-24 h-48 sm:h-24 overflow-hidden rounded-sm shrink-0 shadow-lg border border-zinc-800 no-print bg-zinc-800">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ) : admin.isAdmin ? (
                <div className="w-full sm:w-24 h-24 bg-zinc-800/50 rounded-sm shrink-0 flex items-center justify-center border border-dashed border-zinc-700 text-zinc-600 no-print">
                   <Camera size={20} />
                </div>
              ) : null}
              
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-xl font-bold text-zinc-100 group-hover:text-amber-500 transition-colors">
                    {item.name}
                  </h4>
                  <div className="hidden sm:flex flex-1 border-b border-dotted border-zinc-700 mx-4 mb-1.5 no-print"></div>
                  <span className="text-sm font-serif text-zinc-500 italic shrink-0">{item.price}</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed italic">{item.desc}</p>
                
                {admin.isAdmin && (
                  <div className="mt-4 flex gap-2 no-print">
                    <button 
                      onClick={() => setEditingItem({ catId: activeTab, idx, ...item })}
                      className="p-2 bg-zinc-800 text-amber-500 rounded-sm hover:bg-zinc-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteItem(activeTab, idx)} className="p-2 bg-zinc-800 text-red-500 rounded-sm hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {admin.isAdmin && activeTab && (
            <button 
              onClick={() => handleAddItem(activeTab)}
              className="border-2 border-dashed border-zinc-800 p-8 flex flex-col items-center gap-2 hover:border-amber-500/50 transition-colors group no-print"
            >
              <Plus className="text-zinc-600 group-hover:text-amber-500" size={32} />
              <span className="text-zinc-600 group-hover:text-amber-500 text-sm font-bold uppercase tracking-widest">Agregar Plato</span>
            </button>
          )}
        </div>

        <div className="mt-20 text-center p-8 border border-zinc-800 bg-zinc-950/50 no-print">
          <p className="text-zinc-400 italic mb-6">Disponemos de opciones celíacas y vegetarianas.</p>
          <button 
            type="button"
            onClick={handleDownload}
            className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-xl active:scale-95 flex items-center gap-3 mx-auto cursor-pointer"
          >
            <Download size={20} /> DESCARGAR CARTA EN PDF
          </button>
        </div>
      </div>

      {/* Modal Exportar para GitHub */}
      {showExportModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-zinc-950/95 backdrop-blur-md no-print">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
              <div>
                <h3 className="text-xl font-bold text-amber-500 uppercase tracking-widest">Publicar Cambios Permanentes</h3>
                <p className="text-xs text-zinc-500 mt-1 uppercase">Copia este código y pégalo en tu archivo "constants.ts" en GitHub.</p>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <div className="relative h-full">
                <textarea 
                  readOnly 
                  value={generateGithubCode()}
                  className="w-full h-full bg-black text-green-500 font-mono text-xs p-4 border border-zinc-800 rounded resize-none focus:outline-none"
                />
                <button 
                  onClick={handleCopyCode}
                  className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded flex items-center gap-2 text-xs font-bold uppercase transition-all"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? 'Copiado' : 'Copiar Código'}
                </button>
              </div>
            </div>
            <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <p className="text-zinc-400 uppercase tracking-tighter">
                Versión detectada: <span className="text-white">{APP_VERSION}</span> → Nueva versión: <span className="text-amber-500">{(parseFloat(APP_VERSION) + 0.1).toFixed(1)}</span>
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  className="text-amber-500 hover:underline font-bold uppercase tracking-widest"
                >
                  Ir a GitHub →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-zinc-950/90 backdrop-blur-sm no-print">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50">
              <h3 className="text-xl font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                <Edit2 size={20} /> Editar Plato
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Nombre</label>
                    <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Precio</label>
                    <input type="text" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-amber-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Imagen</label>
                  <div className="aspect-video bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center group/img relative">
                    {editingItem.image ? (
                      <img src={editingItem.image} className="w-full h-full object-cover" />
                    ) : <Camera size={32} className="text-zinc-700" />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-zinc-800 p-2 text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-700 transition-colors">Subir</button>
                    <button onClick={() => setEditingItem({...editingItem, image: prompt('URL de imagen:') || ''})} className="flex-1 bg-zinc-800 p-2 text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-700 transition-colors">Link</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Descripción</label>
                <textarea value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} rows={3} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-amber-500 outline-none resize-none" />
              </div>
            </div>
            <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-4">
              <button onClick={() => setEditingItem(null)} className="px-6 py-3 text-zinc-500 uppercase text-xs font-bold">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white uppercase text-xs font-bold transition-all">Guardar Localmente</button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] no-print">
          <div className="bg-zinc-100 text-zinc-950 px-6 py-4 rounded-none shadow-2xl flex items-center gap-4 border-l-4 border-amber-600">
            <Loader2 className="text-amber-600 animate-spin" size={24} />
            <div>
              <p className="font-bold uppercase tracking-widest text-xs">Preparando PDF...</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;
