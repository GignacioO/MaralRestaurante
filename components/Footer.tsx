
import React, { useContext } from 'react';
import { Utensils, Lock } from 'lucide-react';
import { RESTAURANT_DATA } from '../constants';
import { AdminContext } from '../App';

const Footer: React.FC = () => {
  const admin = useContext(AdminContext);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
  };

  const handleAdminAccess = () => {
    if (admin?.isAdmin) return;
    const pass = prompt('INGRESE CLAVE DE ACCESO:');
    if (pass === admin?.password) {
      admin.setIsAdmin(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pass !== null) {
      alert('Clave incorrecta.');
    }
  };

  return (
    <footer className="bg-zinc-950 pt-20 pb-10 border-t border-zinc-900 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Utensils className="w-6 h-6 text-amber-500" />
              <span className="text-2xl font-bold tracking-widest serif text-zinc-100 uppercase">
                {RESTAURANT_DATA.name}
              </span>
            </div>
            <p className="text-zinc-500 max-w-sm leading-relaxed text-sm">
              Dedicados a brindar la mejor experiencia gastronómica en el corazón de Buenos Aires. Calidad, tradición y confort en cada detalle.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-zinc-100 font-bold uppercase tracking-widest text-xs">Navegación</h4>
            <ul className="space-y-4 text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">
              <li><button onClick={() => scrollToId('inicio')} className="hover:text-amber-500">Inicio</button></li>
              <li><button onClick={() => scrollToId('menu')} className="hover:text-amber-500">Menú</button></li>
              <li><button onClick={() => scrollToId('opiniones')} className="hover:text-amber-500">Opiniones</button></li>
              <li>
                <button 
                  onClick={handleAdminAccess} 
                  className={`flex items-center gap-2 transition-colors ${admin?.isAdmin ? 'text-amber-500' : 'hover:text-amber-500'}`}
                >
                  <Lock size={10} /> {admin?.isAdmin ? 'Modo Admin Activo' : 'Acceso Privado'}
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-zinc-100 font-bold uppercase tracking-widest text-xs">Información</h4>
            <div className="space-y-4 text-zinc-500 text-sm">
              <p>{RESTAURANT_DATA.address}</p>
              <p>{RESTAURANT_DATA.phone}</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} {RESTAURANT_DATA.name}. Buenos Aires, Argentina.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
