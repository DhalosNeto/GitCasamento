import React from 'react';
import { WEDDING_DETAILS } from '../constants';

export const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/casal-hero.jpg')", // Use somente a imagem local do casal
            backgroundColor: '#333',
            backgroundPosition: 'center 35%', // Desce mais o foco para o rosto
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 flex flex-col items-center">
            {/* Monogram SVG */}
            <div className="mb-8 animate-fadeIn">
                <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                    {/* Square Border */}
                    <rect x="50" y="50" width="140" height="140" stroke="white" strokeWidth="1.5" />
                    
                    {/* D.T Typography */}
                    <text 
                        x="120" 
                        y="135" 
                        textAnchor="middle" 
                        fill="white" 
                        fontFamily="'Cormorant Garamond', serif" 
                        fontSize="48" 
                        fontWeight="300" 
                        letterSpacing="0.1em"
                    >
                        D·T
                    </text>

                    {/* Botanical Illustration (Simplified Wheat/Lavender Branch) */}
                    <path 
                        d="M45 160 C 45 140, 55 100, 75 70 M 75 70 C 85 50, 95 40, 95 40" 
                        stroke="white" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        fill="none"
                    />
                    <path d="M48 150 L 40 145" stroke="white" strokeWidth="1" />
                    <path d="M52 140 L 44 135" stroke="white" strokeWidth="1" />
                    <path d="M58 125 L 50 120" stroke="white" strokeWidth="1" />
                    <path d="M65 110 L 57 105" stroke="white" strokeWidth="1" />
                    <path d="M72 95 L 64 90" stroke="white" strokeWidth="1" />
                    <path d="M80 80 L 72 75" stroke="white" strokeWidth="1" />
                    <path d="M88 65 L 80 60" stroke="white" strokeWidth="1" />
                </svg>
            </div>

          {/* Names */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase mb-4 animate-slideUp">
            {WEDDING_DETAILS.coupleNames.replace('&', 'E')}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-6 text-xl md:text-3xl font-light tracking-[0.3em] font-serif animate-slideUp delay-100">
            <span>18</span>
            <span className="w-px h-8 bg-white/50"></span>
            <span>07</span>
            <span className="w-px h-8 bg-white/50"></span>
            <span>2026</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-70">
            <span className="text-[10px] tracking-[0.4em] uppercase text-white font-medium">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="font-serif text-2xl md:text-4xl text-wedding-primary italic leading-relaxed px-4">
                "O amor não consiste em olhar um para o outro, mas em olhar juntos na mesma direção."
            </div>
            
            <div className="h-px bg-wedding-accent/30 w-24 mx-auto"></div>

            <p className="text-lg text-stone-600 leading-relaxed font-light max-w-2xl mx-auto">
                Sejam bem-vindos ao site do nosso casamento. Criamos este espaço para compartilhar com vocês todos os detalhes 
                deste dia tão especial. Aqui você encontrará informações sobre a cerimônia, a recepção, nossa lista de presentes 
                e poderá confirmar sua presença.
            </p>

            <div className="grid md:grid-cols-3 gap-8 pt-12">
                <div className="p-8 border border-wedding-accent/20 rounded-sm hover:border-wedding-accent transition-colors duration-500 group">
                    <div className="text-wedding-primary mb-4 font-serif text-3xl">18</div>
                    <div className="text-xs tracking-widest uppercase text-stone-400">Julho de 2026</div>
                </div>
                <div className="p-8 border border-wedding-accent/20 rounded-sm hover:border-wedding-accent transition-colors duration-500">
                    <div className="text-wedding-primary mb-4 font-serif text-3xl">16:00</div>
                    <div className="text-xs tracking-widest uppercase text-stone-400">A Cerimônia</div>
                </div>
                <div className="p-8 border border-wedding-accent/20 rounded-sm hover:border-wedding-accent transition-colors duration-500">
                    <div className="text-wedding-primary mb-4 font-serif text-3xl">Espaço</div>
                    <div className="text-xs tracking-widest uppercase text-stone-400">Quinta do Vale, Sintra</div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};
