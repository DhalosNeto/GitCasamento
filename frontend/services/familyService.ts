import { Family, Guest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://gitcasamento.onrender.com/api';

const getAdminHeaders = () => {
  const token = localStorage.getItem('wedding_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const familyService = {
  login: async (password: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('wedding_admin_token', token);
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('wedding_admin_token');
  },

  getAll: async (): Promise<Family[]> => {
    const response = await fetch(`${API_URL}/admin/families`, {
      headers: getAdminHeaders()
    });
    
    if (response.status === 401) {
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('wedding_admin_token');
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) throw new Error('Failed to fetch families');
    return response.json();
  },

  getById: async (id: string): Promise<Family | undefined> => {
    const response = await fetch(`${API_URL}/family/${id}`);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error('Failed to fetch family');
    return response.json();
  },

  getByAccessCode: async (code: string): Promise<Family | undefined> => {
    const response = await fetch(`${API_URL}/family/code/${code}`);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error('Failed to fetch family by code');
    return response.json();
  },

  create: async (family: Omit<Family, 'id'>): Promise<{ id: string }> => {
    const response = await fetch(`${API_URL}/admin/family`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(family),
    });
    if (!response.ok) throw new Error('Failed to create family');
    return response.json();
  },

  update: async (id: string, updates: Partial<Family>): Promise<void> => {
    const response = await fetch(`${API_URL}/family/${id}/rsvp`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update family');
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/family/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete family');
  },

  generateAccessCode: (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  },
  getApiUrl: () => API_URL,
  getBaseUrl: () => import.meta.env.VITE_BASE_URL || 'https://gitcasamento.onrender.com'
};
