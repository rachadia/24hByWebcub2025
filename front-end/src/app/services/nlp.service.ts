import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { containerBootstrap, Container } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { LangFr } from '@nlpjs/lang-fr';

@Injectable({
  providedIn: 'root'
})
export class NlpService {
  private nlp!: Nlp;
  private isTrained = false;
  private processingSubject = new BehaviorSubject<boolean>(false);
  private responseSubject = new BehaviorSubject<string>('');

  constructor() {
    this.initializeNlp();
  }

  private async initializeNlp() {
    try {
      const container: Container = await containerBootstrap();
      container.use(Nlp);
      container.use(LangFr);
      this.nlp = container.get('nlp');
      this.nlp.settings.autoSave = false;
      this.nlp.addLanguage('fr');

    // Adds the utterances and intents for the NLP
    /*
  // Greetings
  this.nlp.addDocument('fr', "au revoir pour l'instant", 'greetings.bye');
  this.nlp.addDocument('fr', 'au revoir et soyez prudent', 'greetings.bye');
  this.nlp.addDocument('fr', 'très bien à plus tard', 'greetings.bye');
  this.nlp.addDocument('fr', 'je dois partir', 'greetings.bye');
  this.nlp.addDocument('fr', 'Salut', 'greetings.hello');
  this.nlp.addDocument('fr', 'Bonjour', 'greetings.hello');
  this.nlp.addDocument('fr', 'Coucou', 'greetings.hello');
  
  // Emotions - Joie
  this.nlp.addDocument('fr', 'je suis content', 'emotion.joie');
  this.nlp.addDocument('fr', 'je suis heureux', 'emotion.joie');
  this.nlp.addDocument('fr', 'je me sens bien aujourd\'hui', 'emotion.joie');
  this.nlp.addDocument('fr', 'quelle belle journée', 'emotion.joie');
  this.nlp.addDocument('fr', 'je suis de bonne humeur', 'emotion.joie');
  
  // Emotions - Tristesse
  this.nlp.addDocument('fr', 'je suis triste', 'emotion.tristesse');
  this.nlp.addDocument('fr', 'je me sens déprimé', 'emotion.tristesse');
  this.nlp.addDocument('fr', 'je ne vais pas bien', 'emotion.tristesse');
  this.nlp.addDocument('fr', 'je suis malheureux', 'emotion.tristesse');
  this.nlp.addDocument('fr', 'quelle journée difficile', 'emotion.tristesse');
  
  // Emotions - Colère
  this.nlp.addDocument('fr', 'je ne suis pas content', 'emotion.colere');
  this.nlp.addDocument('fr', 'je suis en colère', 'emotion.colere');
  this.nlp.addDocument('fr', 'je suis énervé', 'emotion.colere');
  this.nlp.addDocument('fr', 'ça m\'agace', 'emotion.colere');
  this.nlp.addDocument('fr', 'je suis frustré', 'emotion.colere');
  this.nlp.addDocument('fr', 'je suis furieux', 'emotion.colere');
  
  // Emotions - Surprise
  this.nlp.addDocument('fr', 'je suis surpris', 'emotion.surprise');
  this.nlp.addDocument('fr', 'incroyable', 'emotion.surprise');
  this.nlp.addDocument('fr', 'je ne m\'y attendais pas', 'emotion.surprise');
  this.nlp.addDocument('fr', 'quelle surprise', 'emotion.surprise');
  this.nlp.addDocument('fr', 'c\'est étonnant', 'emotion.surprise');
  
  // Train also the NLG
  // Greetings responses
  this.nlp.addAnswer('fr', 'greetings.bye', 'à la prochaine');
  this.nlp.addAnswer('fr', 'greetings.bye', 'à bientôt!');
  this.nlp.addAnswer('fr', 'greetings.hello', 'salut comment ca va!');
  this.nlp.addAnswer('fr', 'greetings.hello', 'salutations!');
  
  // Emotion responses
  this.nlp.addAnswer('fr', 'emotion.joie', 'Je suis ravi que vous soyez content!');
  this.nlp.addAnswer('fr', 'emotion.joie', 'C\'est génial de vous voir heureux aujourd\'hui!');
  this.nlp.addAnswer('fr', 'emotion.joie', 'Excellente nouvelle, continuez comme ça!');
  
  this.nlp.addAnswer('fr', 'emotion.tristesse', 'Je suis désolé que vous vous sentiez triste.');
  this.nlp.addAnswer('fr', 'emotion.tristesse', 'Ça va aller mieux, gardez espoir.');
  this.nlp.addAnswer('fr', 'emotion.tristesse', 'Parfois parler à quelqu\'un peut aider dans ces moments difficiles.');
  
  this.nlp.addAnswer('fr', 'emotion.colere', 'Je comprends votre frustration.');
  this.nlp.addAnswer('fr', 'emotion.colere', 'Prenez un moment pour respirer profondément.');
  this.nlp.addAnswer('fr', 'emotion.colere', 'Exprimez ce qui vous préoccupe, ça peut soulager.');
  
  this.nlp.addAnswer('fr', 'emotion.surprise', 'C\'est en effet surprenant!');
  this.nlp.addAnswer('fr', 'emotion.surprise', 'La vie est pleine de surprises, n\'est-ce pas?');
  this.nlp.addAnswer('fr', 'emotion.surprise', 'Je comprends votre étonnement!');
  */


  this.nlp.addDocument('fr', "au revoir pour l'instant", 'greetings.bye');
  this.nlp.addDocument('fr', 'au revoir et soyez prudent', 'greetings.bye');
  this.nlp.addDocument('fr', 'très bien à plus tard', 'greetings.bye');
  this.nlp.addDocument('fr', 'je dois partir', 'greetings.bye');
  this.nlp.addDocument('fr', 'Salut', 'greetings.hello');
  this.nlp.addDocument('fr', 'Bonjour', 'greetings.hello');
  this.nlp.addDocument('fr', 'Coucou', 'greetings.hello');
  
  // Emotions - Joie
  this.nlp.addDocument('fr', 'je suis content', 'emotion.joie');
  this.nlp.addDocument('fr', 'je suis heureux', 'emotion.joie');
  this.nlp.addDocument('fr', 'je me sens bien aujourd\'hui', 'emotion.joie');
  this.nlp.addDocument('fr', 'quelle belle journée', 'emotion.joie');
  this.nlp.addDocument('fr', 'je suis de bonne humeur', 'emotion.joie');
  
  // Emotions - Tristesse
  this.nlp.addDocument('fr', 'je suis triste', 'emotion.tristesse');
  this.nlp.addDocument('fr', 'je me sens déprimé', 'emotion.tristesse');
  this.nlp.addDocument('fr', 'je ne vais pas bien', 'emotion.tristesse');
  this.nlp.addDocument('fr', 'je suis malheureux', 'emotion.tristesse');
  this.nlp.addDocument('fr', 'quelle journée difficile', 'emotion.tristesse');
  
  // Emotions - Colère
  this.nlp.addDocument('fr', 'je suis en colère', 'emotion.colere');
  this.nlp.addDocument('fr', 'je suis énervé', 'emotion.colere');
  this.nlp.addDocument('fr', 'ça m\'agace', 'emotion.colere');
  this.nlp.addDocument('fr', 'je suis frustré', 'emotion.colere');
  this.nlp.addDocument('fr', 'je suis furieux', 'emotion.colere');
  
  // Emotions - Surprise
  this.nlp.addDocument('fr', 'je suis surpris', 'emotion.surprise');
  this.nlp.addDocument('fr', 'incroyable', 'emotion.surprise');
  this.nlp.addDocument('fr', 'je ne m\'y attendais pas', 'emotion.surprise');
  this.nlp.addDocument('fr', 'quelle surprise', 'emotion.surprise');
  this.nlp.addDocument('fr', 'c\'est étonnant', 'emotion.surprise');
  
  // Situations - Travail
  this.nlp.addDocument('fr', 'mon patron m\'a félicité', 'situation.travail.positif');
  this.nlp.addDocument('fr', 'j\'ai eu une promotion', 'situation.travail.positif');
  this.nlp.addDocument('fr', 'j\'ai réussi mon projet', 'situation.travail.positif');
  this.nlp.addDocument('fr', 'mon équipe est géniale', 'situation.travail.positif');
  
  this.nlp.addDocument('fr', 'mon patron m\'a critiqué', 'situation.travail.negatif');
  this.nlp.addDocument('fr', 'j\'ai raté mon entretien', 'situation.travail.negatif');
  this.nlp.addDocument('fr', 'mon projet a échoué', 'situation.travail.negatif');
  this.nlp.addDocument('fr', 'je déteste mon travail', 'situation.travail.negatif');
  this.nlp.addDocument('fr', 'l\'ambiance au bureau est tendue', 'situation.travail.negatif');
  
  // Situations - Relations personnelles
  this.nlp.addDocument('fr', 'j\'ai rencontré quelqu\'un de spécial', 'situation.relation.positif');
  this.nlp.addDocument('fr', 'mon ami m\'a offert un cadeau', 'situation.relation.positif');
  this.nlp.addDocument('fr', 'nous avons passé un bon moment ensemble', 'situation.relation.positif');
  this.nlp.addDocument('fr', 'ma famille me soutient', 'situation.relation.positif');
  
  this.nlp.addDocument('fr', 'nous nous sommes disputés', 'situation.relation.negatif');
  this.nlp.addDocument('fr', 'mon ami m\'a trahi', 'situation.relation.negatif');
  this.nlp.addDocument('fr', 'je me sens seul', 'situation.relation.negatif');
  this.nlp.addDocument('fr', 'personne ne me comprend', 'situation.relation.negatif');
  
  // Situations - Santé
  this.nlp.addDocument('fr', 'je me sens en pleine forme', 'situation.sante.positif');
  this.nlp.addDocument('fr', 'j\'ai commencé un nouveau régime', 'situation.sante.positif');
  this.nlp.addDocument('fr', 'mes analyses sont bonnes', 'situation.sante.positif');
  this.nlp.addDocument('fr', 'j\'ai perdu du poids', 'situation.sante.positif');
  
  this.nlp.addDocument('fr', 'je suis malade', 'situation.sante.negatif');
  this.nlp.addDocument('fr', 'j\'ai mal partout', 'situation.sante.negatif');
  this.nlp.addDocument('fr', 'je n\'arrive pas à dormir', 'situation.sante.negatif');
  this.nlp.addDocument('fr', 'je me sens fatigué constamment', 'situation.sante.negatif');
  
  // Combinaisons Emotion-Situation
  this.nlp.addDocument('fr', 'je suis content de ma promotion', 'emotion.joie.travail');
  this.nlp.addDocument('fr', 'je suis heureux dans mon nouveau poste', 'emotion.joie.travail');
  this.nlp.addDocument('fr', 'je suis triste d\'avoir raté mon entretien', 'emotion.tristesse.travail');
  this.nlp.addDocument('fr', 'je suis furieux contre mon patron', 'emotion.colere.travail');
  
  this.nlp.addDocument('fr', 'je suis content d\'avoir rencontré cette personne', 'emotion.joie.relation');
  this.nlp.addDocument('fr', 'je suis heureux en couple', 'emotion.joie.relation');
  this.nlp.addDocument('fr', 'je suis triste de notre rupture', 'emotion.tristesse.relation');
  this.nlp.addDocument('fr', 'je suis en colère contre mon ami', 'emotion.colere.relation');
  
  this.nlp.addDocument('fr', 'je suis content d\'être en bonne santé', 'emotion.joie.sante');
  this.nlp.addDocument('fr', 'je suis triste de ma condition physique', 'emotion.tristesse.sante');
  this.nlp.addDocument('fr', 'je suis frustré par ma maladie', 'emotion.colere.sante');
  
  // Train also the NLG
  // Greetings responses
  this.nlp.addAnswer('fr', 'greetings.bye', 'à la prochaine');
  this.nlp.addAnswer('fr', 'greetings.bye', 'à bientôt!');
  this.nlp.addAnswer('fr', 'greetings.hello', 'salut comment ca va!');
  this.nlp.addAnswer('fr', 'greetings.hello', 'salutations!');
  
  // Emotion responses
  this.nlp.addAnswer('fr', 'emotion.joie', 'Je suis ravi que vous soyez content!');
  this.nlp.addAnswer('fr', 'emotion.joie', 'C\'est génial de vous voir heureux aujourd\'hui!');
  this.nlp.addAnswer('fr', 'emotion.joie', 'Excellente nouvelle, continuez comme ça!');
  
  this.nlp.addAnswer('fr', 'emotion.tristesse', 'Je suis désolé que vous vous sentiez triste.');
  this.nlp.addAnswer('fr', 'emotion.tristesse', 'Ça va aller mieux, gardez espoir.');
  this.nlp.addAnswer('fr', 'emotion.tristesse', 'Parfois parler à quelqu\'un peut aider dans ces moments difficiles.');
  
  this.nlp.addAnswer('fr', 'emotion.colere', 'Je comprends votre frustration.');
  this.nlp.addAnswer('fr', 'emotion.colere', 'Prenez un moment pour respirer profondément.');
  this.nlp.addAnswer('fr', 'emotion.colere', 'Exprimez ce qui vous préoccupe, ça peut soulager.');
  
  this.nlp.addAnswer('fr', 'emotion.surprise', 'C\'est en effet surprenant!');
  this.nlp.addAnswer('fr', 'emotion.surprise', 'La vie est pleine de surprises, n\'est-ce pas?');
  this.nlp.addAnswer('fr', 'emotion.surprise', 'Je comprends votre étonnement!');
  
  // Situation responses
  this.nlp.addAnswer('fr', 'situation.travail.positif', 'Félicitations pour cette réussite professionnelle!');
  this.nlp.addAnswer('fr', 'situation.travail.positif', 'Votre travail acharné a porté ses fruits!');
  this.nlp.addAnswer('fr', 'situation.travail.positif', 'C\'est une excellente nouvelle pour votre carrière!');
  
  this.nlp.addAnswer('fr', 'situation.travail.negatif', 'Ne vous découragez pas, c\'est une expérience d\'apprentissage.');
  this.nlp.addAnswer('fr', 'situation.travail.negatif', 'Parfois les défis professionnels nous rendent plus forts.');
  this.nlp.addAnswer('fr', 'situation.travail.negatif', 'Avez-vous envisagé d\'en parler avec un collègue de confiance?');
  
  this.nlp.addAnswer('fr', 'situation.relation.positif', 'Les relations épanouissantes sont précieuses!');
  this.nlp.addAnswer('fr', 'situation.relation.positif', 'C\'est merveilleux d\'avoir des personnes qui vous soutiennent.');
  this.nlp.addAnswer('fr', 'situation.relation.positif', 'Chérissez ces moments spéciaux!');
  
  this.nlp.addAnswer('fr', 'situation.relation.negatif', 'Les relations peuvent être compliquées parfois.');
  this.nlp.addAnswer('fr', 'situation.relation.negatif', 'Prenez le temps de réfléchir à ce qui est important pour vous.');
  this.nlp.addAnswer('fr', 'situation.relation.negatif', 'Une communication ouverte pourrait peut-être aider?');
  
  this.nlp.addAnswer('fr', 'situation.sante.positif', 'La santé est notre bien le plus précieux!');
  this.nlp.addAnswer('fr', 'situation.sante.positif', 'Continuez sur cette bonne voie!');
  this.nlp.addAnswer('fr', 'situation.sante.positif', 'Prendre soin de soi est toujours un bon investissement.');
  
  this.nlp.addAnswer('fr', 'situation.sante.negatif', 'Prenez le temps de vous reposer.');
  this.nlp.addAnswer('fr', 'situation.sante.negatif', 'Avez-vous consulté un professionnel de santé?');
  this.nlp.addAnswer('fr', 'situation.sante.negatif', 'La santé fluctue, gardez espoir d\'une amélioration.');
  
  // Combinaison Emotion-Situation responses
  this.nlp.addAnswer('fr', 'emotion.joie.travail', 'Votre bonheur au travail est mérité! Profitez de cette belle réussite professionnelle.');
  this.nlp.addAnswer('fr', 'emotion.joie.travail', 'C\'est formidable de vous voir épanoui dans votre carrière!');
  
  this.nlp.addAnswer('fr', 'emotion.tristesse.travail', 'Les difficultés professionnelles sont temporaires. Gardez confiance en vos compétences.');
  this.nlp.addAnswer('fr', 'emotion.tristesse.travail', 'C\'est normal de se sentir abattu après un revers professionnel. Prenez le temps de vous ressourcer.');
  
  this.nlp.addAnswer('fr', 'emotion.colere.travail', 'La frustration au travail est compréhensible. Peut-être pourriez-vous en discuter avec un responsable?');
  this.nlp.addAnswer('fr', 'emotion.colere.travail', 'Respirez profondément et essayez d\'identifier précisément ce qui vous contrarie au travail.');
  
  this.nlp.addAnswer('fr', 'emotion.joie.relation', 'Les relations épanouissantes sont une source de bonheur inestimable!');
  this.nlp.addAnswer('fr', 'emotion.joie.relation', 'Votre bonheur relationnel est contagieux, c\'est merveilleux!');
  
  this.nlp.addAnswer('fr', 'emotion.tristesse.relation', 'Les peines de cœur sont douloureuses, mais vous n\'êtes pas seul face à cette épreuve.');
  this.nlp.addAnswer('fr', 'emotion.tristesse.relation', 'Accordez-vous le temps de guérir, les blessures relationnelles demandent de la patience.');
  
  this.nlp.addAnswer('fr', 'emotion.colere.relation', 'La colère dans les relations est souvent le signe d\'un besoin non exprimé. Avez-vous pu identifier ce besoin?');
  this.nlp.addAnswer('fr', 'emotion.colere.relation', 'Prenez du recul avant de réagir sous le coup de l\'émotion dans cette situation relationnelle.');
  
  this.nlp.addAnswer('fr', 'emotion.joie.sante', 'Votre bien-être physique est une excellente nouvelle! Continuez à prendre soin de vous!');
  this.nlp.addAnswer('fr', 'emotion.joie.sante', 'Se sentir en bonne santé est un vrai bonheur, profitez-en pleinement!');
  
  this.nlp.addAnswer('fr', 'emotion.tristesse.sante', 'Les défis de santé peuvent être décourageants, mais chaque petit progrès compte.');
  this.nlp.addAnswer('fr', 'emotion.tristesse.sante', 'C\'est normal de se sentir triste face à des problèmes de santé. Soyez bienveillant envers vous-même.');
  
  this.nlp.addAnswer('fr', 'emotion.colere.sante', 'La frustration face aux problèmes de santé est légitime. Avez-vous cherché un second avis médical?');
  this.nlp.addAnswer('fr', 'emotion.colere.sante', 'Transformez cette colère en motivation pour prendre soin de vous différemment.');
  

      await this.nlp.train();
      this.isTrained = true;
      console.log('NLP model trained successfully');
    } catch (error) {
      console.error('Error initializing NLP:', error);
      throw error;
    }
  }

