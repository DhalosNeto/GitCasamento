import React from 'react';
import { WEDDING_DETAILS } from '../constants';
import { MapPin, Clock, Calendar } from 'lucide-react';

export const Ceremony: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-wedding-bg min-h-screen">
      <header className="py-16 px-4 bg-white text-center border-b border-stone-100">
        <h1 className="font-serif text-4xl md:text-5xl text-wedding-primary mb-4 tracking-wide uppercase">A Cerimônia</h1>
        <div className="h-0.5 bg-wedding-accent/40 w-16 mx-auto mb-8"></div>
        <p className="font-serif italic text-stone-500 text-lg">"Onde o sim se torna para sempre."</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-wedding-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                
                <div className="flex items-center gap-6 mb-8 mt-2">
                    <div className="p-4 bg-wedding-bg rounded-full text-wedding-primary">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <div className="text-xs tracking-widest uppercase text-stone-400 mb-1">Data e Hora</div>
                        <div className="font-serif text-xl text-stone-800">{WEDDING_DETAILS.date} às {WEDDING_DETAILS.ceremonyTime}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-wedding-bg rounded-full text-wedding-primary">
                        <MapPin size={28} />
                    </div>
                    <div>
                        <div className="text-xs tracking-widest uppercase text-stone-400 mb-1">Localização</div>
                        <div className="font-serif text-xl text-stone-800">{WEDDING_DETAILS.location}</div>
                        <div className="text-sm text-stone-500 mt-1 uppercase tracking-wider">{WEDDING_DETAILS.address}</div>
                    </div>
                </div>

                <a 
                    href={WEDDING_DETAILS.mapUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block w-full py-4 border border-wedding-secondary text-wedding-secondary hover:bg-wedding-secondary hover:text-white transition-all duration-300 text-center tracking-[0.2em] font-medium"
                >
                    VER NO MAPA
                </a>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100">
                <h3 className="font-serif text-2xl text-wedding-primary mb-4">Informações Importantes</h3>
                <ul className="space-y-4 text-stone-600 font-light leading-relaxed">
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent mt-2 flex-shrink-0"></div>
                        Favor chegar com 15 minutos de antecedência.
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent mt-2 flex-shrink-0"></div>
                        O local dispõe de estacionamento gratuito para convidados.
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent mt-2 flex-shrink-0"></div>
                        Não será permitido o uso de flash por parte dos convidados durante a cerimônia. 
                    </li>
                </ul>
            </div>
        </div>

        <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl animate-fadeIn delay-200">
            <img 
                src="/VIT_1952.jpeg" 
                alt="Igreja ou Local da Cerimônia" 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 transform hover:scale-105"
            />
        </div>
      </main>
    </div>
  );
};
