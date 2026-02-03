
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Lock, RotateCcw, RotateCw, Save, X, ShieldCheck, Settings, Loader2, RefreshCcw, CheckCircle2, AlertCircle, Github, Eye, EyeOff, Globe, ExternalLink, Info, AlertTriangle, Terminal, Activity, ChevronDown, ChevronUp, Search, Key, Check, FileCode, WifiOff, Trash2, GitBranch, RefreshCw } from 'lucide-react';
import { AdminContext } from '../App';
import { RESTAURANT_DATA, REVIEWS, APP_VERSION } from '../constants';

type SyncStatus = 'idle' | 'loading' | 'success' | 'error';

const AdminFab: React.FC = () => {
  const admin = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const sessionVersionRef = useRef<string>(APP_VERSION);
  
  const [tempRepo, setTempRepo] = useState(localStorage.getItem('maral_gh_repo') || '');
  const [tempToken, setTempToken] = useState(localStorage.getItem('maral_gh_token') || '');
  const [tempBranch, setTempBranch] = useState(localStorage.getItem('maral_gh_branch') || 'main');
  const [showToken, setShowToken] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  const [status, setStatus] = useState<SyncStatus>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [lastLog, setLastLog] = useState<string[]>([]);

  if (!admin) return null;

  const addLog = (msg: string) => {
    setLastLog(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleLogin = () => {
    if (admin.isAdmin) {
      setIsOpen(!isOpen);
      if (isOpen) setShowSettings(false);
    } else {
      admin.setShowLoginModal(true);
    }
  };

  const sanitizeInput = (val: string) => {
    return val.replace(/[\u2013\u2014]/g, "-").replace(/\s+/g, '').trim();
  };

  const saveConfig = () => {
    const cleanRepo = sanitizeInput(tempRepo);
    const cleanToken = sanitizeInput(tempToken);
    const cleanBranch = sanitizeInput(tempBranch) || 'main';
    
    if (!cleanRepo || !cleanToken) {
      alert("Faltan datos críticos.");
      return;
    }

    localStorage.setItem('maral_gh_repo', cleanRepo);
    localStorage.setItem('maral_gh_token', cleanToken);
    localStorage.setItem('maral_gh_branch', cleanBranch);
    setTempRepo(cleanRepo);
    setTempToken(cleanToken);
    setTempBranch(cleanBranch);
    setConfigSaved(true);
    addLog(`Configuración guardada (Rama: ${cleanBranch})`);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const resetConfig = () => {
    if(confirm("¿Borrar configuración de este dispositivo?")) {
      localStorage.removeItem('maral_gh_repo');
      localStorage.removeItem('maral_gh_token');
      localStorage.removeItem('maral_gh_branch');
      setTempRepo('');
      setTempToken('');
      setTempBranch('main');
      addLog("Memoria limpia.");
    }
  };

  const publishToGithub = async () => {
    const token = sanitizeInput(localStorage.getItem('maral_gh_token') || '');
    const repo = sanitizeInput(localStorage.getItem('maral_gh_repo') || '');
    const branch = sanitizeInput(localStorage.getItem('maral_gh_branch') || 'main');
    
    setLastLog([]);
    addLog('--- INICIANDO PUBLICACIÓN ---');

    if (!token || !repo) {
      setStatus('error');
      setStatusMsg('Configuración incompleta.');
      setShowSettings(true);
      return;
    }

    setIsSyncing(true);
    setStatus('loading');
    
    try {
      const parts = sessionVersionRef.current.split('.');
      const nextVer = parts.slice(0, -1).concat([(parseInt(parts[parts.length-1]) + 1).toString()]).join('.');
      addLog(`Subiendo actualización a v${nextVer}...`);

      // Mejorado: Forzamos a la API de GitHub a darnos la versión más fresca ignorando cualquier caché
      const apiUrl = `https://api.github.com/repos/${repo}/contents/constants.ts?ref=${branch}&t=${Date.now()}`;
      
      const getRes = await fetch(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      let sha: string | undefined = undefined;
      if (getRes.ok) {
        const data = await getRes.json();
        sha = data.sha;
        addLog(`Sincronización de ID exitosa.`);
      }

      const fileContent = `export const APP_VERSION = "${nextVer}";
export const RESTAURANT_DATA = ${JSON.stringify(RESTAURANT_DATA, null, 2)};
export const INITIAL_CONTENT = ${JSON.stringify(admin.content, null, 2)};
export interface MenuItem { name: string; price: string; desc: string; image?: string; side?: { name: string; price: string; }; }
export interface MenuCategory { id: string; name: string; items: MenuItem[]; extras?: MenuItem[]; }
export const INITIAL_MENU: MenuCategory[] = ${JSON.stringify(admin.menu, null, 2)};
export const REVIEWS = ${JSON.stringify(REVIEWS, null, 2)};`;

      const utf8Bytes = new TextEncoder().encode(fileContent);
      const base64Content = btoa(String.fromCharCode(...utf8Bytes));

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/constants.ts`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({ 
          message: `Update v${nextVer} via Admin Panel`, 
          content: base64Content, 
          sha,
          branch 
        })
      });

      if (putRes.ok) {
        sessionVersionRef.current = nextVer;
        setStatus('success');
        setStatusMsg(`¡Actualizado a v${nextVer}!`);
        localStorage.setItem('maral_version', nextVer);
        addLog(`Publicado correctamente.`);
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errJson = await putRes.json();
        if (errJson.message && errJson.message.includes('match')) {
          throw new Error("ERROR DE ID: GitHub detectó un cambio externo. Por favor, refresca la página (F5) e intenta de nuevo.");
        }
        throw new Error(errJson.message || 'Error en servidor de GitHub');
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMsg(err.message);
      addLog(`FALLO: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150] no-print flex flex-col items-end gap-4 max-w-[90vw]">
      {status !== 'idle' && (
        <div className={`flex flex-col gap-1 px-6 py-4 rounded-sm shadow-2xl border-l-4 w-[300px] sm:w-[450px] animate-in slide-in-from-right-10 duration-300 ${
          status === 'loading' ? 'bg-zinc-900 border-amber-500 text-amber-500' :
          status === 'success' ? 'bg-zinc-900 border-green-500 text-green-400' : 
          'bg-zinc-900 border-red-500 text-red-400'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} /> Estado
            </span>
            <button onClick={() => setStatus('idle')} className="text-zinc-600 hover:text-white"><X size={14} /></button>
          </div>
          <p className="text-[11px] font-bold mb-3">{statusMsg}</p>
          <div className="bg-black/50 p-4 rounded font-mono text-[9px] text-zinc-400 space-y-1.5 max-h-[180px] overflow-y-auto border border-white/5">
            {lastLog.map((log, i) => <p key={i} className="border-b border-white/5 pb-1 last:border-0">{log}</p>)}
          </div>
          {status === 'error' && (
            <button onClick={() => window.location.reload()} className="mt-4 bg-zinc-800 py-2 text-[9px] uppercase font-black hover:bg-zinc-700 transition-colors">
              Refrescar y reintentar
            </button>
          )}
        </div>
      )}

      {admin.isAdmin && isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-6 duration-300">
          {showSettings && (
            <div className="fixed inset-0 md:relative md:inset-auto bg-zinc-950 border md:border-zinc-800 p-6 sm:p-8 md:rounded-sm shadow-2xl w-full md:w-[480px] z-[200] flex flex-col border-t-4 border-t-amber-600">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] flex items-center gap-2">
                  <Terminal size={14} /> Configuración GitHub
                </h4>
                <button onClick={() => setShowSettings(false)} className="text-zinc-600 hover:text-white p-2"><X size={24} /></button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Usuario/Repo</label>
                    <input 
                      type="text" 
                      placeholder="usuario/repo" 
                      value={tempRepo}
                      onChange={e => setTempRepo(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs text-white outline-none focus:border-amber-500 font-mono rounded-sm" 
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Rama</label>
                    <input 
                      type="text" 
                      placeholder="main" 
                      value={tempBranch}
                      onChange={e => setTempBranch(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs text-white outline-none focus:border-amber-500 font-mono rounded-sm" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Token Personal</label>
                  <div className="relative">
                    <input 
                      type={showToken ? "text" : "password"} 
                      placeholder="ghp_..." 
                      value={tempToken}
                      onChange={e => setTempToken(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 pr-12 text-xs text-white outline-none focus:border-amber-500 font-mono rounded-sm" 
                    />
                    <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">{showToken ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={saveConfig} className={`py-4 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-all ${configSaved ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
                    {configSaved ? <Check size={14} /> : <Save size={14} />} Guardar
                  </button>
                  <button onClick={resetConfig} className="py-4 bg-zinc-900 text-zinc-600 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:text-red-500 rounded-sm border border-zinc-800">
                    <Trash2 size={14} /> Borrar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setShowSettings(!showSettings)} className={`p-4 rounded-sm border transition-all shadow-xl ${showSettings ? 'bg-amber-600 text-white border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-white'}`}><Settings size={18} /></button>
            <button onClick={publishToGithub} disabled={isSyncing} className="bg-green-600 text-white px-8 py-4 rounded-sm shadow-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-green-500 active:scale-95 transition-all">
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />} 
              {isSyncing ? 'Subiendo...' : 'Publicar Todo'}
            </button>
          </div>
        </div>
      )}

      <button onClick={handleLogin} className={`p-6 rounded-full shadow-2xl transition-all duration-300 border-2 active:scale-95 ${admin.isAdmin ? 'bg-amber-600 border-amber-400' : 'bg-amber-600 border-amber-500'}`}>
        {admin.isAdmin ? (isOpen ? <X size={28} className="text-white" /> : <ShieldCheck size={28} className="text-white" />) : <Lock size={24} className="text-white" />}
      </button>
    </div>
  );
};

export default AdminFab;
