import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RsvpSection } from './RsvpSection';
import { GiftListModal } from './GiftListModal';
import { Family } from '../types';
import { WEDDING_DETAILS } from '../constants';
import { familyService } from '../services/familyService';
import { MapPin, Calendar, Gift, LogOut } from 'lucide-react';

export const GuestView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [isGiftListOpen, setIsGiftListOpen] = useState(false);
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
      // Update local state first for responsiveness
      setCurrentFamily(updatedFamily);
      // Update backend
      await familyService.update(updatedFamily.id, updatedFamily);
    } catch (err) {
      alert('Erro ao salvar confirmação. Tente novamente.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error || !currentFamily) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-wedding-bg p-4 text-center">
        <h1 className="text-2xl font-serif text-wedding-primary mb-4">Ops!</h1>
        <p className="text-stone-600 mb-6">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="text-wedding-secondary hover:underline"
        >
          Voltar para o início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-bg pb-20">
      {/* Navigation / Header */}
      <nav className="bg-white shadow-sm border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-serif text-2xl text-wedding-primary tracking-tight">
            D<span className="text-wedding-secondary">&</span>T
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500 hidden md:block">
              Bem-vindos, <span className="font-semibold text-wedding-primary">{currentFamily.name}</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-wedding-primary text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-100 via-wedding-primary to-wedding-primary"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">{WEDDING_DETAILS.coupleNames}</h1>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-wedding-accent font-light tracking-widest text-sm md:text-base uppercase">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {WEDDING_DETAILS.date} • {WEDDING_DETAILS.time}
            </div>
            <div className="hidden md:block w-1 h-1 bg-current rounded-full"></div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              {WEDDING_DETAILS.location}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 space-y-8">

        {/* Intro Card */}
        <div className="bg-white p-8 rounded-lg shadow-md text-center border-t-4 border-wedding-secondary">
          <p className="font-serif text-xl md:text-2xl text-stone-700 leading-relaxed">
            "Ficaremos honrados com a presença da sua família para celebrar o início da nossa vida juntos."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Left Column: RSVP (Takes up 2 cols) */}
          <div className="md:col-span-2 space-y-8">
            <section id="rsvp">
              <RsvpSection family={currentFamily} onUpdateFamily={handleUpdateFamily} />
            </section>
          </div>

          {/* Right Column: Location */}
          <div className="space-y-8">
            {/* Location Map */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-wedding-secondary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

              <div className="inline-flex items-center justify-center p-4 bg-stone-100 rounded-full mb-4 text-wedding-primary group-hover:bg-wedding-primary group-hover:text-white transition-colors duration-500">
                <MapPin size={28} />
              </div>
              <h3 className="font-serif text-2xl text-stone-800 mb-2">Local do Evento</h3>
              <p className="text-stone-500 text-sm mb-6 px-4">
                {WEDDING_DETAILS.location}<br />
                {WEDDING_DETAILS.date} às {WEDDING_DETAILS.time}
              </p>

              <div className="w-full h-32 bg-stone-50 rounded flex items-center justify-center mb-6">
                <MapPin className="text-stone-300" size={32} />
              </div>

              <a
                href={WEDDING_DETAILS.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-3 bg-wedding-secondary text-white rounded-sm hover:bg-wedding-primary transition-colors font-sans tracking-wide shadow-md text-center"
              >
                Como Chegar
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 text-center text-stone-400 text-sm border-t border-stone-200">
        <p>&copy; 2026 {WEDDING_DETAILS.coupleNames}. Com amor.</p>
      </footer>
    </div>
  );
};
