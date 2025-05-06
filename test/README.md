# Testing Environment

This project uses the following testing tools:

## Unit Testing
- **Vitest** - Fast unit test runner with React Testing Library
- Located in `__tests__` directories near the code being tested
- Run with `npm test` or `npm run test:watch` for development

### Key Features
- JSDOM for DOM simulation
- React Testing Library for component testing
- Code coverage reporting

## E2E Testing
- **Playwright** - Browser automation for end-to-end testing
- Located in the `e2e` directory
- Run with `npm run test:e2e` or `npm run test:e2e:ui` for visual debugging

### Key Features
- Page Object Model for maintainable tests
- Visual comparison testing
- Trace viewer for debugging test failures

## API Testing
- **Supertest** - HTTP assertions for API testing
- Located in `src/api/__tests__`
- Run as part of unit tests

## Writing Tests

### Component Tests
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });
});
```

### API Tests
```ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('API', () => {
  it('returns expected data', async () => {
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests
```ts
import { test, expect } from '@playwright/test';

test('basic navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Example/);
});
```

## Continuous Integration

Tests run automatically in CI on pull requests and merges to main branch. 