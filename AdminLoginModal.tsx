
import React, { useState, useContext } from 'react';
// Corrected import path for AdminContext
import { AdminContext } from './context/AdminContext';
import { X } from 'lucide-react';

const AdminLoginModal: React.FC = () => {
  const admin = useContext(AdminContext);
  const [inputValue, setInputValue] = useState('');

  // Improved guard check for cleaner type narrowing
  if (!admin || !admin.showLoginModal) return null;

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
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm p-8 rounded-sm border-t-4 border-t-amber-600 shadow-2xl relative">
        <button onClick={() => admin.setShowLoginModal(false)} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
        <h3 className="text-2xl font-bold serif text-zinc-100 text-center mb-8 uppercase tracking-widest">Acceso Privado</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="password" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 text-center text-white outline-none focus:border-amber-500 rounded-sm"
            placeholder="Contraseña"
            autoFocus
          />
          <button type="submit" className="w-full bg-amber-600 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 transition-colors rounded-sm">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
