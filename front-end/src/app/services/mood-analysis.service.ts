import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MoodAnalysisResult {
  mood: string;
  confidence: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoodAnalysisService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Remplacez par votre clé API Gemini
    const API_KEY = '';
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  }

  analyzeMood(text: string): Observable<MoodAnalysisResult> {
    const prompt = `
      Analyse l'humeur exprimée dans le texte suivant. 
      Retourne le résultat au format JSON avec les propriétés suivantes:
      - mood: l'humeur générale (joyeux, triste, neutre, en colère, anxieux, etc.)
      - confidence: un chiffre entre 0 et 1 représentant la confiance de l'analyse
      - description: une brève description expliquant le raisonnement

      Texte à analyser: "${text}"
    `;

    return from(this.model.generateContent(prompt))
      .pipe(
        map((result: any) => {
          const responseText = result.response.text();
          try {
            return JSON.parse(responseText) as MoodAnalysisResult;
          } catch (error) {
            console.error('Erreur lors du parsing du résultat:', error);
            return {
              mood: 'indéterminé',
              confidence: 0,
              description: 'Impossible d\'analyser l\'humeur.'
            };
          }
        })
      );
  }
}