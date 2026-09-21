import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '';
  delete window.IntersectionObserver;

  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});
