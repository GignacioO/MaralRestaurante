
import React, { useState, useEffect, useContext } from 'react';
import { Menu, X, Utensils, Lock, ShieldCheck } from 'lucide-react';
import { AdminContext } from '../App';

const Navbar: React.FC = () => {
  const admin = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú está abierto para evitar clics fantasma
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    }
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  const handleAdminAccess = (e?: React.PointerEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (admin?.isAdmin) {
      setIsOpen(false);
      return;
    }
    
    // El prompt debe ser directo por interacción del usuario para evitar bloqueos del navegador
    const pass = prompt('INGRESE CLAVE DE ACCESO:');
    if (pass === admin?.password) {
      admin.setIsAdmin(true);
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pass !== null) {
      alert('Clave incorrecta.');
    }
  };

  const navLinks = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Nosotros', id: 'nosotros' },
    { name: 'Menú', id: 'menu' },
    { name: 'Opiniones', id: 'opiniones' },
    { name: 'Contacto', id: 'contacto' },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled || isOpen ? 'bg-zinc-950 py-3 shadow-xl border-b border-zinc-900/50' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[110]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <Utensils className="text-amber-500 w-6 h-6" />
            <span className="text-xl font-bold tracking-widest serif text-zinc-100 uppercase">MARAL</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-xs font-bold hover:text-amber-500 transition-colors uppercase tracking-[0.2em] text-zinc-400 bg-transparent"
              >
                {link.name}
              </button>
            ))}
            <button
              onPointerDown={() => handleAdminAccess()}
              className={`text-xs font-bold transition-colors uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer ${admin?.isAdmin ? 'text-amber-500' : 'text-zinc-500 hover:text-amber-500'}`}
            >
              {admin?.isAdmin ? <ShieldCheck size={14} /> : <Lock size={14} />}
              {admin?.isAdmin ? 'Admin' : 'Acceso'}
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onPointerDown={() => setIsOpen(!isOpen)} 
              className="text-zinc-100 p-2 focus:outline-none touch-manipulation relative z-[120]"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={32} className="text-amber-500" /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil - Rediseñado para respuesta táctil inmediata */}
      <div className={`fixed inset-0 bg-zinc-950 z-[90] md:hidden transition-all duration-300 flex flex-col ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="flex-1 pt-28 pb-10 px-6 overflow-y-auto space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left px-5 py-6 text-zinc-100 border-b border-zinc-900/50 hover:bg-zinc-900 uppercase tracking-[0.25em] text-sm font-bold transition-all active:bg-amber-600/10 touch-manipulation"
            >
              {link.name}
            </button>
          ))}
          
          <div className="pt-6">
            <button
              onPointerDown={handleAdminAccess}
              className={`w-full text-left px-5 py-8 uppercase tracking-[0.25em] text-sm font-black flex items-center gap-5 transition-all rounded-sm shadow-2xl border border-zinc-900 touch-manipulation cursor-pointer ${admin?.isAdmin ? 'text-amber-500 bg-amber-600/5 border-amber-500/20' : 'text-zinc-100 bg-zinc-900/60 active:bg-amber-600 active:text-white'}`}
            >
              <div className={`p-4 rounded-full shadow-lg shrink-0 ${admin?.isAdmin ? 'bg-amber-600 text-white' : 'bg-amber-600 text-white shadow-amber-900/40'}`}>
                {admin?.isAdmin ? <ShieldCheck size={26} strokeWidth={2.5} /> : <Lock size={26} strokeWidth={2.5} />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs tracking-[0.3em] font-black">
                  {admin?.isAdmin ? 'MODO ADMIN ACTIVO' : 'ACCESO PRIVADO'}
                </span>
                {!admin?.isAdmin && <span className="text-[9px] text-zinc-500 font-normal tracking-widest mt-1">Sincronización y Edición</span>}
              </div>
            </button>
          </div>
        </div>
        
        <div className="pb-12 pt-6 text-center border-t border-zinc-900/50 bg-zinc-950/50 backdrop-blur-sm">
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em]">Maral Restaurante • Buenos Aires</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
