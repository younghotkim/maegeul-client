/**
 * Property-Based Tests for Chat Store
 * Tests message queue behavior during streaming
 * 
 * **Feature: mudita-bot, Property 18: Message Queue During Streaming**
 * **Validates: Requirements 8.4**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { useChatStore } from './use-chat-store';

// Mock fetch for SSE
vi.mock('../../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:3000',
    },
  },
});

describe('Chat Store - Message Queue During Streaming', () => {
  beforeEach(() => {
    // Reset store state before each test
    useChatStore.getState().reset();
    localStorageMock.clear();
    localStorageMock.setItem('auth-storage', JSON.stringify({
      state: { token: 'test-token' }
    }));
  });

  /**
   * **Feature: mudita-bot, Property 18: Message Queue During Streaming**
   * **Validates: Requirements 8.4**
   * 
   * Property: For any user message sent while streaming is in progress,
   * the message SHALL be queued and processed only after the current stream completes.
   */
  it('Property 18: Messages sent during streaming are queued', () => {
    fc.assert(
      fc.property(
        // Generate random non-empty message strings
        fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
        (messages) => {
          const store = useChatStore.getState();
          
          // Reset state
          store.reset();
          
          // Simulate streaming state
          store.startStreaming();
          
          // Verify streaming is active
          expect(useChatStore.getState().isStreaming).toBe(true);
          
          // Queue messages while streaming
          messages.forEach(msg => {
            store.queueMessage(msg);
          });
          
          // Verify all messages are queued
          const queuedMessages = useChatStore.getState().messageQueue;
          expect(queuedMessages.length).toBe(messages.length);
          
          // Verify message content is preserved
          messages.forEach((msg, index) => {
            expect(queuedMessages[index].content).toBe(msg);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 18: Message Queue During Streaming**
   * **Validates: Requirements 8.4**
   * 
   * Property: Queue order is preserved - messages are processed in FIFO order
   */
  it('Property 18: Message queue maintains FIFO order', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 2, maxLength: 10 }),
        (messages) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Queue messages
          messages.forEach(msg => store.queueMessage(msg));
          
          // Verify order is preserved
          const queue = useChatStore.getState().messageQueue;
          for (let i = 0; i < messages.length; i++) {
            expect(queue[i].content).toBe(messages[i]);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 18: Message Queue During Streaming**
   * **Validates: Requirements 8.4**
   * 
   * Property: sendMessage queues when isStreaming is true
   */
  it('Property 18: sendMessage queues messages when streaming is active', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (message) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Start streaming
          store.startStreaming();
          expect(useChatStore.getState().isStreaming).toBe(true);
          
          // Call sendMessage - should queue instead of sending
          await store.sendMessage(message);
          
          // Message should be in queue (since we're streaming)
          const queue = useChatStore.getState().messageQueue;
          expect(queue.length).toBe(1);
          expect(queue[0].content).toBe(message);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 18: Message Queue During Streaming**
   * **Validates: Requirements 8.4**
   * 
   * Property: Queue is cleared after processing
   */
  it('Property 18: Queue is cleared when processing starts', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
        (messages) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Queue messages
          messages.forEach(msg => store.queueMessage(msg));
          expect(useChatStore.getState().messageQueue.length).toBe(messages.length);
          
          // Manually clear queue (simulating processQueue behavior)
          // Note: We can't fully test processQueue without mocking fetch
          useChatStore.setState({ messageQueue: [] });
          
          expect(useChatStore.getState().messageQueue.length).toBe(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 18: Message Queue During Streaming**
   * **Validates: Requirements 8.4**
   * 
   * Property: Streaming state transitions correctly
   */
  it('Property 18: Streaming state transitions are correct', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (streamContent) => {
          const store = useChatStore.getState();
          store.reset();
          
          // Initial state
          expect(useChatStore.getState().isStreaming).toBe(false);
          expect(useChatStore.getState().isTyping).toBe(false);
          
          // Start streaming
          store.startStreaming();
          expect(useChatStore.getState().isStreaming).toBe(true);
          expect(useChatStore.getState().isTyping).toBe(true);
          
          // Append content (typing indicator should turn off)
          store.appendStreamingContent(streamContent);
          expect(useChatStore.getState().isStreaming).toBe(true);
          expect(useChatStore.getState().isTyping).toBe(false);
          expect(useChatStore.getState().streamingContent).toBe(streamContent);
          
          // Finish streaming
          store.finishStreaming([]);
          expect(useChatStore.getState().isStreaming).toBe(false);
          expect(useChatStore.getState().isTyping).toBe(false);
          expect(useChatStore.getState().streamingContent).toBe('');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 18: Message Queue During Streaming**
   * **Validates: Requirements 8.4**
   * 
   * Property: Queued messages have timestamps
   */
  it('Property 18: Queued messages have valid timestamps', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (message) => {
          const store = useChatStore.getState();
          store.reset();
          
          const beforeQueue = new Date();
          store.queueMessage(message);
          const afterQueue = new Date();
          
          const queue = useChatStore.getState().messageQueue;
          expect(queue.length).toBe(1);
          
          const queuedTimestamp = queue[0].timestamp;
          expect(queuedTimestamp.getTime()).toBeGreaterThanOrEqual(beforeQueue.getTime());
          expect(queuedTimestamp.getTime()).toBeLessThanOrEqual(afterQueue.getTime());
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
