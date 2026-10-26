import { test, expect } from '@playwright/test';

const slug = 'park-ride-ashfield';

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

test.describe('Facility Page (data-driven)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/parking/**/live', async (route) => {
      await route.fulfill({
        json: {
          slug,
          facilityName: 'Park&Ride - Ashfield',
          spots: 228,
          occupancy: 11,
          available: 217,
          occupancyRate: 0.04824561403508772,
          availability: 'AVAILABLE',
          timeMs: 1783031612000,
          ariaLabel: 'Ashfield, 217 of 228 spots available',
        },
      });
    });
    await page.route('**/api/v1/parking/**/history?**', async (route) => {
      const query = new URL(route.request().url()).searchParams;
      expect(query.get('resolution')).toBe('TEN_MINUTE');
      expect(query.get('from')).toBe(query.get('to'));
      const date = query.get('from')!;
      await route.fulfill({ json: {
        from: date,
        to: date,
        resolution: 'TEN_MINUTE',
        points: historyForDate(date),
      } });
    });
  });

  test('renders live facility data and a separate three-day commuter metrics card', async ({ page }) => {
    await page.goto(`/facility/${slug}`);

    await expect(page.getByRole('heading', { name: /Ashfield/i })).toBeVisible();
    await expect(page.getByTestId('metric-occupancy')).toContainText('5%');
    await expect(page.getByTestId('metric-available-value')).toHaveText('217');
    await expect(page.getByTestId('metric-total-value')).toHaveText('228');

    const commuterCard = page.getByTestId('daily-commuter-metrics-card');
    await expect(commuterCard).toBeVisible();
    await expect(commuterCard.getByText('7 AM free').first()).toBeVisible();
    await expect(commuterCard.getByText('8 AM free').first()).toBeVisible();
    await expect(commuterCard.getByText('50% full').first()).toBeVisible();
    await expect(commuterCard.getByText('90% full').first()).toBeVisible();
    await expect(commuterCard.getByText('Full by').first()).toBeVisible();
    await expect(commuterCard.getByText(/Most recent 3 days/i)).toBeVisible();

    const chartCard = page.locator('.MuiCard-root').filter({ has: page.getByRole('heading', { name: 'Historical Occupancy' }) });
    await expect(chartCard).toBeVisible();
    await expect(chartCard.locator('canvas')).toHaveCount(1);
  });

  test('keeps period and interval controls in the single history chart', async ({ page }) => {
    await page.goto(`/facility/${slug}`);

    const chartCard = page.locator('.MuiCard-root').filter({ has: page.getByRole('heading', { name: 'Historical Occupancy' }) });
    await expect(chartCard.getByRole('group', { name: 'History period' })).toBeVisible();
    await expect(chartCard.getByRole('group', { name: 'History point interval' })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(1);
  });

  test('back button works', async ({ page }) => {
    await page.goto(`/facility/${slug}`);
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL('/');
  });
});
