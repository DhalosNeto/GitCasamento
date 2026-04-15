import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
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
      <ScrollToTop />
      <Routes>
        {/* Guest Experience - Root and with ID */}
        <Route path="/confirmacao/:id" element={<RedirectToNewHome />} />
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="cerimonia" element={<Ceremony />} />
          <Route path="recepcao" element={<Reception />} />
          <Route path="presentes" element={<GiftListPage />} />
          <Route path="rsvp" element={<RsvpPage />} />
        </Route>

        {/* Support the old /convite/:id structure but it maps to the same layout */}
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

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
