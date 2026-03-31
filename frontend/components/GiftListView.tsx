import React, { useState } from 'react';
import { GiftItem } from '../types';
import { MOCK_GIFTS, WEDDING_DETAILS } from '../constants';
import { Button } from './Button';
import { Gift, CreditCard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GiftListView: React.FC = () => {
    const navigate = useNavigate();

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
        <div className="min-h-screen bg-wedding-bg pb-20">
            <nav className="bg-white shadow-sm border-b border-stone-100 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-stone-600 hover:text-wedding-primary transition-colors text-sm font-medium">
                            <ArrowLeft size={20} />
                            Painel Noivos
                        </button>
                    </div>
                    <div className="font-serif text-2xl text-wedding-primary tracking-tight">
                        Lista de Presentes
                    </div>
                </div>
            </nav>

            <header className="bg-wedding-primary text-white py-12 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-serif text-3xl md:text-5xl mb-4">Mimos para os Noivos</h1>
                    <p className="text-wedding-accent font-light italic">
                        "Sua presença é nosso maior presente, mas se quiser nos agradar..."
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    <span className="text-stone-400 text-sm">Cota</span>
                                    <span className="font-sans font-bold text-lg text-wedding-primary">
                                        {formatCurrency(gift.price)}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full group-hover:bg-wedding-primary group-hover:border-wedding-primary group-hover:text-white transition-all"
                                    onClick={() => handleGiftSelect(gift)}
                                >
                                    <CreditCard size={16} /> Presentear
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="mt-20 py-8 text-center text-stone-400 text-sm border-t border-stone-200">
                <p>&copy; 2026 {WEDDING_DETAILS.coupleNames}. Com amor.</p>
            </footer>
        </div>
    );
};
