import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RsvpSection } from './RsvpSection';
import { Family } from '../types';
import { familyService } from '../services/familyService';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { WEDDING_DETAILS } from '../constants';

export const RsvpPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const family = await familyService.getById(id);
          if (family) {
            setCurrentFamily(family);
          } else {
            setError('Não encontramos seu convite com este link. Por favor, verifique se o link está correto.');
          }
        } catch (err) {
          setError('Houve um erro ao carregar seus dados. Por favor, tente novamente mais tarde.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        // We don't set an error here, just wait for manual entry
      }
    };
    fetchData();
  }, [id]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setIsVerifying(true);
    setError('');

    try {
      const family = await familyService.getByAccessCode(accessCode.trim());
      if (family) {
        setCurrentFamily(family);
      } else {
        setError('Código de acesso não encontrado. Por favor, tente novamente.');
      }
    } catch (err) {
      setError('Erro ao verificar código. Tente novamente mais tarde.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdateFamily = async (updatedFamily: Family) => {
    try {
      setCurrentFamily(updatedFamily);
      await familyService.update(updatedFamily.id, updatedFamily);
    } catch (err) {
      alert('Erro ao salvar confirmação. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center bg-wedding-bg">
        <div className="w-16 h-16 border-4 border-wedding-accent border-t-wedding-primary rounded-full animate-spin mb-4"></div>
        <div className="font-serif text-wedding-primary tracking-widest uppercase text-sm">Carregando convite...</div>
      </div>
    );
  }

  // If no ID and no family loaded yet, show a beautiful access code form
  if (!currentFamily) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center bg-wedding-bg p-4 overflow-y-auto">
        <div className="bg-white p-10 rounded-sm shadow-xl border-t-4 border-wedding-primary max-w-md w-full text-center animate-fadeIn">
          <h1 className="text-3xl font-serif text-wedding-primary mb-2 uppercase tracking-wide">Bem-vindo!</h1>
          <div className="h-0.5 bg-wedding-accent/20 w-12 mx-auto mb-8"></div>
          
          <p className="text-stone-600 mb-8 font-light italic leading-relaxed">
            Por favor, utilize o código de acesso impresso em seu convite para confirmar seu nome.
          </p>

          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="group">
              <label className="block text-[10px] tracking-[0.4em] uppercase text-stone-400 font-bold mb-3 text-left">Código de Acesso</label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-wedding-primary transition-all text-center font-serif text-xl tracking-widest uppercase"
                maxLength={10}
              />
            </div>

            {error && <p className="text-red-500 text-xs animate-shake">{error}</p>}

            <button
              type="submit"
              disabled={isVerifying || !accessCode.trim()}
              className="w-full bg-wedding-primary text-white py-4 px-6 rounded-sm tracking-[0.3em] uppercase text-xs font-bold shadow-md hover:bg-wedding-secondary transition-all disabled:opacity-50"
            >
              {isVerifying ? 'Verificando...' : 'Encontrar meu Convite'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-stone-100">
            <a href="/" className="text-[10px] tracking-widest uppercase font-bold text-stone-400 hover:text-wedding-primary transition-colors">Voltar para o início</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-wedding-bg min-h-screen">
      <header className="py-16 px-4 bg-white text-center border-b border-stone-100">
        <h1 className="font-serif text-4xl md:text-5xl text-wedding-primary mb-4 tracking-wide uppercase">Confirme sua Presença</h1>
        <div className="h-0.5 bg-wedding-accent/40 w-16 mx-auto mb-8"></div>
        <p className="font-serif italic text-stone-500 text-lg">"Sua presença tornará nosso dia ainda mais especial."</p>
      </header>

      <main className="max-w-4xl mx-auto px-2 md:px-4 mt-6 md:mt-16 pb-20">
        <div className="bg-white p-5 md:p-12 rounded-sm shadow-xl border-t-8 border-wedding-primary animate-fadeIn overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <CheckCircle2 size={120} />
            </div>

            <div className="relative z-10">
                <div className="mb-12 text-center md:text-left">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-bold mb-2 block">Convite para</span>
                    <h2 className="font-serif text-3xl md:text-5xl text-stone-800">{currentFamily.name}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-10 md:mb-16">
                    <div className="p-5 md:p-8 bg-wedding-bg rounded-sm border border-stone-100">
                        <div className="flex items-center gap-4 text-wedding-primary mb-4">
                            <Calendar size={24} />
                            <span className="font-serif text-xl tracking-wide uppercase">Quando</span>
                        </div>
                        <p className="text-stone-600 font-light leading-relaxed">
                            <span className="font-medium text-stone-800">{WEDDING_DETAILS.date}</span><br />
                            Às {WEDDING_DETAILS.ceremonyTime}
                        </p>
                    </div>

                    <div className="p-5 md:p-8 bg-wedding-bg rounded-sm border border-stone-100">
                        <div className="flex items-center gap-4 text-wedding-primary mb-4">
                            <MapPin size={24} />
                            <span className="font-serif text-xl tracking-wide uppercase">Onde</span>
                        </div>
                        <p className="text-stone-600 font-light leading-relaxed">
                            <span className="font-medium text-stone-800">{WEDDING_DETAILS.location}</span><br />
                            Teixeira de Freitas, BA
                        </p>
                    </div>
                </div>

                <div className="h-px bg-stone-100 w-full mb-16"></div>

                <section id="rsvp-section">
                    <RsvpSection family={currentFamily} onUpdateFamily={handleUpdateFamily} />
                </section>

                <div className="mt-20 pt-12 border-t border-stone-50 text-center">
                    <p className="font-serif italic text-stone-400 text-lg mb-8">
                        "Ficaremos muito felizes em celebrar com vocês."
                    </p>
                    <div className="text-[10px] tracking-[0.4em] uppercase text-wedding-accent font-bold">
                        Prazo para confirmação: 01 de Junho de 2026
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};