  public async processText(text: string): Promise<void> {
    if (!this.isTrained) {
      throw new Error('Le modèle NLP n\'est pas encore entraîné');
    }

    this.processingSubject.next(true);
    try {
      const response = await this.nlp.process('fr', text);
      this.responseSubject.next(response.sentiment?.vote || 'Je ne comprends pas votre demande.');
    } catch (error) {
      console.error('Erreur lors du traitement du texte:', error);
      this.responseSubject.next('Désolé, une erreur est survenue.');
    } finally {
      this.processingSubject.next(false);
    }
  }

  public getResponse(): Observable<string> {
    return this.responseSubject.asObservable();
  }

  public isProcessing(): Observable<boolean> {
    return this.processingSubject.asObservable();
  }

  public async addIntent(intent: string, examples: string[], answers: string[]): Promise<void> {
    if (!this.isTrained) {
      throw new Error('Le modèle NLP n\'est pas encore entraîné');
    }

    // Ajout des exemples
    examples.forEach(example => {
      this.nlp.addDocument('fr', example, intent);
    });

    // Ajout des réponses
    answers.forEach(answer => {
      this.nlp.addAnswer('fr', intent, answer);
    });

    // Réentraînement du modèle
    await this.nlp.train();
  }

  public async getIntent(text: string): Promise<string> {
    if (!this.isTrained) {
      throw new Error('Le modèle NLP n\'est pas encore entraîné');
    }

    const response = await this.nlp.process('fr', text);
    return response.intent || 'unknown';
  }

  public async getSentiment(text: string): Promise<number> {
    if (!this.isTrained) {
      throw new Error('Le modèle NLP n\'est pas encore entraîné');
    }

    const response = await this.nlp.process('fr', text);
    return response.sentiment?.score || 0;
  }
}