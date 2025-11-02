import { locales, type Locale } from '@/i18n';
import fs from 'fs';
import path from 'path';

/**
 * Get all keys from a nested object recursively.
 * Returns an array of dot-notation paths (e.g., ['hero.brand.headline.leading'])
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      // Recursively get keys from nested objects
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      // This is a leaf node (actual translation value)
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Validation error with component, locale, and missing keys information.
 */
export interface TranslationValidationError {
  component: string;
  locale: Locale;
  missingKeys: string[];
  extraKeys?: string[];
}

/**
 * Validation result containing all errors found.
 */
export interface TranslationValidationResult {
  isValid: boolean;
  errors: TranslationValidationError[];
  warnings: string[];
}

/**
 * Validate that all translation files for a component have the same keys.
 * 
 * @param componentPath - Path to the component (e.g., "Header", "Dashboard")
 * @returns Validation result with any missing or extra keys
 */
export function validateComponentTranslations(
  componentPath: string
): TranslationValidationResult {
  const errors: TranslationValidationError[] = [];
  const warnings: string[] = [];
  
  // Load all translation files for this component
  const translationsByLocale: Record<Locale, any> = {} as Record<Locale, any>;
  
  for (const locale of locales) {
    const filePath = path.join(
      process.cwd(),
      'components',
      componentPath,
      'translations',
      `${locale}.json`
    );
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        translationsByLocale[locale] = JSON.parse(content);
      } else {
        errors.push({
          component: componentPath,
          locale,
          missingKeys: ['*'], // Missing entire file
        });
        continue;
      }
    } catch (error) {
      warnings.push(
        `Failed to load ${componentPath}/translations/${locale}.json: ${error}`
      );
      continue;
    }
  }
  
  // Use English as the reference (since it's the default locale)
  const referenceLocale: Locale = 'en';
  const referenceKeys = new Set(
    getAllKeys(translationsByLocale[referenceLocale] || {})
  );
  
  // Check each locale against the reference
  for (const locale of locales) {
    if (locale === referenceLocale) continue;
    if (!translationsByLocale[locale]) continue;
    
    const localeKeys = new Set(getAllKeys(translationsByLocale[locale]));
    const missingKeys = Array.from(referenceKeys).filter(
      (key) => !localeKeys.has(key)
    );
    const extraKeys = Array.from(localeKeys).filter(
      (key) => !referenceKeys.has(key)
    );
    
    if (missingKeys.length > 0 || extraKeys.length > 0) {
      errors.push({
        component: componentPath,
        locale,
        missingKeys,
        extraKeys: extraKeys.length > 0 ? extraKeys : undefined,
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate all component translations in the project.
 * Checks all components that have a translations folder.
 * 
 * @returns Combined validation result for all components
 */
export function validateAllTranslations(): TranslationValidationResult {
  const componentsPath = path.join(process.cwd(), 'components');
  const errors: TranslationValidationError[] = [];
  const warnings: string[] = [];
  
  // Get all component directories
  const componentDirs = fs.readdirSync(componentsPath, { withFileTypes: true });
  
  for (const dirent of componentDirs) {
    if (!dirent.isDirectory()) continue;
    
    const componentPath = path.join(componentsPath, dirent.name);
    const translationsPath = path.join(componentPath, 'translations');
    
    // Check if this component has translations
    if (!fs.existsSync(translationsPath)) continue;
    
    const result = validateComponentTranslations(dirent.name);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Format validation errors as a human-readable string.
 */
export function formatValidationErrors(result: TranslationValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return '✅ All translations are valid!';
  }
  
  const lines: string[] = [];
  
  if (result.errors.length > 0) {
    lines.push('❌ Translation validation errors:\n');
    
    for (const error of result.errors) {
      lines.push(`  Component: ${error.component}`);
      lines.push(`  Locale: ${error.locale}`);
      
      if (error.missingKeys.includes('*')) {
        lines.push(`  ⚠️  Missing entire translation file`);
      } else if (error.missingKeys.length > 0) {
        lines.push(`  ❌ Missing keys (${error.missingKeys.length}):`);
        error.missingKeys.forEach((key) => {
          lines.push(`     - ${key}`);
        });
      }
      
      if (error.extraKeys && error.extraKeys.length > 0) {
        lines.push(`  ⚠️  Extra keys (not in ${result.errors[0]?.component || 'reference'}):`);
        error.extraKeys.forEach((key) => {
          lines.push(`     - ${key}`);
        });
      }
      
      lines.push('');
    }
  }
  
  if (result.warnings.length > 0) {
    lines.push('\n⚠️  Warnings:');
    result.warnings.forEach((warning) => {
      lines.push(`  - ${warning}`);
    });
  }
  
  return lines.join('\n');
}

