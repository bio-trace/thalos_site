import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Apply</Button>);
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });
  it('applies primary variant by default', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-cyan');
  });
  it('applies secondary variant', () => {
    render(<Button variant="secondary">X</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });
  it('renders as anchor when href provided', () => {
    render(<Button href="/foo">X</Button>);
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute('href', '/foo');
  });
});
