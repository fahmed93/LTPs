/**
 * Tests for item validation utilities
 */

import {
  validateItemName,
  isValidItemName,
  trimItemName,
  MAX_ITEM_NAME_LENGTH,
  MIN_ITEM_NAME_LENGTH,
} from '../../../../src/features/grocery-list/utils/itemValidation';

describe('itemValidation', () => {
  describe('validateItemName', () => {
    it('should return trimmed name for valid input', () => {
      expect(validateItemName('Milk')).toBe('Milk');
      expect(validateItemName('  Eggs  ')).toBe('Eggs');
      expect(validateItemName('  Bread with spaces  ')).toBe('Bread with spaces');
    });

    it('should throw error for empty string', () => {
      expect(() => validateItemName('')).toThrow('Item name cannot be empty');
    });

    it('should throw error for whitespace-only string', () => {
      expect(() => validateItemName('   ')).toThrow('Item name cannot be empty');
    });

    it('should throw error for string exceeding max length', () => {
      const longName = 'a'.repeat(MAX_ITEM_NAME_LENGTH + 1);
      expect(() => validateItemName(longName)).toThrow(
        `Item name cannot exceed ${MAX_ITEM_NAME_LENGTH} characters`,
      );
    });

    it('should accept string at exactly max length', () => {
      const maxLengthName = 'a'.repeat(MAX_ITEM_NAME_LENGTH);
      expect(validateItemName(maxLengthName)).toBe(maxLengthName);
    });

    it('should accept single character name', () => {
      expect(validateItemName('a')).toBe('a');
    });

    it('should handle special characters', () => {
      expect(validateItemName('Café au lait')).toBe('Café au lait');
      expect(validateItemName('12345')).toBe('12345');
      expect(validateItemName('Item-123')).toBe('Item-123');
    });
  });

  describe('isValidItemName', () => {
    it('should return true for valid names', () => {
      expect(isValidItemName('Milk')).toBe(true);
      expect(isValidItemName('  Eggs  ')).toBe(true);
      expect(isValidItemName('a')).toBe(true);
    });

    it('should return false for invalid names', () => {
      expect(isValidItemName('')).toBe(false);
      expect(isValidItemName('   ')).toBe(false);
      expect(isValidItemName('a'.repeat(MAX_ITEM_NAME_LENGTH + 1))).toBe(false);
    });
  });

  describe('trimItemName', () => {
    it('should trim whitespace from name', () => {
      expect(trimItemName('Milk')).toBe('Milk');
      expect(trimItemName('  Eggs  ')).toBe('Eggs');
      expect(trimItemName('  Bread with spaces  ')).toBe('Bread with spaces');
    });

    it('should handle null and undefined safely', () => {
      expect(trimItemName(null)).toBe('');
      expect(trimItemName(undefined)).toBe('');
    });

    it('should return empty string for whitespace-only input', () => {
      expect(trimItemName('   ')).toBe('');
    });
  });
});
