import React, { useState } from 'react';
import { Button } from './Button';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded password for "Noivos"
    if (password === 'casamento2026') {
      onLogin();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-stone-200">
        <div className="flex justify-center mb-6 text-wedding-primary">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-serif text-center text-stone-800 mb-6">Acesso dos Noivos</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha de acesso"
              className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-wedding-primary"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </div>
    </div>
  );
};
