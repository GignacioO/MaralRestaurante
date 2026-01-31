
import React, { useState, useContext, useRef } from 'react';
import { Lock, Key, RotateCcw, RotateCw, Code, X, ShieldCheck } from 'lucide-react';
import { AdminContext } from '../App';

const AdminFab: React.FC = () => {
  const admin = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<number | null>(null);

  if (!admin) return null;

  const handleStartPress = (e: React.MouseEvent | React.TouchEvent) => {
    // Evitamos que el evento se propague si es necesario
    setIsPressing(true);
    timerRef.current = window.setTimeout(() => {
      triggerLogin();
      setIsPressing(false);
    }, 1500); // 1.5 segundos sostenido para entrar
  };

  const handleEndPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
  };

  const triggerLogin = () => {
    if (admin.isAdmin) {
      setIsOpen(!isOpen);
      return;
    }
    const pass = prompt('INGRESE CLAVE MAESTRA (Default: admin123):');
    if (pass === admin.password) {
      admin.setIsAdmin(true);
      setIsOpen(true);
    } else if (pass !== null) {
      alert('Clave incorrecta.');
    }
  };

  const handleChangePassword = () => {
    const currentPass = prompt('Para cambiar la clave, ingrese la CLAVE ACTUAL:');
    if (currentPass === admin.password) {
      const newPass = prompt('Ingrese la NUEVA CLAVE MAESTRA:');
      if (newPass && newPass.trim().length >= 4) {
        admin.updatePassword(newPass);
        alert('¡Éxito! Nueva clave guardada.');
      } else if (newPass !== null) {
        alert('La clave debe tener al menos 4 caracteres.');
      }
    } else if (currentPass !== null) {
      alert('Contraseña actual incorrecta.');
    }
  };

  const handlePublish = () => {
    window.dispatchEvent(new CustomEvent('open-github-export'));
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] no-print flex flex-col items-end gap-4">
      {/* Panel de Control (Solo visible si es Admin y está abierto) */}
      {admin.isAdmin && isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={handleChangePassword}
            className="flex items-center gap-3 bg-zinc-900 border border-amber-500/50 px-5 py-3 rounded-full shadow-2xl hover:bg-zinc-800 text-amber-500 text-xs font-bold uppercase tracking-widest transition-all"
          >
            <Key size={18} /> Cambiar Contraseña
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={admin.undo} 
              disabled={!admin.canUndo}
              title="Deshacer"
              className={`p-4 rounded-full shadow-2xl transition-all border ${admin.canUndo ? 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700' : 'bg-zinc-900 text-zinc-700 border-zinc-800 cursor-not-allowed'}`}
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={admin.redo} 
              disabled={!admin.canRedo}
              title="Rehacer"
              className={`p-4 rounded-full shadow-2xl transition-all border ${admin.canRedo ? 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700' : 'bg-zinc-900 text-zinc-700 border-zinc-800 cursor-not-allowed'}`}
            >
              <RotateCw size={20} />
            </button>
          </div>

          <button 
            onClick={handlePublish}
            className="flex items-center gap-3 bg-amber-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-amber-500 font-bold text-xs uppercase tracking-widest transition-all"
          >
            <Code size={18} /> Publicar en la Web
          </button>

          <button 
            onClick={() => { admin.setIsAdmin(false); setIsOpen(false); }}
            className="flex items-center gap-3 bg-red-900 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-red-800 font-bold text-xs uppercase tracking-widest transition-all"
          >
            <Lock size={18} /> Salir Modo Edición
          </button>
        </div>
      )}

      {/* Botón Principal: El "Botón Maestro" */}
      <div className="relative">
        {/* Efecto de Pulso para que no pase desapercibido */}
        {!admin.isAdmin && (
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
        )}
        
        <button
          onMouseDown={handleStartPress}
          onMouseUp={handleEndPress}
          onMouseLeave={handleEndPress}
          onTouchStart={handleStartPress}
          onTouchEnd={handleEndPress}
          className={`relative p-6 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300 transform border-2 flex items-center justify-center ${
            isPressing ? 'scale-90 bg-amber-500 border-white' : 
            admin.isAdmin ? 'bg-amber-600 border-amber-300 hover:scale-110' : 'bg-zinc-900 border-amber-500 hover:border-amber-400'
          }`}
        >
          {isPressing && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%" cy="50%" r="46%"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray="100"
                className="animate-[progress_1.5s_linear_forwards]"
                style={{ strokeDashoffset: '100' }}
              />
            </svg>
          )}
          
          {admin.isAdmin ? (
            isOpen ? <X size={28} className="text-white" /> : <ShieldCheck size={28} className="text-white" />
          ) : (
            <div className="flex flex-col items-center">
              <Lock size={24} className="text-amber-500" />
              <span className="absolute -top-10 right-0 bg-amber-500 text-black text-[9px] font-bold px-2 py-1 rounded-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">MANTENER PARA ENTRAR</span>
            </div>
          )}
        </button>
      </div>

      <style>{`
        @keyframes progress {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default AdminFab;
