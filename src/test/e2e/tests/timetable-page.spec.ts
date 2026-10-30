import { expect, test } from '@playwright/test';

const frozenNow = new Date('2026-10-31T01:00:00Z');
const travelDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Australia/Sydney',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(frozenNow);

const offeringStatus = (key: 'SYDNEY_TRAINS' | 'SYDNEY_METRO') => ({
  key,
  state: 'AVAILABLE',
  coveredDates: [travelDate],
  minimumFacets: ['STATION'],
  supportedFacets: ['STATION'],
  sources: [],
});

function timetablePackage(offering: 'SYDNEY_TRAINS' | 'SYDNEY_METRO') {
  const isTrain = offering === 'SYDNEY_TRAINS';
  return {
    schemaVersion: '1',
    packageVersion: 'e2e',
    generatedAt: '2026-10-31T01:00:00Z',
    travelDate,
    timezone: 'Australia/Sydney',
    availability: 'AVAILABLE',
    offerings: [offering],
    offeringStatuses: [],
    sources: [],
    stops: isTrain
      ? [
          {
            id: 'trains:central',
            name: 'Central Station',
            kind: 'STATION',
            feedKey: 'trains',
            providerId: 'central',
          },
          {
            id: 'trains:tallawong',
            name: 'Tallawong Station',
            kind: 'STATION',
            feedKey: 'trains',
            providerId: 'tallawong',
          },
        ]
      : [],
    routes: isTrain
      ? [
          {
            id: 'trains:t1',
            offering,
            feedKey: 'trains',
            providerId: 't1',
            shortName: 'T1',
            name: 'T1',
            mode: 'TRAIN',
            servicePurpose: 'REGULAR',
            color: '#F39C12',
          },
        ]
      : [],
    trips: isTrain
      ? [
          {
            id: 'trains:central-tallawong',
            routeId: 'trains:t1',
            serviceDate: travelDate,
            headsign: 'Tallawong Station',
            servicePurpose: 'REGULAR',
            stopCallStart: 0,
            stopCallCount: 2,
          },
        ]
      : [],
    calls: isTrain
      ? [
          {
            tripId: 'trains:central-tallawong',
            sequence: 1,
            stopId: 'trains:central',
            arrival: `${travelDate}T14:00:00+11:00`,
            departure: `${travelDate}T14:00:00+11:00`,
            timezone: 'Australia/Sydney',
            platform: '1',
          },
          {
            tripId: 'trains:central-tallawong',
            sequence: 2,
            stopId: 'trains:tallawong',
            arrival: `${travelDate}T14:40:00+11:00`,
            departure: `${travelDate}T14:40:00+11:00`,
            timezone: 'Australia/Sydney',
            platform: '1',
          },
        ]
      : [],
    interchanges: [],
  };
}

test.describe('Timetable page', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: frozenNow });
    await page.route('**/api/v1/timetable/manifest', async (route) => {
      await route.fulfill({
        json: {
          schemaVersion: '1',
          generatedAt: '2026-10-31T01:00:00Z',
          timezone: 'Australia/Sydney',
          travelDateWindow: { from: travelDate, through: travelDate },
          offerings: [
            offeringStatus('SYDNEY_TRAINS'),
            offeringStatus('SYDNEY_METRO'),
          ],
        },
      });
    });
    await page.route('**/api/v1/timetable/packages/**', async (route) => {
      const url = new URL(route.request().url());
      const offering = url.searchParams.get('offering') as
        'SYDNEY_TRAINS' | 'SYDNEY_METRO';
      await route.fulfill({ json: timetablePackage(offering) });
    });
    await page.route('**/api/v1/timetable/realtime**', async (route) => {
      await route.fulfill({
        json: {
          schemaVersion: '1',
          overlayVersion: 'e2e',
          generatedAt: '2026-10-31T01:00:00Z',
          sources: [],
          alerts: [],
          tripUpdates: [],
          vehiclePositions: [],
        },
      });
    });
  });

  test('keeps the weekday strip to seven days and pages by whole weeks', async ({
    page,
  }) => {
    await page.goto('/timetable');

    const days = page.locator('[aria-label="Travel date"] button');
    const selectedDays = page.locator(
      '[aria-label="Travel date"] button[aria-pressed="true"]'
    );
    await expect(days).toHaveCount(7);
    await expect(selectedDays).toHaveCount(1);

    await page.getByRole('button', { name: 'Show next week' }).click();
    await expect(days).toHaveCount(7);
    await expect(selectedDays).toHaveCount(0);
  });

  test('selecting a destination searches automatically and the clear control returns to Central departures', async ({
    page,
  }) => {
    await page.goto('/timetable');
    await expect(
      page.getByText('Data provided by Transport for NSW')
    ).toBeVisible();

    const from = page.getByRole('textbox', { name: 'From station' });
    await from.fill('Central');
    await page.getByRole('button', { name: 'Central Station station' }).click();

    const to = page.getByRole('textbox', { name: 'To station' });
    await to.fill('Tallawong');
    await page
      .getByRole('button', { name: 'Tallawong Station station' })
      .click();

    await expect(
      page.getByRole('heading', { name: 'Timetable options' })
    ).toBeVisible();
    await expect(page.getByText('Scheduled', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Clear timetable search' }).click();
    await expect(
      page.getByRole('heading', { name: 'Departures from' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Central Station' })
    ).toBeVisible();
  });
});
