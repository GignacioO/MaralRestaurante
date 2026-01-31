
import React, { useState, useContext } from 'react';
import { Lock, Key, RotateCcw, RotateCw, Save, X, ShieldCheck, Mail } from 'lucide-react';
import { AdminContext } from '../App';

const AdminFab: React.FC = () => {
  const admin = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);

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
    const current = admin.password;
    const requested = prompt('Ingrese la nueva clave deseada:');
    if (!requested) return;

    const subject = encodeURIComponent(`Solicitud de Cambio de Clave - Maral Restaurante`);
    const body = encodeURIComponent(`Hola Ignacio,\n\nSe ha solicitado un cambio de clave para el panel de administración.\n\nClave Actual: ${current}\nNueva Clave Solicitada: ${requested}\n\nPor favor, responde con "ACEPTO" o "DECLINO" para proceder.`);
    
    // Al ser una app estática, usamos mailto para asegurar que el dueño reciba la info real
    window.location.href = `mailto:ignaciogrizzo@gmail.com?subject=${subject}&body=${body}`;
    alert('Se ha generado un correo de solicitud para ignaciogrizzo@gmail.com. El cambio se aplicará cuando el dueño lo autorice.');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200] no-print flex flex-col items-end gap-4">
      {admin.isAdmin && isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-6 duration-300">
          <button 
            onClick={handleRequestPasswordChange}
            className="flex items-center gap-3 bg-zinc-900 border border-amber-500/30 px-5 py-3 rounded-sm shadow-2xl hover:bg-zinc-800 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
          >
            <Mail size={16} /> Solicitar Nueva Clave
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={admin.undo} 
              disabled={!admin.canUndo}
              className={`p-4 rounded-sm border transition-all ${admin.canUndo ? 'bg-zinc-800 text-amber-500 border-zinc-700' : 'bg-zinc-900 text-zinc-800 border-zinc-900 opacity-50 cursor-not-allowed'}`}
              title="Deshacer"
            >
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={admin.redo} 
              disabled={!admin.canRedo}
              className={`p-4 rounded-sm border transition-all ${admin.canRedo ? 'bg-zinc-800 text-amber-500 border-zinc-700' : 'bg-zinc-900 text-zinc-800 border-zinc-900 opacity-50 cursor-not-allowed'}`}
              title="Rehacer"
            >
              <RotateCw size={18} />
            </button>
          </div>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-github-export'))}
            className="flex items-center gap-3 bg-amber-600 text-white px-8 py-4 rounded-sm shadow-2xl hover:bg-amber-500 font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
          >
            <Save size={18} /> Guardar Permaneciendo
          </button>

          <button 
            onClick={() => { admin.setIsAdmin(false); setIsOpen(false); }}
            className="flex items-center gap-3 bg-red-950 text-white px-8 py-3 rounded-sm hover:bg-red-900 font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            <Lock size={16} /> Salir Modo Admin
          </button>
        </div>
      )}

      <button
        onClick={handleLogin}
        className={`p-6 rounded-full shadow-2xl transition-all duration-300 border-2 ${
          admin.isAdmin ? 'bg-amber-600 border-amber-400 rotate-0' : 'bg-zinc-900 border-amber-500 hover:scale-110'
        }`}
      >
        {admin.isAdmin ? (isOpen ? <X size={28} /> : <ShieldCheck size={28} />) : <Lock size={24} className="text-amber-500" />}
      </button>
    </div>
  );
};

export default AdminFab;
