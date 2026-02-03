
import React, { useContext } from 'react';
import { RotateCcw, RotateCw, X, ShieldCheck, Tag } from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { APP_VERSION } from '../constants';

const AdminBar: React.FC = () => {
  const admin = useContext(AdminContext);

  if (!admin || !admin.isAdmin) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-zinc-950 border-b border-amber-500/30 z-[500] flex items-center justify-between px-6 shadow-2xl no-print">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-amber-500">
          <ShieldCheck size={16} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-[0.25em]">Editor Activo</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          <Tag size={10} className="text-zinc-500" />
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Versión: {APP_VERSION}</span>
        </div>

        <div className="flex items-center gap-1 border-l border-zinc-800 pl-4 ml-2">
          <button onClick={admin.undo} disabled={!admin.canUndo} className="p-2 text-zinc-500 hover:text-amber-500 disabled:opacity-20 transition-all rounded-full hover:bg-zinc-900" title="Deshacer"><RotateCcw size={14} /></button>
          <button onClick={admin.redo} disabled={!admin.canRedo} className="p-2 text-zinc-500 hover:text-amber-500 disabled:opacity-20 transition-all rounded-full hover:bg-zinc-900" title="Rehacer"><RotateCw size={14} /></button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => admin.setIsAdmin(false)} className="flex items-center gap-2 px-4 py-1.5 text-zinc-400 hover:text-amber-500 transition-all text-[10px] font-black uppercase tracking-widest bg-zinc-900 rounded-sm border border-zinc-800">
          <X size={12} strokeWidth={3} /> Salir
        </button>
      </div>
    </div>
  );
};

export default AdminBar;
