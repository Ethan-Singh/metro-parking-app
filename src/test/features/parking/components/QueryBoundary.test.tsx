import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryBoundary } from '../../../../main/features/parking/components/QueryBoundary';

describe('QueryBoundary', () => {
  it('renders loading state by default spinner', () => {
    render(
      <QueryBoundary isLoading={true} isError={false}>
        <div>content</div>
      </QueryBoundary>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders custom loading component', () => {
    render(
      <QueryBoundary
        isLoading={true}
        isError={false}
        loading={<div>loading custom</div>}
      >
        <div>content</div>
      </QueryBoundary>
    );

    expect(screen.getByText('loading custom')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <QueryBoundary isLoading={false} isError={true}>
        <div>content</div>
      </QueryBoundary>
    );

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    render(
      <QueryBoundary
        isLoading={false}
        isError={true}
        errorMessage="Something broke"
      >
        <div>content</div>
      </QueryBoundary>
    );

    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <QueryBoundary isLoading={false} isError={false} isEmpty={true}>
        <div>content</div>
      </QueryBoundary>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders custom empty state', () => {
    render(
      <QueryBoundary
        isLoading={false}
        isError={false}
        isEmpty={true}
        empty={<div>nothing here</div>}
      >
        <div>content</div>
      </QueryBoundary>
    );

    expect(screen.getByText('nothing here')).toBeInTheDocument();
  });

  it('renders children when successful', () => {
    render(
      <QueryBoundary isLoading={false} isError={false}>
        <div>success content</div>
      </QueryBoundary>
    );

    expect(screen.getByText('success content')).toBeInTheDocument();
  });
});
