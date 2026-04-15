import React from 'react';
import { WEDDING_DETAILS } from '../constants';
import { GlassWater, Music, Utensils, Shirt, MapPin, Calendar } from 'lucide-react';

export const Reception: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-wedding-bg min-h-screen">
      <header className="py-16 px-4 bg-white text-center border-b border-stone-100">
        <h1 className="font-serif text-4xl md:text-5xl text-wedding-primary mb-4 tracking-wide uppercase">A Recepção</h1>
        <div className="h-0.5 bg-wedding-accent/40 w-16 mx-auto mb-8"></div>
        <p className="font-serif italic text-stone-500 text-lg mb-2">"Para celebrar com alegria, música e boas conversas."</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-16 grid md:grid-cols-2 gap-12 items-start">
        {/* Mirror: Image on the Left */}
        <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl animate-fadeIn order-2 md:order-1">
            <img 
                src="/VIT_2129.jpeg" 
                alt="Celebração e Recepção" 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 transform hover:scale-105"
            />
        </div>

        {/* Info on the Right */}
        <div className="space-y-8 animate-fadeIn delay-200 order-1 md:order-2">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-wedding-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                
                <div className="flex items-center gap-6 mb-8 mt-2">
                    <div className="p-4 bg-wedding-bg rounded-full text-wedding-primary">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <div className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-1 font-bold">Data e Hora</div>
                        <div className="font-serif text-xl text-stone-800">{WEDDING_DETAILS.date}</div>
                        <div className="text-sm text-stone-500 mt-1 italic">{WEDDING_DETAILS.receptionTime}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-wedding-bg rounded-full text-wedding-primary">
                        <MapPin size={28} />
                    </div>
                    <div>
                        <div className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-1 font-bold">Localização</div>
                        <div className="font-serif text-xl text-stone-800">Sítio Paraíso</div>
                        <div className="text-sm text-stone-500 mt-1">Av. Maria Miranda - Teixeira de Freitas, BA</div>
                    </div>
                </div>

                <a 
                    href={WEDDING_DETAILS.mapUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block w-full py-4 border border-stone-200 text-stone-500 hover:bg-wedding-primary hover:text-white transition-all duration-300 text-center tracking-[0.2em] font-medium"
                >
                    VER NO MAPA
                </a>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100">
                <div className="flex items-center gap-4 mb-8">
                    <Music className="text-stone-400" size={24} />
                    <h3 className="font-serif text-2xl text-stone-800">A Festa</h3>
                </div>
                
                <ul className="space-y-6">
                    <li className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent mt-2 flex-shrink-0"></div>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Venham preparados com muita animação para comemorar com a gente!
                        </p>
                    </li>
                    <li className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent mt-2 flex-shrink-0"></div>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Preparem os sapatos confortáveis para dançar até o amanhecer!
                        </p>
                    </li>
                    <li className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent mt-2 flex-shrink-0"></div>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Tudo foi pensado com muito carinho, com comida e bebida de qualidade para todos.
                        </p>
                    </li>
                </ul>
            </div>

        </div>
      </main>
    </div>
  );
};
