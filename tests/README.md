# Tests

This directory contains all test files for the project.

## Structure

- **`setup.ts`** - Global test setup (e.g., testing library configuration)
- **Unit tests** - Place test files (`.test.ts` or `.spec.ts`) next to the code they test, or in a mirror structure under `tests/unit/`
- **`e2e/`** - End-to-end tests using Playwright

## Running Tests

- `pnpm test` - Run all tests (unit + e2e)
- `pnpm test:unit` - Run unit tests once
- `pnpm test:unit:watch` - Run unit tests in watch mode
- `pnpm test:e2e` - Run e2e tests
- `pnpm test:e2e:ui` - Run e2e tests with Playwright UI
- `pnpm validate:translations` - Validate that all translation files have matching keys across all locales

## Writing Tests

### Unit Tests (Vitest)

Example test file structure:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

Example test file structure:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Viral/);
});
```

### Translation Validation Tests

The project includes automated validation to ensure all translation files have matching keys across all locales (en, fr, sl). This catches missing translations before they cause UI issues.

The validation tests are in `tests/i18n/validate-translations.test.ts` and can be run with:
```bash
pnpm validate:translations
```

This will:
- Check all component translation files (Header, LandingPage, Dashboard, etc.)
- Compare keys across all locales
- Report any missing keys or extra keys
- Fail the test suite if any discrepancies are found

**Example error output:**
```
❌ Translation validation errors:

  Component: Header
  Locale: fr
  ❌ Missing keys (2):
     - signIn
     - signUp
```

To add a new translation:
1. Add the key to the English (`en.json`) file first (this is the reference)
2. Add the same key to all other locale files (fr.json, sl.json)
3. Run `pnpm validate:translations` to verify

