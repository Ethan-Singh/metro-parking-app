import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageMetadata } from '../../main/app/PageMetadata.tsx';

describe('PageMetadata', () => {
  it('updates the document title, social metadata, description, and canonical URL', () => {
    const { rerender } = render(
      <PageMetadata
        title="Ashfield Availability | A Metro Parking App"
        description="Live parking availability at Ashfield."
        path="/facility/park-ride-ashfield"
      />
    );

    expect(document.title).toBe('Ashfield Availability | A Metro Parking App');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Live parking availability at Ashfield.'
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://www.ethansingh.com/facility/park-ride-ashfield'
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.ethansingh.com/facility/park-ride-ashfield'
    );

    rerender(
      <PageMetadata
        title="Bella Vista Availability | A Metro Parking App"
        description="Live parking availability at Bella Vista."
        path="/facility/park-ride-bella-vista"
      />
    );

    expect(document.title).toBe(
      'Bella Vista Availability | A Metro Parking App'
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.ethansingh.com/facility/park-ride-bella-vista'
    );
  });
});
