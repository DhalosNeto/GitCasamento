import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWeddingMessage = async (
  relationship: string,
  tone: string,
  coupleNames: string
): Promise<string> => {
  try {
    const prompt = `
      Você é um assistente criativo de escrita para convidados de casamento.
      Escreva uma mensagem curta, elegante e carinhosa para o livro de visitas dos noivos: ${coupleNames}.
      
      O convidado tem a seguinte relação com os noivos: "${relationship}".
      O tom da mensagem deve ser: "${tone}".
      
      A mensagem deve ter no máximo 3 frases. Responda apenas com o texto da mensagem.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Felicidades ao casal!";
  } catch (error) {
    console.error("Erro ao gerar mensagem:", error);
    return "Desejamos toda a felicidade do mundo nesta nova jornada!";
  }
};