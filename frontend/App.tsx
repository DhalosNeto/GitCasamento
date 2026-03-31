import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { GuestView } from './components/GuestView';
import { GiftListView } from './components/GiftListView';
import { WEDDING_DETAILS } from './constants';

// Guest Components
import { GuestLayout } from './components/GuestLayout';
import { Home } from './components/Home';
import { Ceremony } from './components/Ceremony';
import { Reception } from './components/Reception';
import { GiftListPage } from './components/GiftListPage';
import { RsvpPage } from './components/RsvpPage';

// Helper component to handle redirect with params
const RedirectToNewHome: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/convite/${id}/home`} replace />;
};

const App: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true');
  };

  return (
    <Router>
      <Routes>
        {/* Legacy Guest Route - Redirect to New Home */}
        <Route path="/confirmacao/:id" element={<RedirectToNewHome />} />

        {/* New Multi-page Guest Experience */}
        <Route path="/convite/:id" element={<GuestLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="cerimonia" element={<Ceremony />} />
          <Route path="recepcao" element={<Reception />} />
          <Route path="presentes" element={<GiftListPage />} />
          <Route path="rsvp" element={<RsvpPage />} />
        </Route>

        {/* Admin Routes - Login Required */}
        <Route path="/admin" element={
          isAdminAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleAdminLogin} />
        } />

        <Route path="/admin/dashboard" element={
          isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin" />
        } />

        <Route path="/presentes" element={
          isAdminAuthenticated ? <GiftListView /> : <Navigate to="/admin" />
        } />

        {/* Home / Fallback */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-wedding-bg p-4 text-center">
            <h1 className="font-serif text-5xl text-wedding-primary mb-6 animate-fadeIn">
              {WEDDING_DETAILS.coupleNames}
            </h1>
            <p className="text-stone-600 mb-8 max-w-md text-lg italic">
              "Para tudo há uma ocasião, e um tempo para cada propósito debaixo do céu."
            </p>
            <p className="text-stone-500 mb-8 max-w-sm">
              Por favor, utilize o link exclusivo que enviamos no seu convite para confirmar sua presença.
            </p>
            <div className="flex flex-col gap-4 items-center">
              <a 
                href="/convite/fam_003/home" 
                className="px-8 py-3 bg-wedding-primary text-white text-xs tracking-[0.2em] font-bold uppercase transition-all hover:bg-wedding-secondary"
              >
                Ver Exemplo de Site
              </a>
              <div className="text-sm text-stone-400 mt-8">
                <a href="/admin" className="hover:text-wedding-secondary transition-colors underline decoration-dotted">
                  Acesso dos Noivos
                </a>
              </div>
            </div>
          </div>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
