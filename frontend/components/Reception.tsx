import React from 'react';
import { WEDDING_DETAILS } from '../constants';
import { GlassWater, Music, Utensils, Shirt } from 'lucide-react';

export const Reception: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-wedding-bg min-h-screen">
      <header className="py-16 px-4 bg-white text-center border-b border-stone-100">
        <h1 className="font-serif text-4xl md:text-5xl text-wedding-primary mb-4 tracking-wide uppercase">A Recepção</h1>
        <div className="h-0.5 bg-wedding-accent/40 w-16 mx-auto mb-8"></div>
        <p className="font-serif italic text-stone-500 text-lg">"Para celebrar com alegria, música e boas conversas."</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-16 grid lg:grid-cols-3 gap-8">
        {/* Card 1: Local / Dress Code */}
        <div className="bg-white p-10 rounded-sm shadow-sm border border-stone-100 text-center space-y-8 animate-fadeIn flex flex-col items-center">
            <div className="p-5 bg-wedding-bg rounded-full text-wedding-primary mb-2">
                <Shirt size={32} />
            </div>
            <h3 className="font-serif text-2xl tracking-widest text-stone-800 uppercase">Dress Code</h3>
            <div className="h-px bg-wedding-accent/20 w-12"></div>
            <p className="text-stone-600 font-light leading-relaxed">
                <span className="font-medium text-wedding-primary">Passeio Completo</span><br />
                Sugerimos tons suaves para as madrinhas e traje social para os cavalheiros.
            </p>
        </div>

        {/* Card 2: Menu / Gastronomia */}
        <div className="bg-white p-10 rounded-sm shadow-sm border border-stone-100 text-center space-y-8 animate-fadeIn delay-100 flex flex-col items-center">
            <div className="p-5 bg-wedding-bg rounded-full text-wedding-primary mb-2">
                <Utensils size={32} />
            </div>
            <h3 className="font-serif text-2xl tracking-widest text-stone-800 uppercase">Gastronomia</h3>
            <div className="h-px bg-wedding-accent/20 w-12"></div>
            <p className="text-stone-600 font-light leading-relaxed">
                Assinado pelo <span className="font-medium text-wedding-primary">Chef Rodrigo Martins</span>.<br />
                Coquetel de entrada, jantar servido à inglesa e mesa de doces finos.
            </p>
        </div>

        {/* Card 3: Festa / Música */}
        <div className="bg-white p-10 rounded-sm shadow-sm border border-stone-100 text-center space-y-8 animate-fadeIn delay-200 flex flex-col items-center">
            <div className="p-5 bg-wedding-bg rounded-full text-wedding-primary mb-2">
                <Music size={32} />
            </div>
            <h3 className="font-serif text-2xl tracking-widest text-stone-800 uppercase">A Festa</h3>
            <div className="h-px bg-wedding-accent/20 w-12"></div>
            <p className="text-stone-600 font-light leading-relaxed">
                Animação por conta da <span className="font-medium text-wedding-primary">Banda Sunshine</span> e DJ Lucas.<br />
                Preparem os sapatos confortáveis para dançar até o amanhecer!
            </p>
        </div>
      </main>

      <section className="max-w-6xl mx-auto px-4 mt-20">
        <div 
          className="h-[400px] rounded-sm bg-cover bg-center overflow-hidden flex items-center justify-center relative grayscale-[30%] hover:grayscale-0 transition-all duration-1000 group"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')" }}
        >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500"></div>
            <div className="relative z-10 border border-white/40 p-12 text-white text-center backdrop-blur-sm bg-black/10">
                <div className="font-serif text-3xl md:text-5xl tracking-widest uppercase mb-4">Let's Celebrate</div>
                <div className="text-sm tracking-[0.3em] font-light">MUITO AMOR E ALEGRIA</div>
            </div>
        </div>
      </section>
    </div>
  );
};
