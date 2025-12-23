/**
 * Property-Based Tests for Welcome Message Personalization
 * Tests that welcome messages contain user name and mood references
 * 
 * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
 * **Validates: Requirements 1.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  generateWelcomeMessage, 
  moodDescriptions, 
  moodEmojis,
  type RecentMoodData 
} from './useRecentMood';

// Arbitrary for generating valid mood colors
const moodColorArb = fc.constantFrom('blue', 'yellow', 'green', 'red');

// Arbitrary for generating RecentMoodData
const recentMoodDataArb = fc.record({
  recentColor: fc.option(moodColorArb, { nil: null }),
  recentLabel: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
  dominantColor: fc.option(moodColorArb, { nil: null }),
  moodCounts: fc.record({
    blue: fc.integer({ min: 0, max: 100 }),
    yellow: fc.integer({ min: 0, max: 100 }),
    green: fc.integer({ min: 0, max: 100 }),
    red: fc.integer({ min: 0, max: 100 }),
  }),
  totalEntries: fc.integer({ min: 0, max: 400 }),
  isLoading: fc.constant(false),
  error: fc.constant(null),
}) as fc.Arbitrary<RecentMoodData>;

// Arbitrary for generating user names (Korean-style names)
const koreanChars = '가나다라마바사아자차카타파하김이박최정강조윤장임한오서신권황안송류홍'.split('');
const userNameArb = fc.array(fc.constantFrom(...koreanChars), { minLength: 2, maxLength: 5 })
  .map(chars => chars.join(''));

describe('Welcome Message Personalization', () => {
  /**
   * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
   * **Validates: Requirements 1.1**
   * 
   * Property: For any user with diary entries, when the chat interface opens,
   * the welcome message SHALL contain the user's profile_name.
   */
  it('Property 1: Welcome message contains user profile_name', () => {
    fc.assert(
      fc.property(
        userNameArb,
        recentMoodDataArb,
        (userName, moodData) => {
          const { greeting, subtext } = generateWelcomeMessage(userName, moodData);
          
          // The greeting should contain the user's name
          expect(greeting).toContain(userName);
          
          // The message should have both greeting and subtext
          expect(greeting.length).toBeGreaterThan(0);
          expect(subtext.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
   * **Validates: Requirements 1.1**
   * 
   * Property: For any user with mood data, the welcome message SHALL reference
   * their recent emotional state (mood color description).
   */
  it('Property 1: Welcome message references recent mood color when available', () => {
    fc.assert(
      fc.property(
        userNameArb,
        moodColorArb,
        fc.integer({ min: 1, max: 100 }),
        (userName, moodColor, totalEntries) => {
          const moodData: RecentMoodData = {
            recentColor: moodColor,
            recentLabel: null,
            dominantColor: moodColor,
            moodCounts: { blue: 0, yellow: 0, green: 0, red: 0, [moodColor]: totalEntries },
            totalEntries,
            isLoading: false,
            error: null,
          };

          const { greeting, subtext } = generateWelcomeMessage(userName, moodData);
          
          // The greeting should contain the user's name
          expect(greeting).toContain(userName);
          
          // The subtext should reference the mood description
          const moodDesc = moodDescriptions[moodColor];
          expect(subtext).toContain(moodDesc);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
   * **Validates: Requirements 1.1**
   * 
   * Property: When user has no mood data, welcome message still contains their name
   * and provides a default greeting.
   */
  it('Property 1: Welcome message handles users with no mood data', () => {
    fc.assert(
      fc.property(
        userNameArb,
        (userName) => {
          // No mood data
          const moodData: RecentMoodData = {
            recentColor: null,
            recentLabel: null,
            dominantColor: null,
            moodCounts: { blue: 0, yellow: 0, green: 0, red: 0 },
            totalEntries: 0,
            isLoading: false,
            error: null,
          };

          const { greeting, subtext } = generateWelcomeMessage(userName, moodData);
          
          // Should still contain user name
          expect(greeting).toContain(userName);
          
          // Should have a default subtext
          expect(subtext.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
   * **Validates: Requirements 1.1**
   * 
   * Property: When no user name is provided, welcome message uses default name.
   */
  it('Property 1: Welcome message handles missing user name', () => {
    fc.assert(
      fc.property(
        recentMoodDataArb,
        (moodData) => {
          const { greeting, subtext } = generateWelcomeMessage(undefined, moodData);
          
          // Should use default name "회원"
          expect(greeting).toContain('회원');
          
          // Should still have valid content
          expect(greeting.length).toBeGreaterThan(0);
          expect(subtext.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
   * **Validates: Requirements 1.1**
   * 
   * Property: Each mood color produces a distinct, appropriate message.
   */
  it('Property 1: Different mood colors produce appropriate messages', () => {
    fc.assert(
      fc.property(
        userNameArb,
        (userName) => {
          const colors = ['blue', 'yellow', 'green', 'red'] as const;
          const messages = new Set<string>();
          
          colors.forEach(color => {
            const moodData: RecentMoodData = {
              recentColor: color,
              recentLabel: null,
              dominantColor: color,
              moodCounts: { blue: 0, yellow: 0, green: 0, red: 0, [color]: 10 },
              totalEntries: 10,
              isLoading: false,
              error: null,
            };

            const { subtext } = generateWelcomeMessage(userName, moodData);
            
            // Each color should produce a message with its mood description
            expect(subtext).toContain(moodDescriptions[color]);
            
            // Collect unique messages
            messages.add(subtext);
          });
          
          // All four colors should produce different subtexts
          expect(messages.size).toBe(4);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
   * **Validates: Requirements 1.1**
   * 
   * Property: Welcome message uses recentColor over dominantColor when both available.
   */
  it('Property 1: Recent color takes precedence over dominant color', () => {
    fc.assert(
      fc.property(
        userNameArb,
        moodColorArb,
        moodColorArb.filter(c => true), // Get another color
        (userName, recentColor, dominantColor) => {
          // Skip if colors are the same
          if (recentColor === dominantColor) return true;
          
          const moodData: RecentMoodData = {
            recentColor,
            recentLabel: null,
            dominantColor,
            moodCounts: { blue: 0, yellow: 0, green: 0, red: 0 },
            totalEntries: 10,
            isLoading: false,
            error: null,
          };

          const { subtext } = generateWelcomeMessage(userName, moodData);
          
          // Should use recent color's description, not dominant
          expect(subtext).toContain(moodDescriptions[recentColor]);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
   * **Validates: Requirements 1.1**
   * 
   * Property: Falls back to dominant color when recent color is null.
   */
  it('Property 1: Falls back to dominant color when recent is null', () => {
    fc.assert(
      fc.property(
        userNameArb,
        moodColorArb,
        (userName, dominantColor) => {
          const moodData: RecentMoodData = {
            recentColor: null,
            recentLabel: null,
            dominantColor,
            moodCounts: { blue: 0, yellow: 0, green: 0, red: 0, [dominantColor]: 10 },
            totalEntries: 10,
            isLoading: false,
            error: null,
          };

          const { subtext } = generateWelcomeMessage(userName, moodData);
          
          // Should use dominant color's description
          expect(subtext).toContain(moodDescriptions[dominantColor]);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 1: Welcome Message Personalization**
   * **Validates: Requirements 1.1**
   * 
   * Property: Welcome message mentions entry count when no color available but has entries.
   */
  it('Property 1: Mentions entry count when no color but has entries', () => {
    fc.assert(
      fc.property(
        userNameArb,
        fc.integer({ min: 1, max: 1000 }),
        (userName, totalEntries) => {
          const moodData: RecentMoodData = {
            recentColor: null,
            recentLabel: null,
            dominantColor: null,
            moodCounts: { blue: 0, yellow: 0, green: 0, red: 0 },
            totalEntries,
            isLoading: false,
            error: null,
          };

          const { greeting, subtext } = generateWelcomeMessage(userName, moodData);
          
          // Should contain user name
          expect(greeting).toContain(userName);
          
          // Should mention the entry count
          expect(subtext).toContain(totalEntries.toString());
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
