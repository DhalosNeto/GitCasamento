import React, { useState } from 'react';
import { GiftItem } from '../types';
import { WEDDING_DETAILS } from '../constants';
import { X, Copy, Check, Lock, Gift, Image as ImageIcon } from 'lucide-react';
import { familyService } from '../services/familyService';
import { formatCurrency } from '../utils/formatters';

interface GiftPixModalProps {
  gift: GiftItem | null;
  onClose: () => void;
}

export const GiftPixModal: React.FC<GiftPixModalProps> = ({ gift, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!gift) return null;

  const copyPixKey = () => {
    navigator.clipboard.writeText(WEDDING_DETAILS.pix.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-xl relative z-10 flex flex-col border-t-8 border-wedding-primary animate-scaleIn overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-stone-400 hover:text-wedding-primary hover:bg-stone-100 rounded-full transition-all z-20"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          {/* Header & Gift Info */}
          <div className="text-center mb-6">
            <div className="inline-flex w-24 h-24 bg-wedding-bg rounded-lg overflow-hidden mb-4 ring-1 ring-wedding-accent/20 items-center justify-center text-wedding-primary shadow-inner">
                {gift.imageUrl ? 
                    <img src={`${familyService.getBaseUrl()}${gift.imageUrl}`} alt={gift.name} className="w-full h-full object-cover" /> 
                    : <Gift size={40} />
                }
            </div>
            <h3 className="font-serif text-xl md:text-2xl text-stone-800 mb-1 uppercase tracking-tight">{gift.name}</h3>
            <div className="font-serif text-3xl text-wedding-primary mb-3">
                {formatCurrency(gift.price)}
            </div>
            <div className="h-0.5 bg-wedding-accent/30 w-10 mx-auto"></div>
          </div>

          {/* PIX Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-wedding-bg/50 p-6 rounded-sm border border-stone-100">
             {/* QR Code */}
             <div className="flex flex-col items-center">
                <div className="p-2 bg-white shadow-lg rounded-sm mb-3 border border-stone-100">
                    <img 
                      src="/assets/pix-qrcode.png" 
                      alt="PIX QR Code" 
                      className="w-36 h-36 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${WEDDING_DETAILS.pix.key}`;
                      }}
                    />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Escaneie o QR Code</span>
             </div>

             {/* Key and Info */}
             <div className="space-y-4">
                <div>
                   <label className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-bold block mb-2">Chave PIX Aleatória</label>
                   <div 
                      onClick={copyPixKey}
                      className="flex items-center justify-between p-3 bg-white border border-wedding-accent/30 rounded-sm cursor-pointer hover:border-wedding-primary transition-all group"
                   >
                      <code className="font-mono text-xs text-stone-800 break-all mr-4">
                        {WEDDING_DETAILS.pix.key}
                      </code>
                      <div className="text-wedding-primary group-hover:scale-110 transition-transform">
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-stone-200/50 pt-4">
                   <div>
                      <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-bold block mb-1">Banco</label>
                      <p className="text-sm font-serif text-stone-800 leading-tight">{WEDDING_DETAILS.pix.bank}</p>
                   </div>
                   <div>
                      <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-bold block mb-1">Favorecido(a)</label>
                      <p className="text-sm font-serif text-stone-800 leading-tight">{WEDDING_DETAILS.pix.receiver}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Footer/Security */}
          <div className="mt-8 flex flex-col items-center text-center">
             <div className="flex items-center gap-2 text-wedding-accent mb-2">
                <Lock size={12} />
                <span className="text-[9px] uppercase tracking-widest font-bold">Transação 100% Segura</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
