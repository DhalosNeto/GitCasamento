import React, { useState, useEffect } from 'react';
import { GiftItem } from '../types';
import { giftService } from '../services/giftService';
import { Gift, CreditCard, Copy, Check, Package, Landmark } from 'lucide-react';
import { WEDDING_DETAILS } from '../constants';
import { familyService } from '../services/familyService';
import { formatCurrency } from '../utils/formatters';
import { GiftPixModal } from './GiftPixModal';

export const GiftListPage: React.FC = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      const data = await giftService.getAll();
      setGifts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(WEDDING_DETAILS.pix.key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const physicalGifts = gifts.filter(g => g.isPhysical || g.price === 0);
  const digitalGifts = gifts.filter(g => !g.isPhysical && g.price > 0);

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
          "Queridos amigos e familiares, nossa maior alegria é compartilhar este dia com vocês. Caso queiram nos presentear, preparamos uma lista divertida e criativa para se inspirarem."
        </p>
      </header>

      {/* --- Digital Gifts (PIX) — Card Grid --- */}
      <main className="max-w-7xl mx-auto px-4 mt-16">
        {digitalGifts.length === 0 && physicalGifts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm border border-stone-100 italic text-stone-400">
            A lista de presentes está sendo preparada pelos noivos. Volte em breve!
          </div>
        ) : digitalGifts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {digitalGifts.map((gift) => (
              <div
                key={gift.id}
                className="bg-white rounded-sm border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden"
              >
                <div>
                  {/* Large Image Header */}
                  <div className="relative aspect-square w-full bg-stone-50 border-b border-stone-100 overflow-hidden group-hover:bg-stone-100 transition-all duration-500">
                    {gift.imageUrl ? (
                      <img
                        src={gift.imageUrl.startsWith('http') ? gift.imageUrl : `${familyService.getBaseUrl()}${gift.imageUrl}`}
                        alt={gift.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-200">
                        <Gift size={64} strokeWidth={1} />
                      </div>
                    )}
                    {/* Floating Category Tag */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wedding-secondary bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full ring-1 ring-stone-200 shadow-sm">
                        {gift.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl text-stone-800 mb-1 group-hover:text-wedding-primary transition-colors">{gift.name}</h3>
                    <p className="text-stone-500 text-sm mb-1 leading-relaxed font-light line-clamp-2">
                      {gift.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <div className="pt-2 border-t border-stone-50">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">Valor</span>
                      <span className="font-serif text-2xl text-wedding-primary">
                        {formatCurrency(gift.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedGift(gift)}
                      className="w-full py-4 bg-wedding-primary text-white text-xs tracking-[0.2em] font-bold uppercase shadow-lg shadow-wedding-primary/20 hover:bg-wedding-secondary transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
                    >
                      <CreditCard size={16} /> Presentear via PIX
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </main>

      {/* --- Physical Gifts — List --- */}
      {physicalGifts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 mt-12">
          {/* Scroll Indicator — top */}
          <div className="flex flex-col items-center gap-3 mb-8 opacity-40">
            <span className="text-[10px] tracking-[0.4em] uppercase text-stone-800 font-medium">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-stone-800 to-transparent animate-bounce"></div>
          </div>

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="text-wedding-accent" size={28} strokeWidth={1.5} />
              <h2 className="font-serif text-3xl text-wedding-primary uppercase tracking-widest">Presentes Físicos</h2>
            </div>
            <div className="h-0.5 bg-wedding-accent/40 w-16 mx-auto mb-6"></div>
            <p className="font-serif italic text-stone-500 max-w-xl mx-auto">
              "Caso queira levar algum presente pessoalmente, aqui você encontrará algumas coisas que os noivos amarão receber."
            </p>
          </div>

          <div className="bg-white rounded-sm border border-stone-100 shadow-sm overflow-hidden">
            {physicalGifts.map((gift, index) => (
              <div
                key={gift.id}
                className={`flex items-center gap-5 p-4 hover:bg-stone-50 transition-colors group ${index !== physicalGifts.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                <div className="w-20 h-20 bg-stone-50 rounded-sm overflow-hidden flex-shrink-0 border border-stone-100">
                  {gift.imageUrl ? (
                    <img
                      src={gift.imageUrl.startsWith('http') ? gift.imageUrl : `${familyService.getBaseUrl()}${gift.imageUrl}`}
                      alt={gift.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                      <Package size={32} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-serif text-base text-stone-800 group-hover:text-wedding-primary transition-colors">{gift.name}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-wedding-secondary bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200">{gift.category}</span>
                  </div>
                  {gift.description && (
                    <p className="text-xs text-stone-400 font-light line-clamp-2 leading-relaxed">{gift.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator — bottom */}
          <div className="flex flex-col items-center gap-3 mt-12 opacity-40">
            <span className="text-[10px] tracking-[0.4em] uppercase text-stone-800 font-medium">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-stone-800 to-transparent animate-bounce"></div>
          </div>
        </section>
      )}

      {/* --- PIX Section --- */}
      <section id="pix-section" className="bg-wedding-primary/5 mt-24 py-20 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-primary/5 rounded-bl-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
                <div className="text-center mb-12">
                    <h3 className="font-serif text-3xl text-wedding-primary mb-4 uppercase tracking-widest">Presentear via PIX</h3>
                    <div className="h-0.5 bg-wedding-accent/40 w-12 mx-auto mb-6"></div>
                    <p className="text-stone-600 font-light leading-relaxed max-w-lg mx-auto italic">
                        "Caso se sinta tocado e queira mandar outro valor que não esteja listado acima, o pix abaixo vai te ajudar. Obrigado por todo o carinho."
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-sm mb-4">
                            <img src={WEDDING_DETAILS.pix.qrcodePath} alt="PIX QR Code" className="w-36 h-36 object-contain" />
                        </div>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Escaneie para pagar</p>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-wedding-bg rounded-lg text-wedding-primary"><Landmark size={20} /></div>
                                <h4 className="font-serif text-lg text-stone-800">Dados Bancários</h4>
                                <div className="h-px bg-stone-100 flex-1"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Banco</span>
                                    <p className="text-sm font-medium text-stone-700">{WEDDING_DETAILS.pix.bank}</p>
                                </div>
                                <div>
                                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Favorecido(a)</span>
                                    <p className="text-sm font-medium text-stone-700">{WEDDING_DETAILS.pix.receiver}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-2">Chave Aleatória</span>
                            <div onClick={copyPixKey} className="flex items-center justify-between p-4 bg-wedding-bg/30 border border-wedding-accent/20 rounded-sm cursor-pointer hover:border-wedding-primary transition-all group overflow-hidden relative">
                                <code className="text-xs font-mono text-wedding-primary break-all pr-4 relative z-10">{WEDDING_DETAILS.pix.key}</code>
                                <div className="bg-wedding-primary text-white p-2 rounded-sm group-hover:scale-110 transition-transform relative z-10">
                                    {copiedKey ? <Check size={16} /> : <Copy size={16} />}
                                </div>
                                {copiedKey && (
                                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center animate-fadeIn">
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Copiado!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <GiftPixModal gift={selectedGift} onClose={() => setSelectedGift(null)} />
    </div>
  );
};
