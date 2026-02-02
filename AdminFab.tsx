
import React, { useState, useContext, useEffect } from 'react';
import { Lock, RotateCcw, RotateCw, Save, X, ShieldCheck, Settings, Loader2, RefreshCcw, CheckCircle2, AlertCircle, Github } from 'lucide-react';
import { AdminContext } from '../App';
import { RESTAURANT_DATA, REVIEWS, APP_VERSION } from '../constants';

type SyncStatus = 'idle' | 'loading' | 'success' | 'error';

const AdminFab: React.FC = () => {
  const admin = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Estados para configuración local antes de confirmar
  const [tempRepo, setTempRepo] = useState(localStorage.getItem('maral_gh_repo') || '');
  const [tempToken, setTempToken] = useState(localStorage.getItem('maral_gh_token') || '');
  const [configSaved, setConfigSaved] = useState(false);

  // Estados de notificación
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  if (!admin) return null;

  const handleLogin = () => {
    if (admin.isAdmin) {
      setIsOpen(!isOpen);
      if (isOpen) setShowSettings(false);
    } else {
      admin.setShowLoginModal(true);
    }
  };

  const saveConfig = () => {
    localStorage.setItem('maral_gh_repo', tempRepo);
    localStorage.setItem('maral_gh_token', tempToken);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const handleForceReset = () => {
    if (confirm('¿Resetear caché local? Se perderán cambios no publicados.')) {
      localStorage.removeItem('maral_menu');
      localStorage.removeItem('maral_version');
      localStorage.removeItem('maral_content');
      window.location.reload();
    }
  };

  const publishToGithub = async () => {
    const token = localStorage.getItem('maral_gh_token');
    const repo = localStorage.getItem('maral_gh_repo');
    
    if (!token || !repo) {
      setShowSettings(true);
      setStatus('error');
      setStatusMsg('Configura Repo y Token primero.');
      return;
    }

    setIsSyncing(true);
    setStatus('loading');
    
    try {
      const path = 'constants.ts';
      const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        headers: { 'Authorization': `token ${token}` }
      });
      
      if (!getRes.ok) throw new Error('Repo o Token inválido. Verifica la configuración.');
      
      const fileData = await getRes.json();
      const sha = fileData.sha;
      
      const fileContent = `export const APP_VERSION = "${APP_VERSION}";
export const RESTAURANT_DATA = ${JSON.stringify(RESTAURANT_DATA, null, 2)};
export interface MenuItem { name: string; price: string; desc: string; image?: string; side?: { name: string; price: string; }; }
export interface MenuCategory { id: string; name: string; items: MenuItem[]; extras?: MenuItem[]; }
export const INITIAL_MENU: MenuCategory[] = ${JSON.stringify(admin.menu, null, 2)};
export const REVIEWS = ${JSON.stringify(REVIEWS, null, 2)};`;

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `token ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          message: 'Update from Maral Web Panel', 
          content: btoa(unescape(encodeURIComponent(fileContent))), 
          sha 
        })
      });

      if (putRes.ok) {
        setStatus('success');
        setStatusMsg('¡Cambios publicados con éxito!');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error('Error al subir el archivo a GitHub.');
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMsg(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150] no-print flex flex-col items-end gap-4">
      {/* Notificaciones de Estado */}
      {status !== 'idle' && status !== 'loading' && (
        <div className={`flex items-center gap-3 px-6 py-4 rounded-sm shadow-2xl animate-in slide-in-from-right-10 duration-300 border-l-4 ${status === 'success' ? 'bg-zinc-900 border-green-500 text-green-400' : 'bg-zinc-900 border-red-500 text-red-400'}`}>
          {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-[10px] font-black uppercase tracking-widest">{statusMsg}</span>
          <button onClick={() => setStatus('idle')} className="ml-2 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {admin.isAdmin && isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-6 duration-300">
          {showSettings && (
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-sm shadow-[0_30px_100px_rgba(0,0,0,0.8)] w-85 animate-in fade-in zoom-in-95 mb-4 border-t-4 border-t-amber-600">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] flex items-center gap-2">
                  <Github size={14} /> GitHub Sincronización
                </h4>
                <button onClick={() => setShowSettings(false)} className="text-zinc-600 hover:text-white"><X size={16} /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase block mb-2 font-bold tracking-widest">Repositorio Destino</label>
                  <input 
                    type="text" 
                    placeholder="usuario/nombre-del-repo" 
                    value={tempRepo}
                    onChange={e => setTempRepo(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 text-[10px] text-white outline-none focus:border-amber-500 transition-all font-mono" 
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase block mb-2 font-bold tracking-widest">Personal Access Token (PAT)</label>
                  <input 
                    type="password" 
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                    value={tempToken}
                    onChange={e => setTempToken(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 text-[10px] text-white outline-none focus:border-amber-500 transition-all font-mono" 
                  />
                </div>
                
                <button 
                  onClick={saveConfig}
                  className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${configSaved ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                >
                  {configSaved ? <CheckCircle2 size={14} /> : <Settings size={14} />}
                  {configSaved ? 'Configuración Guardada' : 'Confirmar y Guardar'}
                </button>

                <div className="p-4 bg-amber-600/5 border border-amber-600/10 rounded-sm">
                  <p className="text-[8px] text-zinc-500 leading-relaxed font-medium uppercase tracking-tight">
                    El token permite a la web actualizar el archivo <code className="text-amber-500">constants.ts</code> automáticamente. No compartas este token.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={handleForceReset} 
              className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-white hover:border-zinc-700 rounded-sm shadow-xl transition-all" 
              title="Limpiar Caché Local"
            >
              <RefreshCcw size={18} />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className={`p-4 rounded-sm border transition-all shadow-xl ${showSettings ? 'bg-amber-600 text-white border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-white'}`}
              title="Configuración de GitHub"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={publishToGithub} 
              disabled={isSyncing} 
              className="bg-amber-600 text-white px-10 py-4 rounded-sm shadow-2xl hover:bg-amber-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 disabled:opacity-50 active:scale-95 transition-all"
            >
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
              {isSyncing ? 'Sincronizando' : 'Publicar Web'}
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={handleLogin} 
        className={`p-6 rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-300 border-2 active:scale-90 ${admin.isAdmin ? 'bg-amber-600 border-amber-400' : 'bg-amber-600 border-amber-500 hover:scale-105'}`}
      >
        {admin.isAdmin ? (
          isOpen ? <X size={28} className="text-white" /> : <ShieldCheck size={28} className="text-white" />
        ) : (
          <Lock size={24} className="text-white" />
        )}
      </button>
    </div>
  );
};

export default AdminFab;
