
import React, { useState, useContext } from 'react';
import { Lock, RotateCcw, RotateCw, Save, X, ShieldCheck, Mail, Settings, Loader2 } from 'lucide-react';
import { AdminContext } from '../App';
import { RESTAURANT_DATA, REVIEWS, APP_VERSION } from '../constants';

const AdminFab: React.FC = () => {
  const admin = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!admin) return null;

  const handleLogin = () => {
    if (admin.isAdmin) {
      setIsOpen(!isOpen);
    } else {
      const pass = prompt('INGRESE CLAVE MAESTRA:');
      if (pass === admin.password) {
        admin.setIsAdmin(true);
        setIsOpen(true);
      } else if (pass !== null) {
        alert('Clave incorrecta.');
      }
    }
  };

  const handleRequestPasswordChange = () => {
    const requestedPass = prompt('Ingrese la nueva clave deseada:');
    if (!requestedPass) return;

    const subject = encodeURIComponent(`Cambio de Clave solicitado - ${RESTAURANT_DATA.name}`);
    const body = encodeURIComponent(
      `Hola Ignacio,\n\nSe ha solicitado cambiar la clave del administrador.\n\nClave actual: ${admin.password}\nNueva clave propuesta: ${requestedPass}\n\nResponde este correo aceptando el cambio.`
    );
    
    window.location.href = `mailto:ignaciogrizzo@gmail.com?subject=${subject}&body=${body}`;
    alert('Mail preparado para ignaciogrizzo@gmail.com.');
  };

  const publishToGithub = async () => {
    const token = localStorage.getItem('maral_gh_token');
    const repo = localStorage.getItem('maral_gh_repo');
    const path = 'constants.ts';

    if (!token || !repo) {
      setShowSettings(true);
      alert('Configura primero el Repositorio y Token en los ajustes.');
      return;
    }

    setIsSyncing(true);
    try {
      const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        headers: { 'Authorization': `token ${token}` }
      });
      
      if (!getRes.ok) throw new Error('No se encontró el archivo en GitHub.');
      const fileData = await getRes.json();
      const sha = fileData.sha;

      const fileContent = `
export const APP_VERSION = "${APP_VERSION}";

export const RESTAURANT_DATA = ${JSON.stringify(RESTAURANT_DATA, null, 2)};

export interface MenuItem {
  name: string;
  price: string;
  desc: string;
  image?: string;
  side?: {
    name: string;
    price: string;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const INITIAL_MENU: MenuCategory[] = ${JSON.stringify(admin.menu, null, 2)};

export const REVIEWS = ${JSON.stringify(REVIEWS, null, 2)};
`;

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update from Admin Panel',
          content: btoa(unescape(encodeURIComponent(fileContent))),
          sha: sha
        })
      });

      if (putRes.ok) {
        alert('¡Web actualizada con éxito!');
      } else {
        const error = await putRes.json();
        throw new Error(error.message);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200] no-print flex flex-col items-end gap-4">
      {admin.isAdmin && isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-6 duration-300">
          
          {showSettings && (
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-sm shadow-2xl w-72 animate-in fade-in zoom-in-95">
              <h4 className="text-[10px] uppercase font-bold text-amber-500 mb-4 tracking-widest">Ajustes de Sincronización</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-bold mb-1 block">Repo (usuario/repositorio)</label>
                  <input type="text" defaultValue={localStorage.getItem('maral_gh_repo') || ''} onBlur={e => localStorage.setItem('maral_gh_repo', e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-[10px] text-white outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-bold mb-1 block">GitHub Token</label>
                  <input type="password" defaultValue={localStorage.getItem('maral_gh_token') || ''} onBlur={e => localStorage.setItem('maral_gh_token', e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-[10px] text-white outline-none focus:border-amber-500" />
                </div>
              </div>
            </div>
          )}

          <button onClick={handleRequestPasswordChange} className="flex items-center gap-3 bg-zinc-900 border border-amber-500/30 px-5 py-3 rounded-sm shadow-2xl hover:bg-zinc-800 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
            <Mail size={16} /> Solicitar Nueva Clave
          </button>
          
          <div className="flex gap-2 w-full">
            <button onClick={admin.undo} disabled={!admin.canUndo} className={`flex-1 p-4 rounded-sm border flex justify-center transition-all ${admin.canUndo ? 'bg-zinc-800 text-amber-500 border-zinc-700' : 'bg-zinc-900 text-zinc-800 border-zinc-900 opacity-50 cursor-not-allowed'}`} title="Deshacer">
              <RotateCcw size={18} />
            </button>
            <button onClick={admin.redo} disabled={!admin.canRedo} className={`flex-1 p-4 rounded-sm border flex justify-center transition-all ${admin.canRedo ? 'bg-zinc-800 text-amber-500 border-zinc-700' : 'bg-zinc-900 text-zinc-800 border-zinc-900 opacity-50 cursor-not-allowed'}`} title="Rehacer">
              <RotateCw size={18} />
            </button>
          </div>

          <div className="flex gap-2 w-full">
            <button onClick={() => setShowSettings(!showSettings)} className={`p-4 rounded-sm border transition-colors ${showSettings ? 'bg-amber-600 text-white border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}>
              <Settings size={18} />
            </button>
            <button onClick={publishToGithub} disabled={isSyncing} className="flex-1 flex items-center justify-center gap-3 bg-amber-600 text-white px-6 py-4 rounded-sm shadow-2xl hover:bg-amber-500 font-bold text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-50">
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
              {isSyncing ? 'Guardando...' : 'Publicar Web'}
            </button>
          </div>

          <button onClick={() => { admin.setIsAdmin(false); setIsOpen(false); }} className="w-full flex items-center justify-center gap-3 bg-red-950/30 border border-red-900/50 text-red-500 px-8 py-3 rounded-sm hover:bg-red-900/40 font-bold text-[10px] uppercase tracking-widest transition-all">
            <Lock size={16} /> Salir Admin
          </button>
        </div>
      )}

      <button onClick={handleLogin} className={`p-6 rounded-full shadow-2xl transition-all duration-300 border-2 ${admin.isAdmin ? 'bg-amber-600 border-amber-400 rotate-0 shadow-amber-900/40' : 'bg-zinc-900 border-amber-500 hover:scale-110 shadow-black/80'}`}>
        {admin.isAdmin ? (isOpen ? <X size={28} /> : <ShieldCheck size={28} />) : <Lock size={24} className="text-amber-500" />}
      </button>
    </div>
  );
};

export default AdminFab;
