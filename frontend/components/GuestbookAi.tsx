import React, { useState } from 'react';
import { Button } from './Button';
import { generateWeddingMessage } from '../services/geminiService';
import { Sparkles, MessageSquare, Copy } from 'lucide-react';
import { WEDDING_DETAILS } from '../constants';

export const GuestbookAi: React.FC = () => {
  const [relationship, setRelationship] = useState('');
  const [tone, setTone] = useState('Sentimental e carinhoso');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!relationship) return;
    
    setIsGenerating(true);
    const msg = await generateWeddingMessage(relationship, tone, WEDDING_DETAILS.coupleNames);
    setGeneratedMessage(msg);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    alert("Mensagem copiada!");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-wedding-secondary/10 rounded-full mb-3 text-wedding-secondary">
          <Sparkles size={24} />
        </div>
        <h2 className="font-serif text-2xl text-wedding-primary">Assistente de Mensagens</h2>
        <p className="text-stone-500 text-sm mt-2">
          Deixe a IA ajudar você a escrever uma mensagem especial para o livro de visitas.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Qual sua relação com o casal?</label>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="Ex: Tio da noiva, Amiga de infância..."
            className="w-full px-3 py-2 border border-stone-200 rounded-sm focus:outline-none focus:border-wedding-secondary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Tom da mensagem</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 rounded-sm focus:outline-none focus:border-wedding-secondary bg-white"
          >
            <option>Sentimental e carinhoso</option>
            <option>Divertido e descontraído</option>
            <option>Formal e elegante</option>
            <option>Curto e direto</option>
          </select>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={!relationship || isGenerating}
          variant="secondary"
          className="w-full"
          isLoading={isGenerating}
        >
          <Sparkles size={16} /> Gerar Sugestão
        </Button>

        {generatedMessage && (
          <div className="mt-6 p-4 bg-wedding-bg rounded-md border border-wedding-secondary/20 relative animate-fadeIn">
            <p className="font-serif text-lg text-stone-700 italic pr-8">
              "{generatedMessage}"
            </p>
            <button 
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 text-stone-400 hover:text-wedding-primary transition-colors"
              title="Copiar"
            >
              <Copy size={16} />
            </button>
            <div className="mt-4 text-center">
              <p className="text-xs text-stone-400">
                Gostou? Copie e cole no livro de visitas físico ou envie aos noivos!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};