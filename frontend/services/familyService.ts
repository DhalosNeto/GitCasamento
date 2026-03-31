import { Family, Guest } from '../types';
import { MOCK_FAMILIES } from '../constants';

const STORAGE_KEY = 'wedding_families_data';

const API_URL = 'http://localhost:3001/api';

export const familyService = {
  getAll: async (): Promise<Family[]> => {
    const response = await fetch(`${API_URL}/admin/families`);
    if (!response.ok) throw new Error('Failed to fetch families');
    return response.json();
  },

  getById: async (id: string): Promise<Family | undefined> => {
    const response = await fetch(`${API_URL}/family/${id}`);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error('Failed to fetch family');
    return response.json();
  },

  create: async (family: Omit<Family, 'id'>): Promise<{ id: string }> => {
    const response = await fetch(`${API_URL}/admin/family`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    // Note: Delete endpoint is not yet implemented in backend, but will be if needed
    console.warn('Delete endpoint not implemented in backend yet');
  },

  generateAccessCode: (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
};
