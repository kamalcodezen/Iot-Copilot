export interface LanguageInfo {
  script: string;
  language: string;
}

interface ScriptEntry {
  script: string;
  language: string;
  regex: RegExp;
}

const SCRIPT_ENTRIES: ScriptEntry[] = [
  { script: 'Bengali', language: 'Bengali', regex: /[\u0980-\u09FF]/ },
  { script: 'Devanagari', language: 'Hindi', regex: /[\u0900-\u097F]/ },
  { script: 'Gurmukhi', language: 'Punjabi', regex: /[\u0A00-\u0A7F]/ },
  { script: 'Gujarati', language: 'Gujarati', regex: /[\u0A80-\u0AFF]/ },
  { script: 'Oriya', language: 'Odia', regex: /[\u0B00-\u0B7F]/ },
  { script: 'Tamil', language: 'Tamil', regex: /[\u0B80-\u0BFF]/ },
  { script: 'Telugu', language: 'Telugu', regex: /[\u0C00-\u0C7F]/ },
  { script: 'Kannada', language: 'Kannada', regex: /[\u0C80-\u0CFF]/ },
  { script: 'Malayalam', language: 'Malayalam', regex: /[\u0D00-\u0D7F]/ },
  { script: 'Sinhala', language: 'Sinhala', regex: /[\u0D80-\u0DFF]/ },
  { script: 'Arabic', language: 'Arabic', regex: /[\u0600-\u06FF]/ },
  { script: 'Hebrew', language: 'Hebrew', regex: /[\u0590-\u05FF]/ },
  { script: 'Thai', language: 'Thai', regex: /[\u0E00-\u0E7F]/ },
  { script: 'Lao', language: 'Lao', regex: /[\u0E80-\u0EFF]/ },
  { script: 'Myanmar', language: 'Burmese', regex: /[\u1000-\u109F]/ },
  { script: 'Khmer', language: 'Khmer', regex: /[\u1780-\u17FF]/ },
  { script: 'Cyrillic', language: 'Russian', regex: /[\u0400-\u04FF]/ },
  { script: 'Greek', language: 'Greek', regex: /[\u0370-\u03FF]/ },
  { script: 'Armenian', language: 'Armenian', regex: /[\u0530-\u058F]/ },
  { script: 'Georgian', language: 'Georgian', regex: /[\u10A0-\u10FF]/ },
  { script: 'Hangul', language: 'Korean', regex: /[\uAC00-\uD7AF]/ },
  { script: 'Hiragana', language: 'Japanese', regex: /[\u3040-\u309F]/ },
  { script: 'Katakana', language: 'Japanese', regex: /[\u30A0-\u30FF]/ },
  { script: 'CJK', language: 'Chinese', regex: /[\u4E00-\u9FFF]/ },
  { script: 'Latin', language: 'English', regex: /[A-Za-z]/ },
];

const JAPANESE_PRIORITY = /[\u3040-\u30FF]/;

/**
 * Auto-detects the language family of a message from its Unicode script.
 * Returns the best-guess language and script. For Latin-script languages
 * (English/French/Spanish/...) and shared-script languages (Hindi/Marathi,
 * Arabic/Urdu), the AI model performs the precise refinement.
 */
export const detectLanguage = (message: string): LanguageInfo => {
  const text = message || '';
  if (!text.trim()) return { script: 'Latin', language: 'English' };

  if (JAPANESE_PRIORITY.test(text)) return { script: 'Hiragana/Katakana', language: 'Japanese' };

  let best: { script: string; language: string; count: number } = {
    script: 'Latin',
    language: 'English',
    count: 0,
  };

  for (const entry of SCRIPT_ENTRIES) {
    const count = (text.match(entry.regex) || []).length;
    if (count > best.count) {
      best = { script: entry.script, language: entry.language, count };
    }
  }

  return { script: best.script, language: best.language };
};
