import { describe, it, expect } from 'vitest';
import { cn, parseLocation } from './utils';
import { LocationData } from '@/types';

describe('utils', () => {
    describe('cn()', () => {
        it('should merge tailwind classes properly', () => {
            const result = cn('text-blue-500', 'bg-red-500', 'p-4');
            expect(result).toBe('text-blue-500 bg-red-500 p-4');
        });

        it('should resolve conflicting tailwind classes', () => {
            const result = cn('text-blue-500', 'text-red-500');
            expect(result).toBe('text-red-500'); // the last class wins
        });

        it('should handle conditional classes gracefully', () => {
            const isTrue = true;
            const isFalse = false;
            const result = cn(
                'base-class',
                isTrue && 'true-class',
                isFalse && 'false-class'
            );
            expect(result).toBe('base-class true-class');
        });
    });

    describe('parseLocation()', () => {
        it('should return empty string for null/undefined input', () => {
            expect(parseLocation(null)).toBe('');
            expect(parseLocation(undefined)).toBe('');
            expect(parseLocation('')).toBe('');
        });

        it('should return the original string if it is not valid JSON', () => {
            const input = 'Everywhere, World';
            expect(parseLocation(input)).toBe(input);
        });

        it('should parse valid location JSON strings', () => {
            const locationData: LocationData = {
                display: 'San Francisco, CA',
                city: 'San Francisco',
                country: 'US',
            };
            const input = JSON.stringify(locationData);
            const result = parseLocation(input);
            expect(result).toEqual(locationData);
        });

        it('should handle JSON strings that are not location objects', () => {
            const input = JSON.stringify({ wrongKey: 'value' });
            // It fails the 'display' in parsed check so it falls back to parsing string
            expect(parseLocation(input)).toBe(input);
        });
    });
});
