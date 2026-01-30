
import React, { useContext } from 'react';
import { Edit2 } from 'lucide-react';
import { AdminContext } from '../App';

const About: React.FC = () => {
  const admin = useContext(AdminContext);

  const editAbout = () => {
    const title = prompt('Nuevo título de sección:', admin?.content.aboutTitle);
    const desc1 = prompt('Descripción párrafo 1:', admin?.content.aboutDesc1);
    const desc2 = prompt('Descripción párrafo 2:', admin?.content.aboutDesc2);
    
    if (title || desc1 || desc2) {
      admin?.updateContent({
        aboutTitle: title || admin?.content.aboutTitle,
        aboutDesc1: desc1 || admin?.content.aboutDesc1,
        aboutDesc2: desc2 || admin?.content.aboutDesc2
      });
    }
  };

  return (
    <section id="nosotros" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative group">
            <div className="absolute -inset-4 bg-amber-600/10 rounded-xl blur-2xl group-hover:bg-amber-600/20 transition-all duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800"
              alt="Plato Gourmet"
              className="relative rounded-sm shadow-2xl w-full h-[500px] object-cover"
            />
            <div className="absolute bottom-6 -right-6 bg-zinc-900 p-8 border-l-4 border-amber-500 hidden lg:block shadow-2xl">
              <p className="serif text-3xl font-bold italic text-amber-500">Desde 2018</p>
              <p className="text-zinc-400 text-sm mt-1 uppercase tracking-widest">Excelencia Constante</p>
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-6 relative group/text">
            {admin?.isAdmin && (
              <button 
                onClick={editAbout}
                className="absolute -top-10 right-0 p-2 bg-amber-600 text-white rounded-full hover:bg-amber-500 transition-all opacity-0 group-hover/text:opacity-100 no-print"
              >
                <Edit2 size={16} />
              </button>
            )}
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight">
              {admin?.content.aboutTitle}
            </h2>
            <div className="w-20 h-1 bg-amber-500"></div>
            <p className="text-zinc-400 text-lg leading-relaxed">
              {admin?.content.aboutDesc1}
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed">
              {admin?.content.aboutDesc2}
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <h4 className="text-amber-500 text-3xl font-bold serif">4.2 ⭐</h4>
                <p className="text-zinc-500 text-sm uppercase tracking-tighter">Valoración Media</p>
              </div>
              <div>
                <h4 className="text-amber-500 text-3xl font-bold serif">+300</h4>
                <p className="text-zinc-500 text-sm uppercase tracking-tighter">Reseñas Reales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
