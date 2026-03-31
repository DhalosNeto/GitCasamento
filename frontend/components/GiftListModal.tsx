import React from 'react';
import { GiftItem } from '../types';
import { MOCK_GIFTS } from '../constants';
import { Button } from './Button';
import { X, Gift, CreditCard } from 'lucide-react';

interface GiftListModalProps {
  onClose: () => void;
}

export const GiftListModal: React.FC<GiftListModalProps> = ({ onClose }) => {
  const handleGiftSelect = (gift: GiftItem) => {
    // In a real app, this would redirect to a payment gateway or show PIX info
    alert(`Obrigado! Você escolheu presentear: ${gift.name}. Em um app real, você seria redirecionado para o pagamento.`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-wedding-bg rounded-t-lg">
          <div>
            <h2 className="font-serif text-3xl text-wedding-primary">Lista de Presentes</h2>
            <p className="text-stone-500 text-sm mt-1">Escolha um item para presentear o casal</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto p-6 bg-stone-50/50 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_GIFTS.map((gift) => (
              <div 
                key={gift.id} 
                className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-wedding-bg rounded-full text-wedding-primary group-hover:bg-wedding-primary group-hover:text-white transition-colors">
                      <Gift size={24} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-wedding-secondary bg-wedding-secondary/10 px-2 py-1 rounded-full">
                      {gift.category}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-xl text-stone-800 mb-2">{gift.name}</h3>
                  <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                    {gift.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-stone-400 text-sm">Valor</span>
                    <span className="font-sans font-bold text-lg text-wedding-primary">
                      {formatCurrency(gift.price)}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-wedding-secondary hover:border-wedding-secondary hover:text-white group-hover:bg-wedding-primary group-hover:border-wedding-primary"
                    onClick={() => handleGiftSelect(gift)}
                  >
                    <CreditCard size={16} /> Presentear
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-white rounded-b-lg text-center">
          <p className="text-xs text-stone-400">
            Pagamentos processados de forma segura. Dúvidas? Fale com os noivos.
          </p>
        </div>
      </div>
    </div>
  );
};