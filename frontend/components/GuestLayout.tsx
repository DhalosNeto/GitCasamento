import React, { useState } from 'react';
import { NavLink, useParams, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const GuestLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'HOME', path: id ? `/convite/${id}/home` : '/home' },
    { label: 'CERIMÔNIA', path: id ? `/convite/${id}/cerimonia` : '/cerimonia' },
    { label: 'RECEPÇÃO', path: id ? `/convite/${id}/recepcao` : '/recepcao' },
    { label: 'LISTA DE PRESENTES', path: id ? `/convite/${id}/presentes` : '/presentes' },
    { label: 'CONFIRME SUA PRESENÇA', path: id ? `/convite/${id}/rsvp` : '/rsvp' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-wedding-bg font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 md:h-20">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-xs lg:text-sm font-medium tracking-[0.2em] transition-colors hover:text-wedding-accent ${
                      isActive ? 'text-wedding-accent border-b border-wedding-accent/50 pb-1' : 'text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center w-full justify-between">
              <div className="text-white font-serif text-xl tracking-widest">D&T</div>
              <button
                onClick={toggleMenu}
                className="text-white hover:text-wedding-accent focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          } bg-black/80 backdrop-blur-md`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-4 text-sm font-medium tracking-[0.2em] ${
                    isActive ? 'text-wedding-accent' : 'text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-20 bg-stone-900 text-stone-400 text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8 opacity-90 transition-opacity hover:opacity-100">
            <img src="/logo.png" alt="Logo" className="w-24 md:w-32 drop-shadow-xl" />
          </div>

          <div className="font-serif text-3xl text-wedding-accent mb-4 tracking-wider uppercase">Dinah & Tiago</div>
          <p className="text-sm tracking-[0.2em] mb-8 uppercase font-light">18 de Julho de 2026</p>
          
          <div className="h-px bg-stone-800 w-16 mx-auto mb-8"></div>
          
          <p className="text-sm font-serif max-w-sm mx-auto leading-relaxed mb-4">
            "Assim, permanece agora estes três: a fé, a esperança e o amor. O maior deles, porém, é o amor."
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-wedding-accent">
            1 Coríntios 13:13
          </p>

        </div>
      </footer>
    </div>
  );
};
