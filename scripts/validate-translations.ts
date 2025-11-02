#!/usr/bin/env tsx

/**
 * Standalone script to validate all translations.
 * Run with: pnpm tsx scripts/validate-translations.ts
 */

import {
  validateAllTranslations,
  formatValidationErrors,
} from '../lib/i18n/validate-translations';

const result = validateAllTranslations();

console.log(formatValidationErrors(result));

// Exit with error code if validation failed
process.exit(result.isValid ? 0 : 1);

