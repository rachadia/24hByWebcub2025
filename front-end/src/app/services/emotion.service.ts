import { Injectable } from '@angular/core';

export type Emotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'intensity' | 'positif' | 'negative';

@Injectable({
  providedIn: 'root'
})
export class EmotionService {
  private joyKeywords = [
    'happy', 'joy', 'excited', 'thrilled', 'ecstatic', 'delighted', 'pleased',
    'glad', 'content', 'satisfied', 'cheerful', 'jubilant', 'wonderful', 'amazing',
    'love', 'celebrate', 'success', 'achievement', 'proud', 'perfect', 'won', 'win'
  ];

  private sadnessKeywords = [
    'sad', 'unhappy', 'depressed', 'down', 'miserable', 'heartbroken', 'grief',
    'lost', 'disappointed', 'sorry', 'regret', 'miss', 'lonely', 'alone',
    'tears', 'crying', 'upset', 'hurt', 'pain', 'sorrow', 'gloomy', 'hopeless'
  ];

  private angerKeywords = [
    'angry', 'mad', 'furious', 'outraged', 'annoyed', 'irritated', 'frustrated',
    'hate', 'rage', 'disgusted', 'fed up', 'offended', 'enraged', 'hostile',
    'bitter', 'resentful', 'upset', 'dislike', 'pissed', 'infuriated', 'irate'
  ];

  private fearKeywords = [
    'afraid', 'scared', 'frightened', 'terrified', 'fearful', 'anxious', 'nervous',
    'worried', 'concerned', 'stress', 'stressed', 'panic', 'dread', 'horror',
    'alarmed', 'apprehensive', 'unsure', 'uncertain', 'helpless', 'threatened'
  ];

  private intensityKeywords = [
    'intense', 'powerful', 'strong', 'vibrant', 'alive', 'energetic', 'dynamic',
    'passionate', 'driven', 'determined', 'focused', 'motivated', 'inspired',
    'engaged', 'stimulated', 'absorbed', 'immersed', 'involved', 'committed'
  ];

  constructor() { }

  // Simple emotion detection based on keyword matching
  // In a real application, you would use a more sophisticated sentiment analysis API
  detectEmotion(text: string): Emotion {
    // Simple keyword-based emotion detection
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited') || lowerText.includes('positif')) {
      return 'joy';
    } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('unhappy') || lowerText.includes('negative')) {
      return 'sadness';
    } else if (lowerText.includes('angry') || lowerText.includes('furious') || lowerText.includes('mad') || lowerText.includes('colere') || lowerText.includes('colère') || lowerText.includes('negatif')) {
      return 'anger';
    } else if (lowerText.includes('scared') || lowerText.includes('afraid') || lowerText.includes('fearful')) {
      return 'fear';
    } else if (lowerText.includes('intense') || lowerText.includes('powerful') || lowerText.includes('energetic')) {
      return 'intensity';
    }
    
    // Default to joy if no emotion is detected
    return 'joy';
  }

  getEmotionColor(emotion: Emotion): string {
    switch (emotion) {
      case 'joy':
        return 'joy-500';
      case 'sadness':
        return 'sadness-500';
      case 'anger':
        return 'anger-500';
      case 'fear':
        return 'fear-500';
      case 'intensity':
        return 'intensity-500';
      default:
        return 'primary-500';
    }
  }

  getEmotionDisplayName(emotion: Emotion): string {
    switch (emotion) {
      case 'joy':
        return 'Joy';
      case 'sadness':
        return 'Sadness';
      case 'anger':
        return 'Anger';
      case 'fear':
        return 'Fear';
      case 'intensity':
        return 'Intensité';
      default:
        return 'Unknown';
    }
  }

  getEmotionIcon(emotion: Emotion): string {
    switch (emotion) {
      case 'joy':
        return '😊';
      case 'sadness':
        return '😢';
      case 'anger':
        return '😡';
      case 'fear':
        return '😨';
      case 'intensity':
        return '⚡';
      default:
        return '😐';
    }
  }
}