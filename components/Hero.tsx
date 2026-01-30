
import React, { useContext } from 'react';
import { ArrowRight, ChevronDown, Edit2 } from 'lucide-react';
import { RESTAURANT_DATA } from '../constants';
import { AdminContext } from '../App';

const Hero: React.FC = () => {
  const admin = useContext(AdminContext);
  
  const scrollToId = (id: string) => {
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
  };

  const editHero = () => {
    const title = prompt('Nuevo título principal:', admin?.content.heroTitle);
    const subtitle = prompt('Nuevo subtítulo:', admin?.content.heroSubtitle);
    if (title || subtitle) {
      admin?.updateContent({ 
        heroTitle: title || admin?.content.heroTitle, 
        heroSubtitle: subtitle || admin?.content.heroSubtitle 
      });
    }
  };

  return (
    <section id="inicio" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920"
          alt="Restaurante Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto group">
        {admin?.isAdmin && (
          <button 
            onClick={editHero}
            className="absolute -top-10 left-1/2 -translate-x-1/2 p-2 bg-amber-600 text-white rounded-full hover:bg-amber-500 transition-all opacity-0 group-hover:opacity-100 no-print"
          >
            <Edit2 size={16} />
          </button>
        )}
        <span className="text-amber-500 font-semibold tracking-[0.3em] uppercase text-sm mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
          Experiencia Culinaria Única
        </span>
        <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 uppercase">
          {admin?.content.heroTitle || RESTAURANT_DATA.name}
        </h1>
        <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {admin?.content.heroSubtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <button
            onClick={() => scrollToId('menu')}
            className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-none transition-all flex items-center justify-center gap-2 group shadow-lg shadow-amber-900/20"
          >
            VER MENÚ <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollToId('contacto')}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-500 hover:border-zinc-100 hover:bg-white/5 text-zinc-100 font-semibold rounded-none transition-all"
          >
            RESERVAR MESA
          </button>
        </div>
      </div>

      <div 
        onClick={() => scrollToId('nosotros')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500 cursor-pointer no-print"
      >
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;
