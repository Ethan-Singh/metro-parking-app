import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpGet, HttpError } from '../../main/services/httpClient.ts';

describe('httpGet', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns JSON data when response is ok', async () => {
    const mockData = { hello: 'world' };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      })
    );

    const result = await httpGet<typeof mockData>('/api/test');

    expect(result).toEqual(mockData);
  });

  it('throws HttpError when response is not ok (with JSON body)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          error: 'Server exploded',
          timestamp: '2026-01-01',
        }),
      })
    );

    await expect(httpGet('/api/test')).rejects.toBeInstanceOf(HttpError);

    try {
      await httpGet('/api/test');
    } catch (e) {
      const err = e as HttpError;

      expect(err.status).toBe(500);
      expect(err.body).toEqual({
        error: 'Server exploded',
        timestamp: '2026-01-01',
      });
      expect(err.message).toBe('Server exploded');
    }
  });

  it('throws HttpError when response is not ok (invalid JSON body)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => {
          throw new Error('Not JSON');
        },
      })
    );

    try {
      await httpGet('/api/test');
    } catch (e) {
      const err = e as HttpError;

      expect(err.status).toBe(404);
      expect(err.body).toBeNull();
      expect(err.message).toBe('HTTP 404');
    }
  });

  it('throws HttpError when fetch itself fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );

    await expect(httpGet('/api/test')).rejects.toThrow('Network error');
  });
});
