import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RingViz } from './RingViz';

describe('RingViz', () => {
  it('renders value as center label', () => {
    render(<RingViz value={87} max={100} label="Sleep Score" />);
    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getByText('Sleep Score')).toBeInTheDocument();
  });

  it('renders the progress arc without a hidden initial dash offset', () => {
    const { container } = render(<RingViz value={87} max={100} label="Sleep Score" />);
    const arc = container.querySelector('svg circle[stroke="#00E0FF"]');

    expect(arc).toHaveAttribute('stroke-dasharray');
    expect(arc).not.toHaveAttribute('stroke-dashoffset');
  });
});
