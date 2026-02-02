
import React, { useState, useContext, useEffect } from 'react';
import { AdminContext } from '../App';
import { X, Lock, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

const AdminLoginModal: React.FC = () => {
  const admin = useContext(AdminContext);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!admin?.showLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === admin.password) {
      admin.setIsAdmin(true);
      admin.setShowLoginModal(false);
      setInputValue('');
      setError(false);
      setShowPassword(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(true);
      setInputValue('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 no-print">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm p-8 shadow-[0_0_80px_rgba(217,119,6,0.15)] relative rounded-sm border-t-4 border-t-amber-600">
        <button 
          onClick={() => admin.setShowLoginModal(false)} 
          className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-600/20">
            <Lock className="text-amber-500" size={28} />
          </div>
          <h3 className="text-xl font-bold serif text-zinc-100 tracking-tight uppercase">Panel Administrativo</h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-2 font-bold">Acceso Restringido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              autoFocus
              type={showPassword ? "text" : "password"} 
              placeholder="Ingrese clave..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`w-full bg-zinc-900 border ${error ? 'border-red-500 animate-shake' : 'border-zinc-800'} p-4 pr-12 text-center text-sm outline-none focus:border-amber-500 text-white transition-all tracking-[0.5em] font-black`}
            />
            {/* Botón de visibilidad de contraseña (Ojito) */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-500 transition-colors z-10"
              title={showPassword ? "Ocultar clave" : "Mostrar clave"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            
            {error && (
              <p className="text-red-500 text-[9px] uppercase font-bold tracking-widest mt-3 text-center flex items-center justify-center gap-2">
                <AlertCircle size={10} /> Clave incorrecta
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-amber-600 text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/20 active:scale-95"
          >
            Validar Credenciales
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] text-zinc-700 uppercase tracking-widest">
          Maral Restaurante • Buenos Aires
        </p>
      </div>
    </div>
  );
};

export default AdminLoginModal;
