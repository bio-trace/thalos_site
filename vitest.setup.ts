import '@testing-library/jest-dom/vitest';

// Mock IntersectionObserver for framer-motion whileInView
if (typeof IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}
