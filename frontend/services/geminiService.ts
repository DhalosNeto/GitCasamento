import { familyService } from './familyService';

export const generateWeddingMessage = async (
  relationship: string,
  tone: string,
  coupleNames: string
): Promise<string> => {
  try {
    const baseUrl = familyService.getBaseUrl();
    const response = await fetch(`${baseUrl}/api/generate-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relationship, tone, coupleNames })
    });

    if (!response.ok) {
       throw new Error('Falha na API: ' + response.statusText);
    }
    const data = await response.json();
    return data.text || "Felicidades ao casal!";
  } catch (error) {
    console.error("Erro ao gerar mensagem via servidor:", error);
    return "Desejamos toda a felicidade do mundo nesta nova jornada!";
  }
};