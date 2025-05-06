import { test, expect } from '@playwright/test';

// Example page object
class HomePage {
  constructor(private page: any) {}

  async navigate() {
    await this.page.goto('/');
  }

  async getTitle() {
    return this.page.title();
  }

  async getHeading() {
    return this.page.locator('h1').textContent();
  }
}

test.describe('Basic navigation', () => {
  test('has title', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    
    // Check page title
    await expect(page).toHaveTitle(/AI Support Bot/);
  });

  test('navigation works', async ({ page }) => {
    // Go to the home page
    await page.goto('/');
    
    // Find and click a navigation link
    await page.getByRole('link', { name: /dashboard/i }).click();
    
    // Verify navigation occurred
    await expect(page).toHaveURL(/dashboard/);
  });

  test('visual comparison test', async ({ page }) => {
    await page.goto('/');
    
    // Take a screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png');
  });
}); 