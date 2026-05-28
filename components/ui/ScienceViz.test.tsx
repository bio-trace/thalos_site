import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScienceViz } from './ScienceViz';

describe('ScienceViz', () => {
  it('labels recovery inputs with Load and renders visible ring arcs', () => {
    const { container } = render(<ScienceViz />);

    expect(screen.getByText('Sleep 91 · Load 64')).toBeInTheDocument();
    expect(screen.queryByText(/strain/i)).not.toBeInTheDocument();

    const arcs = container.querySelectorAll('svg circle[stroke="#00E0FF"]');
    expect(arcs).toHaveLength(3);
    arcs.forEach((arc) => {
      expect(arc).toHaveAttribute('stroke-dasharray');
      expect(arc).not.toHaveAttribute('stroke-dashoffset');
    });
  });
});
