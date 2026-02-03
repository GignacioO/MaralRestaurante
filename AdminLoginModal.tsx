
import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { X, Lock, Eye, EyeOff } from 'lucide-react';

const AdminLoginModal: React.FC = () => {
  const admin = useContext(AdminContext);
  const [inputValue, setInputValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!admin?.showLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === admin.password) {
      admin.setIsAdmin(true);
      admin.setShowLoginModal(false);
      setInputValue('');
    } else {
      alert("Contraseña incorrecta");
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md no-print">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm p-8 rounded-sm border-t-4 border-t-amber-600">
        <button onClick={() => admin.setShowLoginModal(false)} className="absolute top-4 right-4 text-zinc-600"><X size={24} /></button>
        <h3 className="text-2xl font-bold serif text-zinc-100 text-center mb-8 uppercase tracking-widest">Acceso Privado</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type={showPassword ? "text" : "password"} 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 text-center text-white outline-none focus:border-amber-500"
            placeholder="Contraseña"
          />
          <button type="submit" className="w-full bg-amber-600 py-4 text-[10px] font-black uppercase tracking-widest text-white">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
