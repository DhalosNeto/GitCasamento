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

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const family = await familyService.getById(id);
          if (family) {
            setCurrentFamily(family);
          } else {
            setError('Família não encontrada. Verifique o link.');
          }
        } catch (err) {
          setError('Erro ao carregar dados. Tente novamente mais tarde.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('Link inválido.');
      }
    };
    fetchData();
  }, [id]);

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-wedding-bg">
        <div className="w-16 h-16 border-4 border-wedding-accent border-t-wedding-primary rounded-full animate-spin mb-4"></div>
        <div className="font-serif text-wedding-primary tracking-widest uppercase text-sm">Carregando convite...</div>
      </div>
    );
  }

  if (error || !currentFamily) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-wedding-bg p-4 text-center">
        <h1 className="text-4xl font-serif text-wedding-primary mb-4">Ops!</h1>
        <div className="h-0.5 bg-wedding-accent/40 w-12 mx-auto mb-8"></div>
        <p className="text-stone-600 mb-8 max-w-sm">{error}</p>
        <a href="/" className="text-xs tracking-widest uppercase font-bold text-wedding-secondary hover:text-wedding-primary border-b border-wedding-secondary/30 pb-1">Voltar para o início</a>
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

      <main className="max-w-4xl mx-auto px-4 mt-16 pb-20">
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl border-t-8 border-wedding-primary animate-fadeIn overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <CheckCircle2 size={120} />
            </div>

            <div className="relative z-10">
                <div className="mb-12 text-center md:text-left">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-bold mb-2 block">Convite para</span>
                    <h2 className="font-serif text-3xl md:text-5xl text-stone-800">{currentFamily.name}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div className="p-8 bg-wedding-bg rounded-sm border border-stone-100">
                        <div className="flex items-center gap-4 text-wedding-primary mb-4">
                            <Calendar size={24} />
                            <span className="font-serif text-xl tracking-wide uppercase">Quando</span>
                        </div>
                        <p className="text-stone-600 font-light leading-relaxed">
                            <span className="font-medium text-stone-800">{WEDDING_DETAILS.date}</span><br />
                            A partir das {WEDDING_DETAILS.time}h
                        </p>
                    </div>

                    <div className="p-8 bg-wedding-bg rounded-sm border border-stone-100">
                        <div className="flex items-center gap-4 text-wedding-primary mb-4">
                            <MapPin size={24} />
                            <span className="font-serif text-xl tracking-wide uppercase">Onde</span>
                        </div>
                        <p className="text-stone-600 font-light leading-relaxed">
                            <span className="font-medium text-stone-800">{WEDDING_DETAILS.location}</span><br />
                            Estrada Velha de Sintra, 45
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
                        Prazzo para confirmação: 18 de Junho de 2026
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};
