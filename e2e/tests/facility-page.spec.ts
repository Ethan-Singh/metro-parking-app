import { test, expect } from '@playwright/test';

test.describe('Facility Page (data-driven)', () => {
  const slug = 'park-ride-ashfield';

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/parking/**/overview', async (route) => {
      await route.fulfill({
        json: {
          slug,
          facilityName: 'Park&Ride - Ashfield',
          spots: 228,
          available: 217,
          occupancyRate: 0.04824561403508772,
          availability: 'AVAILABLE',
          timestamp: '2026-07-02T22:33:32',
        },
      });
    });
  });

  test('renders facility overview from API data', async ({ page }) => {
    await page.goto(`/facility/${slug}`);

    await expect(
      page.getByRole('heading', { name: /Ashfield/i })
    ).toBeVisible();

    await expect(page.getByTestId('metric-occupancy')).toContainText('5%');
    await expect(page.getByTestId('metric-available-value')).toHaveText('217');
    await expect(page.getByTestId('metric-total-value')).toHaveText('228');

    await expect(page.locator('canvas')).toBeVisible();
  });

  test('renders chart', async ({ page }) => {
    await page.goto(`/facility/${slug}`);
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('back button works', async ({ page }) => {
    await page.goto(`/facility/${slug}`);
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL('/');
  });
});
