import { GiftItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api`;

const getAdminHeaders = () => {
  const token = localStorage.getItem('wedding_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const giftService = {
  getAll: async (): Promise<GiftItem[]> => {
    const response = await fetch(`${API_URL}/gifts`);
    if (!response.ok) throw new Error('Failed to fetch gifts');
    return response.json();
  },

  create: async (gift: Omit<GiftItem, 'id'>): Promise<{ id: string }> => {
    const response = await fetch(`${API_URL}/admin/gift`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(gift),
    });
    
    if (response.status === 401) {
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('wedding_admin_token');
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) throw new Error('Failed to create gift');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/gift/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    
    if (response.status === 401) {
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('wedding_admin_token');
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) throw new Error('Failed to delete gift');
  },

  update: async (id: string, gift: Partial<GiftItem>): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/gift/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(gift),
    });
    
    if (response.status === 401) {
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('wedding_admin_token');
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) throw new Error('Failed to update gift');
  }
};
