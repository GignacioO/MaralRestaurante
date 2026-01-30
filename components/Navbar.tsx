
import React, { useState, useEffect, useContext } from 'react';
import { Menu, X, Utensils, Lock, Unlock, RefreshCw } from 'lucide-react';
import { AdminContext } from '../App';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const admin = useContext(AdminContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleAdminAccess = () => {
    if (!admin) return;

    if (admin.isAdmin) {
      if (confirm('¿Deseas salir del modo administrador?')) {
        admin.setIsAdmin(false);
      }
    } else {
      const pass = prompt('Clave de acceso (default: admin123):');
      if (pass === admin.password) {
        admin.setIsAdmin(true);
        alert('¡MODO EDICIÓN ACTIVADO!\nAhora puedes editar textos y platos haciendo clic en los iconos de lápiz.');
      } else if (pass !== null) {
        alert('Clave incorrecta.');
      }
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    if (confirm('¿Deseas restablecer el menú a la versión oficial? Se perderán tus cambios locales no guardados en el código.')) {
      localStorage.removeItem('maral_menu');
      localStorage.removeItem('maral_content');
      window.location.reload();
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/95 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="text-sm font-medium hover:text-amber-500 transition-colors uppercase tracking-wider text-zinc-300 bg-transparent border-none cursor-pointer"
              >
                {link.name}
              </button>
            ))}
            
            <div className="flex items-center gap-2">
              {admin?.isAdmin && (
                <button
                  onClick={handleReset}
                  title="Restablecer a versión oficial"
                  className="p-2 text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
              )}
              <button
                onClick={handleAdminAccess}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-full border ${admin?.isAdmin ? 'bg-amber-600 border-amber-600 text-white' : 'border-zinc-700 text-zinc-400 hover:border-amber-500 hover:text-amber-500'}`}
              >
                {admin?.isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
                {admin?.isAdmin ? 'ADMIN ACTIVO' : 'PRIVADO'}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            {admin?.isAdmin && (
               <button onClick={handleReset} className="text-zinc-500"><RefreshCw size={20} /></button>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-100 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-4 py-4 text-zinc-100 hover:bg-zinc-800 transition-colors uppercase tracking-widest text-sm"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={handleAdminAccess}
              className={`block w-full text-left px-4 py-4 uppercase tracking-widest text-sm font-bold ${admin?.isAdmin ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-400'}`}
            >
              {admin?.isAdmin ? 'CERRAR SESIÓN ADMIN' : 'ACCESO PRIVADO'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
