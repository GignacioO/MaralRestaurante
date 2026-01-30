
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { REVIEWS, RESTAURANT_DATA } from '../constants';

const ReviewsSection: React.FC = () => {
  return (
    <section id="opiniones" className="py-24 bg-zinc-950 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-600/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold serif mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-zinc-500 text-lg">Basado en más de {RESTAURANT_DATA.reviewsCount} reseñas en Google.</p>
          </div>
          <div className="bg-zinc-900 p-6 border border-zinc-800 shadow-2xl flex flex-col items-center">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4].map(s => <Star key={s} size={20} className="fill-amber-500 text-amber-500" />)}
              <Star size={20} className="fill-amber-500/30 text-amber-500" />
            </div>
            <span className="text-3xl font-bold serif text-zinc-100">{RESTAURANT_DATA.rating} / 5</span>
            <span className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Calificación Google</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <div key={idx} className="bg-zinc-900/50 p-8 border border-zinc-800 rounded-sm relative group hover:bg-zinc-900 transition-colors duration-300">
              <Quote className="text-amber-500/20 absolute top-6 right-6" size={48} />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-zinc-300 mb-6 italic leading-relaxed">"{review.text}"</p>
              <div className="border-t border-zinc-800 pt-4">
                <span className="font-bold text-amber-500 uppercase tracking-wider text-xs">{review.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
