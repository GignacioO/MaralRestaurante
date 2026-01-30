
import React, { useRef } from 'react';
import { Phone, MapPin, Clock, ExternalLink, Target } from 'lucide-react';
import { RESTAURANT_DATA } from '../constants';

const Contact: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cleanPhone = RESTAURANT_DATA.phone.replace(/[^0-9]/g, '');

  const recenterMap = () => {
    if (iframeRef.current) {
      // Forzamos el reload del iframe para que vuelva a la posición original (pin centrado)
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = currentSrc;
    }
  };

  return (
    <section id="contacto" className="py-24 bg-zinc-950 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold serif mb-4">Ubicación y Contacto</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 bg-zinc-900/40 border border-zinc-800 shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="bg-amber-600/10 p-4 rounded-sm shrink-0"><MapPin className="text-amber-500" size={24} /></div>
                <div>
                  <h4 className="text-zinc-100 font-bold mb-1 uppercase tracking-widest text-sm">Dirección</h4>
                  <p className="text-zinc-400">{RESTAURANT_DATA.address}</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-amber-600/10 p-4 rounded-sm shrink-0"><Phone className="text-amber-500" size={24} /></div>
                <div>
                  <h4 className="text-zinc-100 font-bold mb-1 uppercase tracking-widest text-sm">Teléfono</h4>
                  <a href={`tel:${cleanPhone}`} className="text-zinc-100 text-lg hover:text-amber-500 transition-colors">{RESTAURANT_DATA.phone}</a>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-amber-600/10 p-4 rounded-sm shrink-0"><Clock className="text-amber-500" size={24} /></div>
                <div>
                  <h4 className="text-zinc-100 font-bold mb-1 uppercase tracking-widest text-sm">Horarios</h4>
                  <p className="text-zinc-400">{RESTAURANT_DATA.hours}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row gap-4">
              <a href={RESTAURANT_DATA.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-zinc-100 text-zinc-950 font-bold hover:bg-white transition-all uppercase text-sm tracking-widest">
                Cómo Llegar <ExternalLink size={18} />
              </a>
            </div>
          </div>

          <div className="h-[400px] lg:h-auto min-h-[400px] relative">
            <iframe
              ref={iframeRef}
              src={RESTAURANT_DATA.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Maral"
              className="grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
            ></iframe>
            <button 
              onClick={recenterMap}
              title="Volver al local"
              className="absolute bottom-6 right-6 p-4 bg-zinc-900 border border-zinc-700 text-amber-500 shadow-2xl hover:bg-zinc-800 transition-colors rounded-full z-10"
            >
              <Target size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
