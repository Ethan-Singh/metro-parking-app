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

function datesBetween(from: string, to: string) {
  const dates: string[] = [];
  const date = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  while (date <= end) {
    dates.push(date.toISOString().slice(0, 10));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return dates;
}

test.describe('Facility Page (data-driven)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/parking', async (route) => {
      await route.fulfill({
        json: [
          {
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
          {
            slug: 'park-ride-bella-vista',
            facilityName: 'Park&Ride - Bella Vista',
            spots: 150,
            occupancy: 45,
            available: 105,
            occupancyRate: 0.3,
            availability: 'AVAILABLE',
            timeMs: 1783031812000,
            ariaLabel: 'Bella Vista, 105 of 150 spots available',
          },
        ],
      });
    });
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
      const resolution = query.get('resolution')!;
      const from = query.get('from')!;
      const to = query.get('to')!;
      await route.fulfill({
        json: {
          from,
          to,
          resolution,
          points: datesBetween(from, to).flatMap(historyForDate),
        },
      });
    });
    await page.route('**/api/v1/parking/**/metrics/daily?**', async (route) => {
      const query = new URL(route.request().url()).searchParams;
      const from = query.get('from')!;
      const to = query.get('to')!;
      await route.fulfill({
        json: {
          from,
          to,
          timeZone: 'Australia/Sydney',
          days: datesBetween(from, to).map((date) => ({
            date,
            expectedFreeAt7am: 179,
            expectedFreeAt8am: 136,
            crossed50AtMs: Date.parse(`${date}T09:51:00+11:00`),
            crossed90AtMs: Date.parse(`${date}T12:38:00+11:00`),
            fullAtMs: Date.parse(`${date}T15:10:00+11:00`),
          })),
        },
      });
    });
  });

  test('updates facility SEO metadata and supports keyboard selection in search', async ({
    page,
  }) => {
    await page.goto(`/facility/${slug}`);

    await expect(page).toHaveTitle(
      'Park&Ride - Ashfield Availability | A Metro Parking App'
    );
    await expect(
      page.getByRole('heading', { level: 1, name: 'Park&Ride - Ashfield' })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.ethansingh.com/facility/${slug}`
    );

    const search = page.getByRole('combobox', {
      name: 'Search parking facilities',
    });
    await search.fill('park-ride');
    await expect(search).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('option', { name: /Ashfield/ })).toBeVisible();
    await search.press('ArrowDown');
    await expect(search).toHaveAttribute(
      'aria-activedescendant',
      'facility-search-option-1'
    );
    await search.press('Enter');
    await expect(page).toHaveURL('/facility/park-ride-bella-vista');
  });

  test('renders live facility data and a separate three-day commuter metrics card', async ({
    page,
  }) => {
    await page.goto(`/facility/${slug}`);

    await expect(
      page.getByRole('heading', { name: /Ashfield/i })
    ).toBeVisible();
    await expect(page.getByTestId('metric-occupancy')).toContainText('5%');
    await expect(page.getByTestId('metric-available-value')).toHaveText('217');
    await expect(page.getByTestId('metric-total-value')).toHaveText('228');

    const commuterCard = page.getByTestId('daily-commuter-metrics-card');
    await expect(commuterCard).toBeVisible();
    await expect(commuterCard.getByText('7 AM free').first()).toBeVisible();
    await expect(commuterCard.getByText('8 AM free').first()).toBeVisible();
    await expect(commuterCard.getByText('50% full').first()).toBeVisible();
    await expect(commuterCard.getByText('90% full').first()).toBeVisible();
    await expect(commuterCard.getByText('Full').first()).toBeVisible();
    await expect(commuterCard.getByText(/Most recent 3 days/i)).toBeVisible();
    await expect(
      commuterCard.getByText('Today').locator('xpath=../..')
    ).toContainText(/Today.*[A-Z][a-z]{2}, \d{1,2} [A-Z][a-z]{2}/);
    const milestoneTimeline = commuterCard
      .getByRole('img', { name: /Daily occupancy milestones/ })
      .first();
    await expect(milestoneTimeline).toBeVisible();
    await expect(milestoneTimeline.getByTitle('50% full: 9:51 am')).toHaveCSS(
      'background-color',
      'rgb(22, 163, 74)'
    );
    await expect(milestoneTimeline.getByTitle('90% full: 12:38 pm')).toHaveCSS(
      'background-color',
      'rgb(234, 88, 12)'
    );
    await expect(milestoneTimeline.getByTitle('Full: 3:10 pm')).toHaveCSS(
      'background-color',
      'rgb(155, 28, 28)'
    );

    const chartCard = page.locator('.MuiCard-root').filter({
      has: page.getByRole('heading', { name: 'Historical Occupancy' }),
    });
    await expect(chartCard).toBeVisible();
    await expect(chartCard.locator('canvas')).toHaveCount(1);
  });

  test('keeps period and interval controls in the single history chart', async ({
    page,
  }) => {
    await page.goto(`/facility/${slug}`);

    const chartCard = page.locator('.MuiCard-root').filter({
      has: page.getByRole('heading', { name: 'Historical Occupancy' }),
    });
    await expect(
      chartCard.getByRole('group', { name: 'History period' })
    ).toBeVisible();
    await expect(
      chartCard.getByRole('group', { name: 'History point interval' })
    ).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(1);

    await chartCard.getByRole('button', { name: 'Past 7 days' }).click();
    await expect(
      chartCard.getByRole('button', { name: '10 min interval' })
    ).toBeDisabled();
    await expect(
      chartCard.getByRole('button', { name: '1 hour interval' })
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(chartCard.getByText(/choose a shorter period/i)).toHaveCount(
      0
    );
  });

  test('back button works', async ({ page }) => {
    await page.goto(`/facility/${slug}`);
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL('/');
  });
});
