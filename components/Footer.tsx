
import React, { useContext } from 'react';
import { Utensils, Lock, Key } from 'lucide-react';
import { RESTAURANT_DATA } from '../constants';
import { AdminContext } from '../App';

const Footer: React.FC = () => {
  const admin = useContext(AdminContext);

  const triggerAdmin = () => {
    if (admin?.isAdmin) {
      if (confirm('¿Cerrar modo administrador?')) admin.setIsAdmin(false);
      return;
    }
    const pass = prompt('Ingrese clave de acceso:');
    if (pass === admin?.password) {
      admin?.setIsAdmin(true);
      alert('Modo Edición Activado. Ya puedes modificar el menú arriba.');
    } else if (pass !== null) {
      alert('Clave incorrecta.');
    }
  };

  const handleChangePass = () => {
    const newPass = prompt('Ingrese nueva clave deseada:');
    if (newPass && newPass.length >= 4) {
      admin?.updatePassword(newPass);
      alert('¡Clave actualizada correctamente!');
    } else if (newPass) {
      alert('La clave debe tener al menos 4 caracteres.');
    }
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 pt-20 pb-10 border-t border-zinc-900 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2 select-none">
              <Utensils className={`w-6 h-6 ${admin?.isAdmin ? 'text-amber-500' : 'text-zinc-800'}`} />
              <span className="text-2xl font-bold tracking-widest serif text-zinc-100 uppercase">
                {RESTAURANT_DATA.name}
              </span>
              {admin?.isAdmin && <Lock size={14} className="text-amber-500 ml-2" />}
            </div>
            <p className="text-zinc-500 max-w-sm leading-relaxed">
              Dedicados a brindar la mejor experiencia gastronómica en el corazón de Buenos Aires. Calidad, tradición y confort.
            </p>
            
            {admin?.isAdmin && (
              <button 
                onClick={handleChangePass}
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-amber-500 transition-colors uppercase tracking-widest font-bold border border-zinc-800 px-3 py-1 rounded"
              >
                <Key size={12} /> Cambiar Clave de Acceso
              </button>
            )}
          </div>

          <div className="space-y-6">
            <h4 className="text-zinc-100 font-bold uppercase tracking-widest text-sm">Mapa del Sitio</h4>
            <ul className="space-y-4 text-zinc-500 text-sm uppercase tracking-wider">
              <li><button onClick={() => scrollToId('inicio')} className="hover:text-amber-500 transition-colors">Inicio</button></li>
              <li><button onClick={() => scrollToId('menu')} className="hover:text-amber-500 transition-colors">Ver Menú</button></li>
              <li><button onClick={() => scrollToId('contacto')} className="hover:text-amber-500 transition-colors">Reservar</button></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-zinc-100 font-bold uppercase tracking-widest text-sm">Información</h4>
            <div className="space-y-4 text-zinc-500 text-sm">
              <p>{RESTAURANT_DATA.address}</p>
              <div className="flex items-center gap-0">
                <p className="shrink-0">{RESTAURANT_DATA.phone}</p>
                {/* BOTÓN SECRETO - NEGRO SOBRE NEGRO - EXACTAMENTE DONDE MARCA EL CÍRCULO */}
                <button 
                  onClick={triggerAdmin}
                  className="w-12 h-10 bg-zinc-950 border-none cursor-default active:bg-zinc-900/10 focus:outline-none ml-2"
                  aria-hidden="true"
                  title=""
                ></button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} {RESTAURANT_DATA.name}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
