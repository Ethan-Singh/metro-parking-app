import { test, expect } from '@playwright/test';

function historyForDate(date: string) {
  const at = (time: string) => Date.parse(`${date}T${time}:00+11:00`);
  return [
    [at('07:00'), 0.2, 179],
    [at('08:00'), 0.3, 136],
    [at('09:50'), 0.5, 114],
    [at('12:30'), 0.9, 23],
    [at('15:10'), 1, 0],
  ];
}

test.describe('Overview Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/parking', async (route) => {
      await route.fulfill({
        json: [
          {
            slug: 'park-ride-ashfield',
            facilityName: 'Park&Ride - Ashfield',
            spots: 228,
            occupancy: 11,
            available: 217,
            occupancyRate: 0.048,
            availability: 'AVAILABLE',
            timeMs: 1783031612000,
            ariaLabel: 'Ashfield, 217 of 228 spots available',
          },
          {
            slug: 'central-station',
            facilityName: 'Central Station',
            spots: 100,
            occupancy: 60,
            available: 40,
            occupancyRate: 0.6,
            availability: 'ALMOST_FULL',
            timeMs: 1783031912000,
            ariaLabel: 'Central Station, 40 of 100 spots available',
          },
        ],
      });
    });
    await page.route('**/api/v1/parking/**/history?**', async (route) => {
      const query = new URL(route.request().url()).searchParams;
      expect(query.get('resolution')).toBe('TEN_MINUTE');
      const date = query.get('from')!;
      expect(query.get('to')).toBe(date);
      await route.fulfill({
        json: { from: date, to: date, resolution: 'TEN_MINUTE', points: historyForDate(date) },
      });
    });
  });

  test('renders overview page and facility cards', async ({ page }) => {
    await page.goto('/');

    // Page title
    await expect(
      page.getByRole('heading', { name: /overview/i })
    ).toBeVisible();

    // The result count is shown as a readable facility label.
    await expect(page.getByText('2 parking facilities')).toBeVisible();

    // cards should render
    const cards = page.locator('[data-testid="facility-card"]');
    await expect(cards.first()).toBeVisible();

    // sanity check: at least 2 facilities rendered
    await expect(cards).toHaveCount(2);

    // The dedicated Quick view button expands data without navigating.
    const ashfieldCard = cards.filter({ hasText: 'Park&Ride - Ashfield' });
    await ashfieldCard.getByRole('button', { name: /quick view/i }).click();
    await expect(ashfieldCard.getByText('Daily commuter metrics')).toBeVisible();
    await expect(ashfieldCard.getByText('7 AM free')).toBeVisible();
    await expect(ashfieldCard.getByText('Full by')).toBeVisible();
    await expect(ashfieldCard.locator('canvas')).toHaveCount(1);
    await expect(page).toHaveURL('/');

    // Clicking the rest of the card still opens the facility page.
    await ashfieldCard.getByRole('link', { name: /Ashfield, 217 of 228 spots available/i }).click();
    await expect(page).toHaveURL(/\/facility\//);
  });
});
