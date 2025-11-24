
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { PatientData } from '../models/patient-data.model';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // This is a placeholder for a secure API key handling mechanism.
    // In a real app, process.env.API_KEY would be set in the build environment.
    const apiKey = (window as any).process?.env?.API_KEY ?? '';
    if (!apiKey) {
      console.error("API Key for Gemini is not set. Report generation will fail.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateDailyReport(patientData: PatientData): Promise<string> {
    if (!this.ai) {
        return "El servicio de reportes no está disponible en este momento.";
    }

    const prompt = `
      Eres un asistente de salud compasivo y profesional. Tu tarea es generar un breve resumen del día de un adulto mayor para sus familiares, basado en los datos del sensor. El resumen debe ser tranquilizador pero informativo.
      
      Datos del día:
      - Pasos caminados: ${patientData.dailystepcount}
      - Historial de niveles de actividad (de más reciente a más antiguo): ${patientData.movementhistory.join(', ')}
      - Última ubicación registrada: ${patientData.currentroom}

      Basado en estos datos, escribe un resumen conciso (2-3 frases) en español. Enfócate en el nivel de actividad general y termina con una nota positiva. Por ejemplo, si hay muchos 'normal', es un buen día. Si hay muchos 'low' o 'none', menciónalo con cuidado.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Error generating report with Gemini:', error);
      return 'No se pudo generar el informe en este momento. Por favor, inténtelo de nuevo más tarde.';
    }
  }
}
