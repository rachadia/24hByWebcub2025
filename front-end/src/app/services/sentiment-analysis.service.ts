import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
//import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SentimentAnalysisService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey =  '' //environment.OPENAI_API_KEY;

  constructor(private http: HttpClient) {}

  analyzeSentiment(text: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a sentiment analysis assistant.' },
        { role: 'user', content: `Analyze the sentiment of this text: ${text}` }
      ]
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((response) => {
        const content = response.choices[0]?.message?.content || '';
        return this.parseSentiment(content);
      }),
      catchError((error) => {
        console.error('Error in sentiment analysis:', error);
        return throwError(() => new Error('Failed to analyze sentiment'));
      })
    );
  }

  private parseSentiment(response: string): string {
    const lowerCaseResponse = response.toLowerCase();
    if (lowerCaseResponse.includes('positive')) return 'Positive';
    if (lowerCaseResponse.includes('negative')) return 'Negative';
    if (lowerCaseResponse.includes('neutral')) return 'Neutral';
    return 'Unknown';
  }
}
