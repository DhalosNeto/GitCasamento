import React, { useState, useEffect } from 'react';
import { WEDDING_DETAILS } from '../constants';
import { Gift, CreditCard, Copy, Check, Lock, Image as ImageIcon } from 'lucide-react';
import { GiftItem } from '../types';
import { GiftPixModal } from './GiftPixModal';
import { giftService } from '../services/giftService';
import { familyService } from '../services/familyService';

export const GiftListPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      const data = await giftService.getAll();
      setGifts(data);
    } catch (err) {
      console.error('Erro ao carregar presentes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGiftSelect = (gift: GiftItem) => {
    setSelectedGift(gift);
  };

  useEffect(() => {
    if (selectedGift) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedGift]);

  const copyPixKey = () => {
    navigator.clipboard.writeText(WEDDING_DETAILS.pix.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-wedding-bg min-h-screen flex items-center justify-center">
        <div className="text-stone-400 font-serif text-xl animate-pulse">Carregando lista de carinho...</div>
      </div>
    );
  }

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
        {gifts.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-sm border border-stone-100 italic text-stone-400">
              A lista de presentes está sendo preparada pelos noivos. Volte em breve!
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="bg-white p-8 rounded-sm border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-wedding-bg rounded-lg overflow-hidden flex items-center justify-center text-wedding-primary group-hover:bg-wedding-primary group-hover:text-white transition-all duration-500 border border-wedding-bg shadow-inner">
                      {gift.imageUrl ? 
                        <img src={`${familyService.getBaseUrl()}${gift.imageUrl}`} alt={gift.name} className="w-full h-full object-cover" /> 
                        : <Gift size={32} />
                      }
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wedding-secondary bg-wedding-secondary/5 px-3 py-1.5 rounded-full ring-1 ring-wedding-secondary/20">
                      {gift.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-stone-800 mb-3 group-hover:text-wedding-primary transition-colors">{gift.name}</h3>
                  <p className="text-stone-500 text-sm mb-6 leading-relaxed font-light line-clamp-3">
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
                    <CreditCard size={16} /> Presentear via PIX
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <section id="pix-section" className="bg-wedding-primary/5 mt-24 py-20 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-primary/5 rounded-bl-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
                <div className="text-center mb-12">
                    <h3 className="font-serif text-3xl text-wedding-primary mb-4 uppercase tracking-widest">Presentear via PIX</h3>
                    <div className="h-0.5 bg-wedding-accent/40 w-12 mx-auto mb-6"></div>
                    <p className="text-stone-600 font-light leading-relaxed max-w-lg mx-auto italic">
                        "Para facilitar, você pode realizar sua contribuição através do PIX. 
                        Agradecemos de coração por todo o carinho e apoio."
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col items-center">
                        <div className="p-2 bg-white border border-stone-100 shadow-xl rounded-sm mb-4 group transition-all hover:scale-105">
                            <div className="w-56 h-56 bg-stone-50 flex items-center justify-center relative">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${WEDDING_DETAILS.pix.key}`}
                                    alt="PIX QR Code" 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${WEDDING_DETAILS.pix.key}`;
                                    }}
                                />
                            </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Escaneie para pagar</span>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-bold block">Chave PIX Aleatória</label>
                            <div 
                                onClick={copyPixKey}
                                className="flex items-center justify-between p-6 bg-wedding-bg border-2 border-wedding-accent/30 rounded-sm cursor-pointer hover:border-wedding-primary hover:shadow-lg transition-all group"
                            >
                                <code className="font-mono text-lg text-stone-800 break-all select-all mr-6 leading-tight">
                                    {WEDDING_DETAILS.pix.key}
                                </code>
                                <div className="text-wedding-primary group-hover:scale-125 transition-transform flex-shrink-0">
                                    {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-bold block mb-1">Banco</label>
                                <p className="text-sm font-serif text-stone-800">{WEDDING_DETAILS.pix.bank}</p>
                            </div>
                            <div>
                                <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-bold block mb-1">Favorecido(a)</label>
                                <p className="text-sm font-serif text-stone-800 leading-tight">{WEDDING_DETAILS.pix.receiver}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-stone-100">
                             <div className="flex items-center gap-3 text-stone-400">
                                <Lock size={14} className="text-wedding-accent" />
                                <span className="text-[9px] uppercase tracking-widest font-bold">Transação 100% Segura via App do Banco</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <GiftPixModal 
        gift={selectedGift} 
        onClose={() => setSelectedGift(null)} 
      />
    </div>
  );
};
