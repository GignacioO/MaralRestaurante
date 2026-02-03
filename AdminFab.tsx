
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Lock, RotateCcw, RotateCw, Save, X, ShieldCheck, Settings, Loader2, RefreshCcw, CheckCircle2, AlertCircle, Github, Eye, EyeOff, Globe, ExternalLink, Info, AlertTriangle, Terminal, Activity, ChevronDown, ChevronUp, Search, Key, Check, FileCode, WifiOff, Trash2, GitBranch, RefreshCw } from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
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

  const isConfigIncomplete = !tempRepo || !tempToken;
  const addLog = (msg: string) => setLastLog(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleLogin = () => {
    if (admin.isAdmin) {
      setIsOpen(!isOpen);
      if (isOpen) setShowSettings(false);
    } else {
      admin.setShowLoginModal(true);
    }
  };

  const publishToGithub = async () => {
    const token = (localStorage.getItem('maral_gh_token') || '').trim();
    const repo = (localStorage.getItem('maral_gh_repo') || '').trim();
    const branch = (localStorage.getItem('maral_gh_branch') || 'main').trim();
    
    if (!token || !repo) { setStatus('error'); setStatusMsg('Configura GitHub primero.'); setShowSettings(true); return; }

    setIsSyncing(true); setStatus('loading');
    try {
      const parts = sessionVersionRef.current.split('.');
      const nextVer = parts.slice(0, -1).concat([(parseInt(parts[parts.length-1]) + 1).toString()]).join('.');
      
      const apiUrl = `https://api.github.com/repos/${repo}/contents/constants.ts?ref=${branch}&t=${Date.now()}`;
      const getRes = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      
      let sha: string | undefined = undefined;
      if (getRes.ok) { const data = await getRes.json(); sha = data.sha; }

      const fileContent = `export const APP_VERSION = "${nextVer}";
export const RESTAURANT_DATA = ${JSON.stringify(RESTAURANT_DATA, null, 2)};
export const INITIAL_CONTENT = ${JSON.stringify(admin.content, null, 2)};
export interface MenuItem { name: string; price: string; desc: string; image?: string; side?: { name: string; price: string; }; }
export interface MenuCategory { id: string; name: string; items: MenuItem[]; extras?: MenuItem[]; }
export const INITIAL_MENU: MenuCategory[] = ${JSON.stringify(admin.menu, null, 2)};
export const REVIEWS = ${JSON.stringify(REVIEWS, null, 2)};`;

      const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/constants.ts`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Update v${nextVer}`, content: base64Content, sha, branch })
      });

      if (putRes.ok) {
        sessionVersionRef.current = nextVer;
        setStatus('success'); setStatusMsg(`¡Web v${nextVer} publicada!`);
        localStorage.setItem('maral_version', nextVer);
      } else { throw new Error('Error al guardar en GitHub'); }
    } catch (err: any) { setStatus('error'); setStatusMsg(err.message); } finally { setIsSyncing(false); }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150] no-print flex flex-col items-end gap-4">
      {status !== 'idle' && (
        <div className={`p-4 rounded border-l-4 w-[300px] bg-zinc-900 ${status === 'loading' ? 'border-amber-500 text-amber-500' : status === 'success' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}>
          <p className="text-[10px] font-bold">{statusMsg}</p>
        </div>
      )}
      <button onClick={handleLogin} className="p-6 rounded-full bg-amber-600 border-2 border-amber-400 shadow-2xl">
        {admin.isAdmin ? (isOpen ? <X size={28} className="text-white" /> : <ShieldCheck size={28} className="text-white" />) : <Lock size={24} className="text-white" />}
      </button>
      {admin.isAdmin && isOpen && (
        <button onClick={publishToGithub} disabled={isSyncing} className="px-6 py-4 bg-green-600 text-white text-[10px] font-black uppercase rounded shadow-xl">
          {isSyncing ? 'Subiendo...' : 'Publicar Todo'}
        </button>
      )}
    </div>
  );
};

export default AdminFab;
