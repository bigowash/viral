// Polyfill localStorage for SSR to prevent errors
// This is a no-op implementation that prevents "localStorage is not defined" errors
if (typeof window === 'undefined') {
  // Create a mock localStorage that does nothing but prevents errors
  const noopStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    get length() {
      return 0;
    },
    key: () => null
  };

  // Try to mock localStorage on globalThis if it doesn't exist
  try {
    // @ts-ignore
    globalThis.localStorage = noopStorage;
  } catch (e) {
    // Ignore if we can't set it
  }
}

