/**
 * Property-Based Tests for ChatMessage Component
 * Tests typing indicator state behavior
 * 
 * **Feature: mudita-bot, Property 17: Typing Indicator State**
 * **Validates: Requirements 8.3**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';

// Mock the api-client module before importing the store
vi.mock('../../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:3000',
      DEV: true,
      MODE: 'test',
    },
  },
});

// Now import the store after mocks are set up
import { useChatStore } from '../../hooks/stores/use-chat-store';

describe('ChatMessage - Typing Indicator State', () => {
  beforeEach(() => {
    // Reset store state before each test
    useChatStore.getState().reset();
  });

  /**
   * **Feature: mudita-bot, Property 17: Typing Indicator State**
   * **Validates: Requirements 8.3**
   * 
   * Property: For any streaming response, the UI SHALL display a typing indicator
   * (isTyping=true) before the first token arrives and remove it (isTyping=false) after.
   */
  it('Property 17: Typing indicator is true before first token', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary session data
        fc.record({
          sessionId: fc.uuid(),
          userId: fc.integer({ min: 1, max: 10000 }),
        }),
        ({ sessionId, userId }) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Initial state - no typing indicator
          expect(useChatStore.getState().isTyping).toBe(false);
          expect(useChatStore.getState().isStreaming).toBe(false);
          
          // Start streaming - typing indicator should be true
          store.startStreaming();
          
          expect(useChatStore.getState().isTyping).toBe(true);
          expect(useChatStore.getState().isStreaming).toBe(true);
          expect(useChatStore.getState().streamingContent).toBe('');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 17: Typing Indicator State**
   * **Validates: Requirements 8.3**
   * 
   * Property: Typing indicator turns off after first token arrives
   */
  it('Property 17: Typing indicator is false after first token', () => {
    fc.assert(
      fc.property(
        // Generate random token content
        fc.string({ minLength: 1, maxLength: 100 }),
        (firstToken) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Start streaming
          store.startStreaming();
          expect(useChatStore.getState().isTyping).toBe(true);
          
          // Receive first token
          store.appendStreamingContent(firstToken);
          
          // Typing indicator should be false now
          expect(useChatStore.getState().isTyping).toBe(false);
          expect(useChatStore.getState().isStreaming).toBe(true);
          expect(useChatStore.getState().streamingContent).toBe(firstToken);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 17: Typing Indicator State**
   * **Validates: Requirements 8.3**
   * 
   * Property: Typing indicator remains false for subsequent tokens
   */
  it('Property 17: Typing indicator stays false for subsequent tokens', () => {
    fc.assert(
      fc.property(
        // Generate array of tokens
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 2, maxLength: 20 }),
        (tokens) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Start streaming
          store.startStreaming();
          expect(useChatStore.getState().isTyping).toBe(true);
          
          // Append all tokens
          let expectedContent = '';
          tokens.forEach((token, index) => {
            store.appendStreamingContent(token);
            expectedContent += token;
            
            // After first token, isTyping should always be false
            expect(useChatStore.getState().isTyping).toBe(false);
            expect(useChatStore.getState().isStreaming).toBe(true);
            expect(useChatStore.getState().streamingContent).toBe(expectedContent);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 17: Typing Indicator State**
   * **Validates: Requirements 8.3**
   * 
   * Property: Both isTyping and isStreaming are false after streaming completes
   */
  it('Property 17: Typing indicator is false after streaming completes', () => {
    fc.assert(
      fc.property(
        // Generate random content and diary IDs
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.array(fc.integer({ min: 1, max: 10000 }), { minLength: 0, maxLength: 5 }),
        (content, diaryIds) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Start streaming
          store.startStreaming();
          expect(useChatStore.getState().isTyping).toBe(true);
          
          // Append content
          store.appendStreamingContent(content);
          expect(useChatStore.getState().isTyping).toBe(false);
          expect(useChatStore.getState().isStreaming).toBe(true);
          
          // Finish streaming
          store.finishStreaming(diaryIds);
          
          // Both should be false
          expect(useChatStore.getState().isTyping).toBe(false);
          expect(useChatStore.getState().isStreaming).toBe(false);
          expect(useChatStore.getState().streamingContent).toBe('');
          
          // Message should be added to messages array
          const messages = useChatStore.getState().messages;
          expect(messages.length).toBe(1);
          expect(messages[0].content).toBe(content);
          expect(messages[0].role).toBe('assistant');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 17: Typing Indicator State**
   * **Validates: Requirements 8.3**
   * 
   * Property: Typing indicator is false after error during streaming
   */
  it('Property 17: Typing indicator is false after streaming error', () => {
    fc.assert(
      fc.property(
        // Generate error message and optional partial content
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.option(fc.string({ minLength: 1, maxLength: 200 })),
        (errorMessage, partialContent) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Start streaming
          store.startStreaming();
          expect(useChatStore.getState().isTyping).toBe(true);
          
          // Handle error
          store.handleStreamError(errorMessage, partialContent ?? undefined);
          
          // Both should be false
          expect(useChatStore.getState().isTyping).toBe(false);
          expect(useChatStore.getState().isStreaming).toBe(false);
          expect(useChatStore.getState().error).toBe(errorMessage);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 17: Typing Indicator State**
   * **Validates: Requirements 8.3**
   * 
   * Property: State transitions are idempotent - calling startStreaming multiple times
   * doesn't break the state
   */
  it('Property 17: Multiple startStreaming calls maintain correct state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (callCount) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Call startStreaming multiple times
          for (let i = 0; i < callCount; i++) {
            store.startStreaming();
          }
          
          // State should still be correct
          expect(useChatStore.getState().isTyping).toBe(true);
          expect(useChatStore.getState().isStreaming).toBe(true);
          expect(useChatStore.getState().streamingContent).toBe('');
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 17: Typing Indicator State**
   * **Validates: Requirements 8.3**
   * 
   * Property: Empty token doesn't change typing state incorrectly
   */
  it('Property 17: Empty token handling preserves typing state correctly', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (appendEmptyFirst) => {
          const store = useChatStore.getState();
          store.reset();
          
          store.startStreaming();
          expect(useChatStore.getState().isTyping).toBe(true);
          
          if (appendEmptyFirst) {
            // Append empty string
            store.appendStreamingContent('');
            // Even empty string should turn off typing indicator
            // (this is the current behavior - first append turns off typing)
            expect(useChatStore.getState().isTyping).toBe(false);
          }
          
          // Append real content
          store.appendStreamingContent('Hello');
          expect(useChatStore.getState().isTyping).toBe(false);
          expect(useChatStore.getState().streamingContent).toBe(appendEmptyFirst ? 'Hello' : 'Hello');
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
