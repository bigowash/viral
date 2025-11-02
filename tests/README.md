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

