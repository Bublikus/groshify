/**
 * Language formatting utilities
 */
import { LANGUAGES } from "@/constants/app";

export interface LanguageFormatOptions {
  /**
   * Whether to show the flag emoji (default: true)
   */
  showFlag?: boolean;
  /**
   * Whether to show the language name (default: true)
   */
  showName?: boolean;
  /**
   * Whether to show the language code (default: false)
   */
  showCode?: boolean;
  /**
   * Separator between elements (default: ' ')
   */
  separator?: string;
}

/**
 * Format language for display
 *
 * @param languageCode - Language code (e.g., 'en', 'uk')
 * @param options - Formatting options
 * @returns Formatted language string
 *
 * @example
 * formatLanguage('en') // "🇺🇸 English"
 * formatLanguage('uk') // "🇺🇦 Українська"
 * formatLanguage('en', { showFlag: false }) // "English"
 * formatLanguage('en', { showCode: true }) // "🇺🇸 English (en)"
 */
export function formatLanguage(
  languageCode: keyof typeof LANGUAGES,
  options: LanguageFormatOptions = {}
): string {
  const { showFlag = true, showName = true, showCode = false, separator = " " } = options;

  const language = LANGUAGES[languageCode];
  if (!language) {
    return languageCode;
  }

  const parts: string[] = [];

  if (showFlag) {
    parts.push(language.flag);
  }

  if (showName) {
    parts.push(language.name);
  }

  if (showCode) {
    parts.push(`(${languageCode})`);
  }

  return parts.join(separator);
}

/**
 * Get language name by language code
 *
 * @param languageCode - Language code
 * @returns Language name or empty string if not found
 *
 * @example
 * getLanguageName('en') // "English"
 * getLanguageName('uk') // "Українська"
 */
export function getLanguageName(languageCode: keyof typeof LANGUAGES): string {
  const language = LANGUAGES[languageCode];
  return language ? language.name : "";
}

/**
 * Get language flag by language code
 *
 * @param languageCode - Language code
 * @returns Language flag emoji or empty string if not found
 *
 * @example
 * getLanguageFlag('en') // "🇺🇸"
 * getLanguageFlag('uk') // "🇺🇦"
 */
export function getLanguageFlag(languageCode: keyof typeof LANGUAGES): string {
  const language = LANGUAGES[languageCode];
  return language ? language.flag : "";
}

/**
 * Get all available language codes
 *
 * @returns Array of language codes
 *
 * @example
 * getAvailableLanguages() // ["en", "uk"]
 */
export function getAvailableLanguages(): (keyof typeof LANGUAGES)[] {
  return Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[];
}

/**
 * Get all available languages with their details
 *
 * @returns Array of language objects
 *
 * @example
 * getAvailableLanguagesWithDetails() // [{ code: "en", name: "English", flag: "🇺🇸" }, ...]
 */
export function getAvailableLanguagesWithDetails(): Array<{
  code: keyof typeof LANGUAGES;
  name: string;
  flag: string;
}> {
  return Object.entries(LANGUAGES).map(([code, language]) => ({
    code: code as keyof typeof LANGUAGES,
    name: language.name,
    flag: language.flag,
  }));
}

/**
 * Check if language code is supported
 *
 * @param languageCode - Language code to check
 * @returns Whether the language is supported
 *
 * @example
 * isLanguageSupported('en') // true
 * isLanguageSupported('fr') // false
 */
export function isLanguageSupported(languageCode: string): languageCode is keyof typeof LANGUAGES {
  return languageCode in LANGUAGES;
}

/**
 * Get default language code
 *
 * @returns Default language code
 *
 * @example
 * getDefaultLanguage() // "en"
 */
export function getDefaultLanguage(): keyof typeof LANGUAGES {
  return "en";
}

/**
 * Get language code from browser locale
 *
 * @param locale - Browser locale string (e.g., 'en-US', 'uk-UA')
 * @returns Supported language code or default
 *
 * @example
 * getLanguageFromLocale('en-US') // "en"
 * getLanguageFromLocale('uk-UA') // "uk"
 * getLanguageFromLocale('fr-FR') // "en" (default)
 */
