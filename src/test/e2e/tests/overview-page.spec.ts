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
        json: {
          from: date,
          to: date,
          resolution: 'TEN_MINUTE',
          points: historyForDate(date),
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
          days: [
            {
              date: to,
              expectedFreeAt7am: 179,
              expectedFreeAt8am: 136,
              crossed50AtMs: null,
              crossed90AtMs: null,
              fullAtMs: null,
            },
          ],
        },
      });
    });
  });

  test('provides accessible landmarks, skip navigation, SEO metadata, and crawl files', async ({
    page,
    request,
    browserName,
  }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(
      'Sydney Metro Parking Availability | A Metro Parking App'
    );
    await expect(
      page.getByRole('heading', { level: 1, name: 'Overview' })
    ).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(
      page.getByRole('search', { name: 'Find a parking facility' })
    ).toBeVisible();
    await expect(page.getByRole('main')).toHaveAttribute('id', 'main-content');
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /live parking availability and historical occupancy/i
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.ethansingh.com/'
    );

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    if (browserName === 'webkit') {
      // WebKit automation defaults to tabbing through text controls only.
      await skipLink.evaluate((element: HTMLAnchorElement) => element.focus());
    } else {
      for (let index = 0; index < 10; index += 1) {
        if (
          await skipLink.evaluate(
            (element) => element === document.activeElement
          )
        ) {
          break;
        }
        await page.keyboard.press('Tab');
      }
    }
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.getByRole('main')).toBeFocused();

    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain(
      'Sitemap: https://www.ethansingh.com/sitemap.xml'
    );

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain(
      '<loc>https://www.ethansingh.com/</loc>'
    );
  });

  test('renders overview page and facility cards', async ({ page }) => {
    await page.goto('/');

    // Page title
    await expect(
      page.getByRole('heading', { name: /overview/i })
    ).toBeVisible();

    // The result count is shown as a readable facility label.
    await expect(page.getByText('3 parking facilities')).toBeVisible();

    // cards should render
    const cards = page.locator('[data-testid="facility-card"]');
    await expect(cards.first()).toBeVisible();

    // sanity check: at least 2 facilities rendered
    await expect(cards).toHaveCount(3);

    // The dedicated Quick view button expands data without navigating.
    await expect(
      page.getByRole('button', { name: 'Park & Ride facilities' })
    ).toHaveAttribute('aria-expanded', 'true');
    await expect(
      page.getByRole('button', { name: 'Other facilities' })
    ).toHaveAttribute('aria-expanded', 'false');
    const ashfieldCard = cards.filter({ hasText: 'Ashfield' });
    const bellaVistaCard = cards.filter({ hasText: 'Bella Vista' });
    const ashfieldQuickView = ashfieldCard.getByRole('button', {
      name: /quick view/i,
    });
    const bellaVistaQuickView = bellaVistaCard.getByRole('button', {
      name: /quick view/i,
    });
    const quickViewYBefore = (await ashfieldQuickView.boundingBox())!.y;
    const bellaVistaQuickViewYBefore =
      (await bellaVistaQuickView.boundingBox())!.y;
    expect(
      Math.abs(quickViewYBefore - bellaVistaQuickViewYBefore)
    ).toBeLessThan(2);

    const bellaVistaHeightBefore = (await bellaVistaCard.boundingBox())!.height;
    await ashfieldQuickView.click();
    await expect(
      ashfieldCard.getByText('Daily commuter metrics')
    ).toBeVisible();
    await expect(ashfieldCard.getByText('7 AM free')).toBeVisible();
    await expect(ashfieldCard.getByText('Full', { exact: true })).toBeVisible();
    await expect(
      ashfieldCard
        .getByRole('img', { name: /Daily occupancy milestones/ })
        .first()
    ).toBeVisible();
    await expect(ashfieldCard.locator('canvas')).toHaveCount(1);
    await expect(page).toHaveURL('/');

    expect((await ashfieldCard.boundingBox())!.height).toBeGreaterThan(
      bellaVistaHeightBefore
    );
    expect((await bellaVistaCard.boundingBox())!.height).toBe(
      bellaVistaHeightBefore
    );
    expect(
      Math.abs(
        (await bellaVistaQuickView.boundingBox())!.y -
          bellaVistaQuickViewYBefore
      )
    ).toBeLessThan(2);

    // Clicking the rest of the card still opens the facility page.
    await ashfieldCard
      .getByRole('link', { name: /Ashfield, 217 of 228 spots available/i })
      .click();
    await expect(page).toHaveURL(/\/facility\//);
  });
});
