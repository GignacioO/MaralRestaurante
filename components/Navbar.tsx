
import React, { useState, useEffect } from 'react';
import { Menu, X, Utensils } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
    setIsOpen(false);
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
                className="text-xs font-bold hover:text-amber-500 transition-colors uppercase tracking-[0.2em] text-zinc-400 bg-transparent"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-100 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 animate-in fade-in slide-in-from-top-4">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-4 py-4 text-zinc-100 hover:bg-zinc-800 uppercase tracking-widest text-xs font-bold"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
