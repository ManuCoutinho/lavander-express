import { vi } from 'vitest';

export function setReducedMotion(matches) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  });
}

export function installIntersectionObserver() {
  const instances = [];

  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = [];
      this.unobserved = [];
      instances.push(this);
    }

    observe(el) {
      this.observed.push(el);
    }

    unobserve(el) {
      this.unobserved.push(el);
    }

    disconnect() {
      this.observed = [];
    }

    trigger(elements, isIntersecting = true) {
      this.callback(
        elements.map((target) => ({ target, isIntersecting })),
        this
      );
    }
  }

  window.IntersectionObserver = FakeIntersectionObserver;
  global.IntersectionObserver = FakeIntersectionObserver;

  return instances;
}

export function removeIntersectionObserver() {
  delete window.IntersectionObserver;
  delete global.IntersectionObserver;
}
