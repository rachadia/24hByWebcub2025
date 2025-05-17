declare module '@nlpjs/core' {
  export interface Container {
    use(plugin: any): void;
    get(name: string): any;
  }

  export function containerBootstrap(): Promise<Container>;
}

declare module '@nlpjs/nlp' {
  export class Nlp {
    settings: {
      autoSave: boolean;
    };
    addLanguage(language: string): void;
    addDocument(language: string, text: string, intent: string): void;
    addAnswer(language: string, intent: string, answer: string): void;
    train(): Promise<void>;
    process(language: string, text: string): Promise<NlpResponse>;
  }
}

declare module '@nlpjs/lang-fr' {
  const LangFr: any;
  export { LangFr };
}

interface NlpResponse {
  locale: string;
  utterance: string;
  domain: string;
  intent: string;
  score: number;
  entities: any[];
  answers: string[];
  answer?: string;
  sentiment?: {
    score: number;
    comparative: number;
    vote: string;
  };
  actions?: any[];
} 