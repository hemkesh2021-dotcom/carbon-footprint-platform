import {
  sanitizeString,
  validateNumericRange,
  isValidDate,
  generateId,
} from '@/utils/validation';

describe('Validation and Sanitization Utilities', () => {
  describe('sanitizeString', () => {
    test('should strip HTML tags from a string', () => {
      expect(sanitizeString('<script>alert("XSS")</script>hello')).toBe('alert("XSS")hello');
      expect(sanitizeString('<div>test</div>')).toBe('test');
    });

    test('should trim whitespace', () => {
      expect(sanitizeString('   hello world   ')).toBe('hello world');
    });

    test('should return empty string for non-string inputs', () => {
      expect(sanitizeString(null as unknown as string)).toBe('');
      expect(sanitizeString(undefined as unknown as string)).toBe('');
    });
  });

  describe('validateNumericRange', () => {
    test('should clamp values within bounds', () => {
      expect(validateNumericRange(5, 0, 10)).toBe(5);
      expect(validateNumericRange(-5, 0, 10)).toBe(0);
      expect(validateNumericRange(15, 0, 10)).toBe(10);
    });

    test('should handle NaN and non-number types', () => {
      expect(validateNumericRange('invalid' as unknown as number, 0, 10)).toBe(0);
      expect(validateNumericRange(NaN, 0, 10)).toBe(0);
    });
  });

  describe('isValidDate', () => {
    test('should identify valid dates in the past/present', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isValidDate(pastDate.toISOString())).toBe(true);
      expect(isValidDate(new Date().toISOString())).toBe(true);
    });

    test('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      expect(isValidDate(futureDate.toISOString())).toBe(false);
    });

    test('should reject invalid date formats', () => {
      expect(isValidDate('not-a-date')).toBe(false);
    });
  });

  describe('generateId', () => {
    test('should generate a valid UUID format', () => {
      const uuid = generateId();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('should generate UUID using fallback if crypto is not available', () => {
      const originalCrypto = global.crypto;
      Object.defineProperty(global, 'crypto', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const uuid = generateId();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
        configurable: true,
      });
    });
  });
});
