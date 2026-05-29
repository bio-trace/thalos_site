import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>hello</p></Card>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
  it('applies elevated variant', () => {
    render(<Card variant="elevated" data-testid="c">x</Card>);
    expect(screen.getByTestId('c')).toHaveClass('shadow-card-active');
  });
});
