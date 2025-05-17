import natural from 'natural';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize natural's sentiment analyzer
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

// Load AFINN lexicon for sentiment analysis
const afinn = {};
const afinnFile = path.join(__dirname, '../data/AFINN.json');

// If AFINN file doesn't exist, create basic version
if (!fs.existsSync(afinnFile)) {
  const baseAfinn = {
    "joy": 5, "happy": 3, "happiness": 3, "love": 3, "excited": 3, "amazing": 4,
    "sad": -3, "unhappy": -3, "depressed": -4, "miserable": -4, "disappointed": -2,
    "angry": -3, "furious": -4, "mad": -3, "upset": -2, "frustrated": -2,
    "afraid": -2, "scared": -3, "terrified": -4, "anxious": -2, "nervous": -2,
    "surprised": 2, "shocked": 0, "astonished": 2, "amazed": 3,
    "disgusted": -3, "revolted": -4, "gross": -2, "repulsed": -3,
    "content": 2, "satisfied": 2, "peaceful": 2, "calm": 1,
    "confused": -1, "uncertain": -1, "doubtful": -1,
    "exhausted": -2, "tired": -1, "weary": -2,
    "proud": 3, "accomplished": 3, "confident": 2,
    "grateful": 3, "thankful": 3, "appreciative": 3,
    "lonely": -3, "alone": -2, "isolated": -3,
    "hopeful": 2, "optimistic": 3, "encouraged": 2,
    "guilty": -3, "ashamed": -3, "regretful": -3
  };
  // Ensure the directory exists
  if (!fs.existsSync(path.dirname(afinnFile))) {
    fs.mkdirSync(path.dirname(afinnFile), { recursive: true });
  }
  fs.writeFileSync(afinnFile, JSON.stringify(baseAfinn, null, 2));
  Object.assign(afinn, baseAfinn);
} else {
  Object.assign(afinn, JSON.parse(fs.readFileSync(afinnFile, 'utf8')));
}

// Emotion keywords for classification
const emotionKeywords = {
  joy: ['happy', 'joy', 'content', 'pleased', 'delighted', 'glad', 'satisfied', 'loving', 'excited', 'elated', 'euphoric', 'thrilled', 'overjoyed', 'ecstatic', 'cheerful', 'grinning', 'smiling', 'laughing', 'playful', 'celebratory'],
  sadness: ['sad', 'unhappy', 'sorrowful', 'depressed', 'melancholy', 'downhearted', 'blue', 'gloomy', 'miserable', 'heartbroken', 'disappointed', 'dejected', 'disheartened', 'regretful', 'distressed', 'grief', 'mourning', 'crying', 'tearful', 'hurt'],
  anger: ['angry', 'mad', 'furious', 'enraged', 'irritated', 'annoyed', 'frustrated', 'indignant', 'exasperated', 'irate', 'outraged', 'hostile', 'bitter', 'resentful', 'displeased', 'infuriated', 'livid', 'seething', 'rage', 'hateful'],
  fear: ['afraid', 'fearful', 'scared', 'frightened', 'terrified', 'anxious', 'worried', 'nervous', 'paranoid', 'panicking', 'desperate', 'horror', 'dread', 'terror', 'timid', 'insecure', 'threatened', 'alarmed', 'trembling', 'startled'],
  surprise: ['surprised', 'shocked', 'astonished', 'amazed', 'stunned', 'dumbfounded', 'bewildered', 'awestruck', 'flabbergasted', 'dazed', 'startled', 'astounded', 'confounded', 'taken aback', 'thunderstruck', 'speechless', 'unexpected', 'sudden', 'jarring', 'overwhelmed'],
  disgust: ['disgusted', 'revolted', 'repulsed', 'nauseated', 'appalled', 'horrified', 'offended', 'sickened', 'displeased', 'disdainful', 'repelled', 'averse', 'loathing', 'contemptuous', 'distaste', 'abhorrent', 'detestable', 'outraged', 'disapproving', 'repugnant']
};

// Theme mappings for different moods
const moodThemes = {
  joy: {
    colors: ['#FFD700', '#FFA500', '#FFB74D', '#FFECB3', '#FFC107'],
    background: 'bright',
    fontStyle: 'playful',
    name: 'Sunshine'
  },
  sadness: {
    colors: ['#607D8B', '#90A4AE', '#B0BEC5', '#CFD8DC', '#78909C'],
    background: 'rainy',
    fontStyle: 'thoughtful',
    name: 'Rainy Day'
  },
  anger: {
    colors: ['#E53935', '#EF5350', '#E57373', '#FFCDD2', '#F44336'],
    background: 'intense',
    fontStyle: 'bold',
    name: 'Ember'
  },
  fear: {
    colors: ['#424242', '#616161', '#757575', '#9E9E9E', '#212121'],
    background: 'mysterious',
    fontStyle: 'tense',
    name: 'Shadows'
  },
  surprise: {
    colors: ['#BA68C8', '#CE93D8', '#E1BEE7', '#F3E5F5', '#9C27B0'],
    background: 'electric',
    fontStyle: 'dynamic',
    name: 'Wonderstruck'
  },
  disgust: {
    colors: ['#388E3C', '#4CAF50', '#81C784', '#C8E6C9', '#2E7D32'],
    background: 'organic',
    fontStyle: 'strong',
    name: 'Forest'
  },
  neutral: {
    colors: ['#3F51B5', '#5C6BC0', '#7986CB', '#C5CAE9', '#303F9F'],
    background: 'clean',
    fontStyle: 'balanced',
    name: 'Tranquil'
  }
};

/**
 * Detects the mood from text content
 * @param {string} text - The text to analyze
 * @return {string} - The detected mood (joy, sadness, anger, fear, surprise, disgust, or neutral)
 */
export const detectMood = (text) => {
  // Simple sentiment analysis
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Get overall sentiment score
  const sentimentScore = analyzer.getSentiment(tokens);
  
  // Check for emotion keywords
  const emotionScores = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0
  };

  // Count emotion keywords
  tokens.forEach(token => {
    Object.keys(emotionKeywords).forEach(emotion => {
      if (emotionKeywords[emotion].includes(token)) {
        emotionScores[emotion]++;
      }
    });
  });

  // Get the highest scoring emotion
  let highestEmotion = 'neutral';
  let highestScore = 0;

  Object.keys(emotionScores).forEach(emotion => {
    if (emotionScores[emotion] > highestScore) {
      highestScore = emotionScores[emotion];
      highestEmotion = emotion;
    }
  });

  // If no strong emotion detected, use sentiment score
  if (highestScore === 0) {
    if (sentimentScore > 0.2) {
      return 'joy';
    } else if (sentimentScore < -0.2) {
      return 'sadness';
    } else {
      return 'neutral';
    }
  }

  return highestEmotion;
};

/**
 * Gets a visual theme based on the detected mood
 * @param {string} mood - The detected mood
 * @return {object} - Theme object with colors, background style, and font style
 */
export const getThemeForMood = (mood) => {
  return moodThemes[mood] || moodThemes.neutral;
};