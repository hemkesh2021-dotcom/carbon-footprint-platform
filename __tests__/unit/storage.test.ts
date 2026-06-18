import { storage } from '@/services/storage';

// ────────────────────────────────────────────────────────────────
// storage service
// ────────────────────────────────────────────────────────────────

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  // ── get ─────────────────────────────────────────────────────

  describe('get', () => {
    it('returns null for a key that does not exist', () => {
      expect(storage.get('nonexistent')).toBeNull();
    });

    it('returns the parsed value for a valid key', () => {
      localStorage.setItem('cfp_user', JSON.stringify({ name: 'Alice' }));
      expect(storage.get('user')).toEqual({ name: 'Alice' });
    });

    it('returns null and logs error for corrupted JSON', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('cfp_broken', 'not-valid-json{{{');

      const result = storage.get('broken');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns primitives (number, string, boolean)', () => {
      localStorage.setItem('cfp_count', JSON.stringify(42));
      expect(storage.get('count')).toBe(42);

      localStorage.setItem('cfp_flag', JSON.stringify(true));
      expect(storage.get('flag')).toBe(true);

      localStorage.setItem('cfp_label', JSON.stringify('hello'));
      expect(storage.get('label')).toBe('hello');
    });

    it('returns arrays', () => {
      localStorage.setItem('cfp_list', JSON.stringify([1, 2, 3]));
      expect(storage.get('list')).toEqual([1, 2, 3]);
    });
  });

  // ── set ─────────────────────────────────────────────────────

  describe('set', () => {
    it('saves and retrieves a value', () => {
      storage.set('theme', 'dark');
      expect(storage.get('theme')).toBe('dark');
    });

    it('prefixes the key with cfp_', () => {
      storage.set('foo', 'bar');
      expect(localStorage.getItem('cfp_foo')).toBe(JSON.stringify('bar'));
    });

    it('overwrites an existing value', () => {
      storage.set('version', 1);
      storage.set('version', 2);
      expect(storage.get('version')).toBe(2);
    });

    it('stores complex objects', () => {
      const data = { a: 1, b: [2, 3], c: { nested: true } };
      storage.set('complex', data);
      expect(storage.get('complex')).toEqual(data);
    });
  });

  // ── remove ──────────────────────────────────────────────────

  describe('remove', () => {
    it('removes a stored key', () => {
      storage.set('temp', 'value');
      expect(storage.get('temp')).toBe('value');

      storage.remove('temp');
      expect(storage.get('temp')).toBeNull();
    });

    it('does not throw when removing a non-existent key', () => {
      expect(() => storage.remove('nonexistent')).not.toThrow();
    });
  });

  // ── clear ───────────────────────────────────────────────────

  describe('clear', () => {
    it('removes all prefixed keys', () => {
      storage.set('a', 1);
      storage.set('b', 2);
      storage.set('c', 3);

      storage.clear();

      expect(storage.get('a')).toBeNull();
      expect(storage.get('b')).toBeNull();
      expect(storage.get('c')).toBeNull();
    });

    it('does not remove keys without the cfp_ prefix', () => {
      localStorage.setItem('other_app_key', 'keep me');
      storage.set('mine', 'remove me');

      storage.clear();

      expect(localStorage.getItem('other_app_key')).toBe('keep me');
      expect(storage.get('mine')).toBeNull();
    });
  });

  // ── SSR resilience / error handling ──────────────────────────

  describe('SSR resilience (localStorage errors)', () => {
    // In jsdom `window` is always defined, so we can't directly test
    // `typeof window === 'undefined'`. Instead we verify the try/catch
    // paths handle localStorage errors gracefully (the same protection
    // that guards against SSR environments).

    it('get returns null and logs error when localStorage.getItem throws', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      expect(storage.get('anything')).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('set does not throw when localStorage.setItem throws', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceeded');
      });

      expect(() => storage.set('key', 'value')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('remove does not throw when localStorage.removeItem throws', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      expect(() => storage.remove('key')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('clear does not throw when localStorage iteration throws', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      Object.defineProperty(Storage.prototype, 'length', {
        get: () => { throw new Error('SecurityError'); },
        configurable: true,
      });

      expect(() => storage.clear()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
