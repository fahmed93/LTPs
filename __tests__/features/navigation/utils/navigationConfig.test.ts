/**
 * Tests for navigation configuration
 * Validates NAVIGATION_ITEMS structure and ordering
 */

import {NAVIGATION_ITEMS} from '../../../src/features/navigation/utils/navigationConfig';

describe('navigationConfig', () => {
  describe('NAVIGATION_ITEMS', () => {
    it('should have exactly 7 navigation items', () => {
      expect(NAVIGATION_ITEMS).toHaveLength(7);
    });

    it('should have all required features', () => {
      const featureIds = NAVIGATION_ITEMS.map(item => item.id);
      expect(featureIds).toContain('home');
      expect(featureIds).toContain('recipes');
      expect(featureIds).toContain('grocery-list');
      expect(featureIds).toContain('restaurants');
      expect(featureIds).toContain('media');
      expect(featureIds).toContain('travel');
      expect(featureIds).toContain('home-projects');
    });

    it('should have unique IDs for all items', () => {
      const ids = NAVIGATION_ITEMS.map(item => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(NAVIGATION_ITEMS.length);
    });

    it('should have unique routes for all items', () => {
      const routes = NAVIGATION_ITEMS.map(item => item.route);
      const uniqueRoutes = new Set(routes);
      expect(uniqueRoutes.size).toBe(NAVIGATION_ITEMS.length);
    });

    it('should have valid order values (1-based, sequential)', () => {
      const orders = NAVIGATION_ITEMS.map(item => item.order).sort((a, b) => a - b);
      expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should have non-empty names for all items', () => {
      NAVIGATION_ITEMS.forEach(item => {
        expect(item.name).toBeTruthy();
        expect(item.name.length).toBeGreaterThan(0);
      });
    });

    it('should have emoji icons for all items', () => {
      NAVIGATION_ITEMS.forEach(item => {
        expect(item.icon).toBeTruthy();
        expect(item.icon.length).toBeGreaterThan(0);
      });
    });

    it('should be sorted by order property', () => {
      for (let i = 0; i < NAVIGATION_ITEMS.length - 1; i++) {
        expect(NAVIGATION_ITEMS[i].order).toBeLessThan(
          NAVIGATION_ITEMS[i + 1].order,
        );
      });
    });

    it('should have PascalCase route names', () => {
      NAVIGATION_ITEMS.forEach(item => {
        // Route should start with uppercase letter (PascalCase convention)
        expect(item.route[0]).toMatch(/[A-Z]/);
        // Route should not contain spaces or special characters
        expect(item.route).toMatch(/^[A-Za-z]+$/);
      });
    });
  });
});
