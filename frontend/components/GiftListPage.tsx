import React from 'react';
import { MOCK_GIFTS, WEDDING_DETAILS } from '../constants';
import { Gift, CreditCard } from 'lucide-react';
import { GiftItem } from '../types';

export const GiftListPage: React.FC = () => {
  const handleGiftSelect = (gift: GiftItem) => {
    alert(`Obrigado! Você escolheu presentear com: ${gift.name}. Em um app real, aqui exibiríamos as opções de PIX ou pagamento.`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="pt-24 pb-20 bg-wedding-bg min-h-screen">
      <header className="py-16 px-4 bg-white text-center border-b border-stone-100">
        <h1 className="font-serif text-4xl md:text-5xl text-wedding-primary mb-4 tracking-wide uppercase">Lista de Presentes</h1>
        <div className="h-0.5 bg-wedding-accent/40 w-16 mx-auto mb-8"></div>
        <p className="font-serif italic text-stone-500 text-lg max-w-2xl mx-auto">
          "Sua presença é o nosso maior presente, mas se desejar nos presentear, criamos esta lista com muito carinho."
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {MOCK_GIFTS.map((gift) => (
            <div
              key={gift.id}
              className="bg-white p-8 rounded-sm border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-wedding-bg rounded-full text-wedding-primary group-hover:bg-wedding-primary group-hover:text-white transition-colors duration-500">
                    <Gift size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wedding-secondary bg-wedding-secondary/5 px-3 py-1.5 rounded-full ring-1 ring-wedding-secondary/20">
                    {gift.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-stone-800 mb-3 group-hover:text-wedding-primary transition-colors">{gift.name}</h3>
                <p className="text-stone-500 text-sm mb-6 leading-relaxed font-light">
                  {gift.description}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-stone-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone-400 text-xs uppercase tracking-widest font-medium">Valor Sugerido</span>
                  <span className="font-serif text-2xl text-wedding-primary">
                    {formatCurrency(gift.price)}
                  </span>
                </div>
                <button
                  onClick={() => handleGiftSelect(gift)}
                  className="w-full py-4 bg-wedding-primary text-white text-xs tracking-[0.2em] font-bold uppercase shadow-lg shadow-wedding-primary/20 hover:bg-wedding-secondary transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
                >
                  <CreditCard size={16} /> Presentear
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="bg-wedding-primary/5 mt-24 py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white p-12 rounded-sm shadow-xl text-center border-t-4 border-wedding-secondary">
            <h3 className="font-serif text-3xl text-wedding-primary mb-6 uppercase tracking-widest">Informações Extras</h3>
            <p className="text-stone-600 font-light leading-relaxed mb-8">
                Caso prefira realizar um PIX de qualquer valor, utilize a chave abaixo:
            </p>
            <div className="inline-block p-6 bg-wedding-bg rounded-sm border-2 border-dashed border-wedding-accent/50 mb-4 select-all cursor-pointer hover:bg-white transition-colors group">
                <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Chave PIX (E-mail)</div>
                <div className="font-mono text-lg text-wedding-primary font-bold group-hover:text-wedding-secondary transition-colors">casamento.dinah&tiago@email.com</div>
            </div>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-4">BANCO INTER | DINAH DE SOUZA</p>
        </div>
      </section>
    </div>
  );
};
