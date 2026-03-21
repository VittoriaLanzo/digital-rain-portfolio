import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import HeroDistrict from '@/components/HeroDistrict';

// jsdom doesn't implement scrollTo — stub it out
beforeEach(() => {
  window.scrollTo = vi.fn() as typeof window.scrollTo;
  // Simulate a 600vh page (scrollHeight=6000, innerHeight=1000 → docHeight=5000)
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 6000,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', {
    value: 1000,
    configurable: true,
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('HeroDistrict', () => {
  it('renders the name heading', () => {
    render(<HeroDistrict />);
    expect(screen.queryByText('VITTORIA LANZO')).not.toBeNull();
  });

  it('renders a "View Work" button', () => {
    render(<HeroDistrict />);
    expect(screen.queryByRole('button', { name: /view work/i })).not.toBeNull();
  });

  it('renders a "Get in touch" button (not a dead anchor)', () => {
    render(<HeroDistrict />);
    const btn = screen.queryByRole('button', { name: /get in touch/i });
    expect(btn).not.toBeNull();
    // Must be a button, not an anchor with a broken #contact href
    expect(btn?.tagName).toBe('BUTTON');
  });

  it('"View Work" scrolls to the work section (46% of scroll range)', () => {
    render(<HeroDistrict />);
    fireEvent.click(screen.getByRole('button', { name: /view work/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 5000 * 0.46, // (scrollHeight - innerHeight) * 0.46
      behavior: 'smooth',
    });
  });

  it('"Get in touch" scrolls to the contact billboard (93% of scroll range)', () => {
    render(<HeroDistrict />);
    fireEvent.click(screen.getByRole('button', { name: /get in touch/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 5000 * 0.93, // (scrollHeight - innerHeight) * 0.93
      behavior: 'smooth',
    });
  });
});
