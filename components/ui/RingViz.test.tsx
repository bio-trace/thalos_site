import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RingViz } from './RingViz';

describe('RingViz', () => {
  it('renders value as center label', () => {
    render(<RingViz value={87} max={100} label="Sleep Score" />);
    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getByText('Sleep Score')).toBeInTheDocument();
  });
});
