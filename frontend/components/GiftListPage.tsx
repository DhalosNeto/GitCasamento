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

  const digitalGifts = gifts.filter(g => !g.isPhysical);
  const physicalGifts = gifts.filter(g => g.isPhysical);

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
          "Para facilitar, caso possa e queira, você pode enviar qualquer valor através do PIX. Agradecemos de coração por todo o carinho e apoio."
        </p>
      </header>

      {/* --- Digital Gifts (PIX) Section --- */}
      <main className="max-w-4xl mx-auto px-4 mt-16">
        {digitalGifts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-sm border border-stone-100 italic text-stone-400">
            A lista de presentes está sendo preparada pelos noivos. Volte em breve!
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-stone-100 shadow-sm overflow-hidden">
            {digitalGifts.map((gift, index) => (
              <div
                key={gift.id}
                className={`flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors group ${index !== digitalGifts.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 bg-stone-50 rounded-sm overflow-hidden flex-shrink-0 border border-stone-100">
                  {gift.imageUrl ? (
                    <img
                      src={gift.imageUrl.startsWith('http') ? gift.imageUrl : `${familyService.getBaseUrl()}${gift.imageUrl}`}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                      <Gift size={24} strokeWidth={1} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-base text-stone-800 group-hover:text-wedding-primary transition-colors">{gift.name}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-wedding-secondary bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200">{gift.category}</span>
                  </div>
                  {gift.description && (
                    <p className="text-xs text-stone-400 font-light mt-0.5 line-clamp-1">{gift.description}</p>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-serif text-lg text-wedding-primary hidden sm:block">{formatCurrency(gift.price)}</span>
                  <button
                    onClick={() => setSelectedGift(gift)}
                    className="py-2 px-4 bg-wedding-primary text-white text-[10px] tracking-[0.15em] font-bold uppercase rounded-sm hover:bg-wedding-secondary transition-all duration-300 flex items-center gap-2 active:scale-95 whitespace-nowrap"
                  >
                    <CreditCard size={13} /> PIX
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- Physical Gifts Section --- */}
      {physicalGifts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 mt-16">
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
                className={`flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors group ${index !== physicalGifts.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 bg-stone-50 rounded-sm overflow-hidden flex-shrink-0 border border-stone-100">
                  {gift.imageUrl ? (
                    <img
                      src={gift.imageUrl.startsWith('http') ? gift.imageUrl : `${familyService.getBaseUrl()}${gift.imageUrl}`}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                      <Package size={24} strokeWidth={1} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-base text-stone-800 group-hover:text-wedding-primary transition-colors">{gift.name}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-wedding-secondary bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200">{gift.category}</span>
                  </div>
                  {gift.description && (
                    <p className="text-xs text-stone-400 font-light mt-0.5 line-clamp-1">{gift.description}</p>
                  )}
                </div>

                {/* Price */}
                <div className="flex-shrink-0">
                  <span className="font-serif text-lg text-wedding-primary">{formatCurrency(gift.price)}</span>
                </div>
              </div>
            ))}
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
                            <img
                                src={WEDDING_DETAILS.pix.qrcodePath}
                                alt="PIX QR Code"
                                className="w-36 h-36 object-contain"
                            />
                        </div>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Escaneie para pagar</p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-wedding-bg rounded-lg text-wedding-primary">
                                    <Landmark size={20} />
                                </div>
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
                            <div
                                onClick={copyPixKey}
                                className="flex items-center justify-between p-4 bg-wedding-bg/30 border border-wedding-accent/20 rounded-sm cursor-pointer hover:border-wedding-primary transition-all group overflow-hidden relative"
                            >
                                <code className="text-xs font-mono text-wedding-primary break-all pr-4 relative z-10">
                                    {WEDDING_DETAILS.pix.key}
                                </code>
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

      {/* PIX Modal for individual gifts */}
      <GiftPixModal gift={selectedGift} onClose={() => setSelectedGift(null)} />
    </div>
  );
};
