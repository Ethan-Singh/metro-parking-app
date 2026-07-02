import { test, expect } from '@playwright/test';

test.describe('Overview Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/parking', async (route) => {
      await route.fulfill({
        json: [
          {
            slug: 'park-ride-ashfield',
            facilityName: 'Park&Ride - Ashfield',
            spots: 228,
            available: 217,
            occupancyRate: 0.048,
          },
          {
            slug: 'central-station',
            facilityName: 'Central Station',
            spots: 100,
            available: 40,
            occupancyRate: 0.6,
          },
        ],
      });
    });
  });

  test('renders overview page and facility cards', async ({ page }) => {
    await page.goto('/');

    // Page title
    await expect(
      page.getByRole('heading', { name: /overview/i })
    ).toBeVisible();

    // results count text (robust partial match)
    await expect(page.getByText(/parkings/i)).toBeVisible();

    // cards should render
    const cards = page.locator('[data-testid="facility-card"]');
    await expect(cards.first()).toBeVisible();

    // sanity check: at least 2 facilities rendered
    await expect(cards).toHaveCount(2);

    // ensure navigation works from a card
    await cards.first().click();
    await expect(page).toHaveURL(/\/facility\//);
  });
});