export function getLanguageFromLocale(locale: string): keyof typeof LANGUAGES {
  if (!locale || typeof locale !== "string") {
    return getDefaultLanguage();
  }

  const languageCode = locale.split("-")[0].toLowerCase();

  if (isLanguageSupported(languageCode)) {
    return languageCode as keyof typeof LANGUAGES;
  }

  return getDefaultLanguage();
}

/**
 * Format locale for display
 *
 * @param locale - Locale string (e.g., 'en-US', 'uk-UA')
 * @param options - Formatting options
 * @returns Formatted locale string
 *
 * @example
 * formatLocale('en-US') // "🇺🇸 English (US)"
 * formatLocale('uk-UA') // "🇺🇦 Українська (UA)"
 */
export function formatLocale(locale: string, options: LanguageFormatOptions = {}): string {
  if (!locale || typeof locale !== "string") {
    return "";
  }

  const [, countryCode] = locale.split("-");
  const language = getLanguageFromLocale(locale);

  const parts: string[] = [];
  const { showFlag = true, showName = true, showCode = false, separator = " " } = options;

  if (showFlag) {
    parts.push(getLanguageFlag(language));
  }

  if (showName) {
    parts.push(getLanguageName(language));
  }

  if (showCode && countryCode) {
    parts.push(`(${countryCode})`);
  }

  return parts.join(separator);
}

/**
 * Get browser language preferences
 *
 * @returns Array of preferred language codes
 *
 * @example
 * getBrowserLanguages() // ["en", "uk"] (if browser supports these languages)
 */
export function getBrowserLanguages(): (keyof typeof LANGUAGES)[] {
  if (typeof navigator === "undefined") {
    return [getDefaultLanguage()];
  }

  const languages = navigator.languages || [navigator.language];
  const supportedLanguages: (keyof typeof LANGUAGES)[] = [];

  for (const locale of languages) {
    const languageCode = getLanguageFromLocale(locale);
    if (!supportedLanguages.includes(languageCode)) {
      supportedLanguages.push(languageCode);
    }
  }

  return supportedLanguages.length > 0 ? supportedLanguages : [getDefaultLanguage()];
}

/**
 * Get preferred language from browser
 *
 * @returns Preferred language code
 *
 * @example
 * getPreferredLanguage() // "en" or "uk" based on browser settings
 */
export function getPreferredLanguage(): keyof typeof LANGUAGES {
  const browserLanguages = getBrowserLanguages();
  return browserLanguages[0] || getDefaultLanguage();
}

/**
 * Format language list for display
 *
 * @param languages - Array of language codes
 * @param options - Formatting options
 * @returns Formatted language list string
 *
 * @example
 * formatLanguageList(['en', 'uk']) // "🇺🇸 English, 🇺🇦 Українська"
 * formatLanguageList(['en', 'uk'], { showCode: true }) // "🇺🇸 English (en), 🇺🇦 Українська (uk)"
 */
export function formatLanguageList(
  languages: (keyof typeof LANGUAGES)[],
  options: LanguageFormatOptions = {}
): string {
  if (!languages || !Array.isArray(languages)) {
    return "";
  }

  return languages
    .map((lang) => formatLanguage(lang, options))
    .filter(Boolean)
    .join(", ");
}

/**
 * Get language direction (LTR or RTL)
 *
 * @param languageCode - Language code
 * @returns Language direction
 *
 * @example
 * getLanguageDirection('en') // "ltr"
 * getLanguageDirection('ar') // "rtl" (if Arabic were supported)
 */
export function getLanguageDirection(_languageCode: keyof typeof LANGUAGES): "ltr" | "rtl" {
  // Currently all supported languages are LTR
  // This function can be extended when RTL languages are added
  const rtlLanguages: (keyof typeof LANGUAGES)[] = [];

  return rtlLanguages.includes(_languageCode) ? "rtl" : "ltr";
}
