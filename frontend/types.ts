export interface Guest {
  id: string;
  name: string;
  isAttending: boolean | null; // null = not decided yet
  dietaryRestrictions?: string;
}

export interface Family {
  id: string;
  accessCode: string; // The "password" for the family
  name: string; // e.g., "Família Silva"
  members: Guest[];
  messageToCouple?: string;
}

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

export enum AppView {
  LOGIN,
  DASHBOARD
}