
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Lock, Key, RotateCcw, RotateCw, Code, X, ShieldCheck } from 'lucide-react';
import { AdminContext } from '../App';

const AdminFab: React.FC = () => {
  const admin = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<number | null>(null);

  if (!admin) return null;

  const handleStartPress = () => {
    setIsPressing(true);
    timerRef.current = window.setTimeout(() => {
      triggerLogin();
      setIsPressing(false);
    }, 1500);
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
    const pass = prompt('Clave Maestra de Maral:');
    if (pass === admin.password) {
      admin.setIsAdmin(true);
      setIsOpen(true);
    } else if (pass !== null) {
      alert('Clave incorrecta.');
    }
  };

  const handleChangePassword = () => {
    const currentPass = prompt('Ingresa la contraseña ACTUAL para confirmar:');
    if (currentPass === admin.password) {
      const newPass = prompt('Ingresa la NUEVA clave maestra:');
      if (newPass && newPass.trim().length >= 4) {
        admin.updatePassword(newPass);
        alert('Clave actualizada con éxito. Guárdala bien.');
      } else {
        alert('La clave es muy corta o inválida.');
      }
    } else if (currentPass !== null) {
      alert('La contraseña actual es incorrecta.');
    }
  };

  const handlePublish = () => {
    window.dispatchEvent(new CustomEvent('open-github-export'));
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] no-print flex flex-col items-end gap-3">
      {/* Menú de herramientas */}
      {admin.isAdmin && isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={handleChangePassword}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-3 rounded-full shadow-xl hover:bg-zinc-800 text-amber-500 text-xs font-bold uppercase tracking-widest"
          >
            <Key size={16} /> Cambiar Clave
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={admin.undo} 
              disabled={!admin.canUndo}
              className={`p-4 rounded-full shadow-xl transition-all ${admin.canUndo ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'}`}
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={admin.redo} 
              disabled={!admin.canRedo}
              className={`p-4 rounded-full shadow-xl transition-all ${admin.canRedo ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'}`}
            >
              <RotateCw size={20} />
            </button>
          </div>

          <button 
            onClick={handlePublish}
            className="flex items-center gap-2 bg-amber-600 text-white px-5 py-3 rounded-full shadow-xl hover:bg-amber-500 font-bold text-xs uppercase tracking-widest"
          >
            <Code size={16} /> Publicar cambios
          </button>

          <button 
            onClick={() => { admin.setIsAdmin(false); setIsOpen(false); }}
            className="flex items-center gap-2 bg-red-900 text-white px-5 py-3 rounded-full shadow-xl hover:bg-red-800 font-bold text-xs uppercase tracking-widest"
          >
            <Lock size={16} /> Cerrar Admin
          </button>
        </div>
      )}

      {/* Botón Principal (Visible siempre) */}
      <button
        onMouseDown={handleStartPress}
        onMouseUp={handleEndPress}
        onTouchStart={handleStartPress}
        onTouchEnd={handleEndPress}
        className={`relative p-5 rounded-full shadow-2xl transition-all duration-300 transform border-2 ${
          isPressing ? 'scale-90 bg-amber-500 border-white' : 
          admin.isAdmin ? 'bg-amber-600 border-amber-400 hover:scale-110' : 'bg-zinc-900 border-amber-500/50 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
        }`}
      >
        {isPressing && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%" cy="50%" r="48%"
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
          isOpen ? <X size={24} className="text-white" /> : <ShieldCheck size={24} className="text-white" />
        ) : (
          <Lock size={20} className="text-amber-500" />
        )}
      </button>

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
