import React, { useState, useEffect } from 'react';
import { Family, Guest } from '../types';
import { Button } from './Button';
import { Check, X } from 'lucide-react';

interface RsvpSectionProps {
  family: Family;
  onUpdateFamily: (updatedFamily: Family) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ family, onUpdateFamily }) => {
  // Local state to manage edits before saving
  const [members, setMembers] = useState<Guest[]>(family.members);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setMembers(family.members);
  }, [family]);

  const handleAttendanceChange = (id: string, isAttending: boolean) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, isAttending } : m));
    setIsSaved(false);
  };

  const handleSave = () => {
    // Here you would typically make an API call
    const updatedFamily = { ...family, members };
    onUpdateFamily(updatedFamily);
    setIsSaved(true);

    // Simulate toast or feedback
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-wedding-primary mb-2">Confirmação de Presença</h2>
        <p className="text-stone-600 font-light">Por favor, confirme quem poderá compartilhar este dia especial conosco.</p>
      </div>

      <div className="grid gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-md shadow-sm border border-stone-100 transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="font-serif text-xl text-stone-800">{member.name}</span>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
                <button
                  onClick={() => handleAttendanceChange(member.id, true)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-sm border transition-colors flex items-center justify-center gap-2 ${member.isAttending === true
                      ? 'bg-wedding-primary text-white border-wedding-primary shadow-inner font-semibold'
                      : 'bg-white border-stone-200 text-stone-500 hover:border-wedding-primary hover:text-wedding-primary'
                    }`}
                >
                  <Check size={16} /> Confirmar
                </button>
                <button
                  onClick={() => handleAttendanceChange(member.id, false)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-sm border transition-colors flex items-center justify-center gap-2 ${member.isAttending === false
                      ? 'bg-stone-500 text-white border-stone-500 shadow-inner font-semibold'
                      : 'bg-white border-stone-200 text-stone-500 hover:border-red-400 hover:text-red-400'
                    }`}
                >
                  <X size={16} /> Não poderei ir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button onClick={handleSave} className="w-full md:w-auto min-w-[200px]">
          {isSaved ? "Salvo com Sucesso!" : "Enviar Confirmação"}
        </Button>
      </div>
    </div>
  );
};