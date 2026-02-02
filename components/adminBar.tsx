
import React, { useState, useContext } from 'react';
import { Lock, RotateCcw, RotateCw, Save, Settings, Loader2, X, Mail, ShieldCheck, RefreshCcw } from 'lucide-react';
import { AdminContext } from '../App';
import { RESTAURANT_DATA, REVIEWS, APP_VERSION } from '../constants';

const AdminBar: React.FC = () => {
  const admin = useContext(AdminContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!admin) return null;

  const handleForceReset = () => {
    if (confirm('¿Deseas resetear la caché local? Esto borrará tus cambios no publicados y cargará la configuración inicial de la web. Útil si no ves las nuevas secciones.')) {
      localStorage.removeItem('maral_menu');
      localStorage.removeItem('maral_version');
      localStorage.removeItem('maral_content');
      window.location.reload();
    }
  };

  const handleRequestPasswordChange = () => {
    const requestedPass = prompt('Nueva contraseña deseada:');
    if (!requestedPass) return;
    const subject = encodeURIComponent(`Solicitud Cambio de Clave - ${RESTAURANT_DATA.name}`);
    const body = encodeURIComponent(`Hola Ignacio,\n\nSolicito cambiar la clave del administrador.\n\nClave actual: ${admin.password}\nNueva clave propuesta: ${requestedPass}`);
    window.location.href = `mailto:ignaciogrizzo@gmail.com?subject=${subject}&body=${body}`;
  };

  const publishToGithub = async () => {
    const token = localStorage.getItem('maral_gh_token');
    const repo = localStorage.getItem('maral_gh_repo');
    if (!token || !repo) {
      setShowSettings(true);
      alert('Configura el Repo y Token en los ajustes.');
      return;
    }
    setIsSyncing(true);
    try {
      const path = 'constants.ts';
      const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        headers: { 'Authorization': `token ${token}` }
      });
      if (!getRes.ok) throw new Error('No se encontró el archivo.');
      const fileData = await getRes.json();
      const sha = fileData.sha;
      const fileContent = `export const APP_VERSION = "${APP_VERSION}";\nexport const RESTAURANT_DATA = ${JSON.stringify(RESTAURANT_DATA, null, 2)};\nexport interface MenuItem { name: string; price: string; desc: string; image?: string; side?: { name: string; price: string; }; }\nexport interface MenuCategory { id: string; name: string; items: MenuItem[]; extras?: MenuItem[]; }\nexport const INITIAL_MENU: MenuCategory[] = ${JSON.stringify(admin.menu, null, 2)};\nexport const REVIEWS = ${JSON.stringify(REVIEWS, null, 2)};`;
      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Update from Admin Panel', content: btoa(unescape(encodeURIComponent(fileContent))), sha })
      });
      if (putRes.ok) alert('¡Publicación exitosa! Los cambios tardarán 1-2 minutos en reflejarse en la web pública.');
      else throw new Error('Error al subir.');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-12 bg-amber-600 z-[200] flex items-center justify-between px-4 shadow-xl no-print">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white border-r border-amber-500 pr-4 mr-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Admin Mode v{APP_VERSION}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={admin.undo} disabled={!admin.canUndo} className="p-2 text-white hover:bg-amber-700 disabled:opacity-30 rounded-sm transition-colors" title="Deshacer">
              <RotateCcw size={16} />
            </button>
            <button onClick={admin.redo} disabled={!admin.canRedo} className="p-2 text-white hover:bg-amber-700 disabled:opacity-30 rounded-sm transition-colors" title="Rehacer">
              <RotateCw size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleForceReset} className="p-2 text-white hover:bg-amber-700 rounded-sm transition-colors flex items-center gap-2" title="Limpiar Caché Local">
            <RefreshCcw size={16} />
            <span className="text-[8px] font-bold uppercase hidden md:inline">Reset Caché</span>
          </button>
          <button onClick={handleRequestPasswordChange} className="p-2 text-white hover:bg-amber-700 rounded-sm transition-colors hidden sm:flex" title="Cambiar Clave">
            <Mail size={16} />
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-sm transition-colors ${showSettings ? 'bg-amber-800 text-white' : 'text-white hover:bg-amber-700'}`} title="Ajustes GitHub">
            <Settings size={16} />
          </button>
          <button onClick={publishToGithub} disabled={isSyncing} className="bg-white text-amber-600 px-4 py-1.5 rounded-sm font-black text-[9px] uppercase tracking-widest hover:bg-amber-50 shadow-md flex items-center gap-2 disabled:opacity-50">
            {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSyncing ? 'Subiendo' : 'Publicar'}
          </button>
          <button onClick={() => admin.setIsAdmin(false)} className="ml-2 p-2 text-white/80 hover:text-white hover:bg-red-700 rounded-sm transition-all" title="Salir">
            <Lock size={16} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed top-14 right-4 z-[201] bg-zinc-950 border border-amber-500/50 p-6 rounded-sm shadow-2xl w-80 animate-in fade-in slide-in-from-top-4 no-print">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] flex items-center gap-2">
              <Settings size={12} /> GitHub Sync
            </h4>
            <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white"><X size={14} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Repositorio (usuario/repo)</label>
              <input type="text" placeholder="ignacio/maral-web" defaultValue={localStorage.getItem('maral_gh_repo') || ''} onBlur={e => localStorage.setItem('maral_gh_repo', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-[10px] text-white outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Token de GitHub</label>
              <input type="password" placeholder="ghp_xxxx..." defaultValue={localStorage.getItem('maral_gh_token') || ''} onBlur={e => localStorage.setItem('maral_gh_token', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-[10px] text-white outline-none focus:border-amber-500" />
            </div>
            <p className="text-[8px] text-zinc-600 italic">Configura esto para que el botón "Publicar" funcione correctamente.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBar;
