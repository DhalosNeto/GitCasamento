import { Family, GiftItem } from './types';

// In a real app, this would come from a database.
// We mock it here to demonstrate the "distinct login" flow.
export const MOCK_FAMILIES: Family[] = [
  {
    id: 'fam_001',
    accessCode: 'SILVA2026',
    name: 'Família Silva',
    members: [
      { id: 'g_1', name: 'Roberto Silva', isAttending: null },
      { id: 'g_2', name: 'Ana Silva', isAttending: null },
      { id: 'g_3', name: 'Lucas Silva', isAttending: null },
    ]
  },
  {
    id: 'fam_002',
    accessCode: 'COSTA2026',
    name: 'Família Costa',
    members: [
      { id: 'g_4', name: 'Mariana Costa', isAttending: null },
      { id: 'g_5', name: 'Pedro Costa', isAttending: null },
    ]
  },
  {
    id: 'fam_003',
    accessCode: 'TESTE',
    name: 'Convidado Teste',
    members: [
      { id: 'g_6', name: 'Visitante Ilustre', isAttending: null },
    ]
  }
];

export const MOCK_GIFTS: GiftItem[] = [
  { 
    id: '1', 
    name: 'Jantar Romântico na Lua de Mel', 
    price: 350.00, 
    category: 'Lua de Mel',
    description: 'Um jantar especial à luz de velas para os noivos aproveitarem a viagem.'
  },
  { 
    id: '2', 
    name: 'Cota para Passagens Aéreas', 
    price: 500.00, 
    category: 'Lua de Mel',
    description: 'Ajude os noivos a chegarem ao destino dos sonhos.'
  },
  { 
    id: '3', 
    name: 'Jogo de Jantar Porcelana', 
    price: 450.00, 
    category: 'Casa Nova',
    description: 'Para recebermos vocês com muito carinho em nossa nova casa.'
  },
  { 
    id: '4', 
    name: 'Cafeteira Expresso', 
    price: 800.00, 
    category: 'Eletrodomésticos',
    description: 'Para o café da manhã de todos os dias.'
  },
  { 
    id: '5', 
    name: 'Dia de Spa para o Casal', 
    price: 300.00, 
    category: 'Bem-estar',
    description: 'Um dia relaxante após a correria do casamento.'
  },
  { 
    id: '6', 
    name: 'Brinde com Champanhe', 
    price: 150.00, 
    category: 'Celebração',
    description: 'Garanta o brinde da nossa primeira noite casados.'
  },
  { 
    id: '7', 
    name: 'Jogo de Toalhas Premium', 
    price: 200.00, 
    category: 'Casa Nova',
    description: 'Conforto para o nosso dia a dia.'
  },
  { 
    id: '8', 
    name: 'Passeio de Barco', 
    price: 400.00, 
    category: 'Lua de Mel',
    description: 'Um passeio inesquecível durante a viagem.'
  }
];

export const WEDDING_DETAILS = {
  coupleNames: "Dinah & Tiago",
  date: "18 de Julho de 2026",
  time: "16:00",
  location: "Quinta do Vale, Sintra",
  mapUrl: "https://maps.google.com"
};