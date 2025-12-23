/**
 * Property-Based Tests for Chat Store - Same-Day Session Loading
 * 
 * **Feature: mudita-bot, Property 13: Same-Day Session Loading**
 * **Validates: Requirements 5.3**
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';

// Mock api client - must be defined before vi.mock
vi.mock('../../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Import after mock setup
import { useChatStore, ChatSession } from './use-chat-store';
import { apiClient } from '../../lib/api-client';

// Cast to get mock functions
const mockApiClient = apiClient as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

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

// Helper to create a session with a specific date
const createMockSession = (
  sessionId: string,
  userId: number,
  createdAt: Date,
  isActive: boolean = true
): ChatSession => ({
  session_id: sessionId,
  user_id: userId,
  title: `Session ${sessionId}`,
  summary: undefined,
  created_at: createdAt,
  updated_at: createdAt,
  is_active: isActive,
  messages: [],
});

// Helper to create API response format
const toApiSession = (session: ChatSession) => ({
  session_id: session.session_id,
  user_id: session.user_id,
  title: session.title,
  summary: session.summary,
  created_at: session.created_at.toISOString(),
  updated_at: session.updated_at.toISOString(),
  is_active: session.is_active,
  messages: session.messages,
});

// Arbitrary for generating user IDs
const userIdArb = fc.integer({ min: 1, max: 10000 });

// Arbitrary for generating session IDs
const sessionIdArb = fc.uuid();

describe('Chat Store - Same-Day Session Loading', () => {
  beforeEach(() => {
    // Reset store state before each test
    useChatStore.getState().reset();
    localStorageMock.clear();
    localStorageMock.setItem('auth-storage', JSON.stringify({
      state: { token: 'test-token' }
    }));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Feature: mudita-bot, Property 13: Same-Day Session Loading**
   * **Validates: Requirements 5.3**
   * 
   * Property: For any user with an existing Chat_Session from the current day,
   * opening the chat interface SHALL load that session instead of creating a new one.
   */
  it('Property 13: Same-day session is loaded instead of creating new one', async () => {
    await fc.assert(
      fc.asyncProperty(
        userIdArb,
        sessionIdArb,
        async (userId, sessionId) => {
          const store = useChatStore.getState();
          store.reset();

          // Create a session from today
          const today = new Date();
          const todaySession = createMockSession(sessionId, userId, today, true);

          // Mock API to return today's session
          mockApiClient.get.mockImplementation((url: string) => {
            if (url.includes('/sessions/')) {
              return Promise.resolve({
                data: { sessions: [toApiSession(todaySession)] }
              });
            }
            if (url.includes('/session/')) {
              return Promise.resolve({
                data: { session: { ...toApiSession(todaySession), messages: [] } }
              });
            }
            return Promise.reject(new Error('Unknown URL'));
          });

          // Call getOrCreateTodaySession
          const result = await store.getOrCreateTodaySession(userId);

          // Verify that loadSessions was called (to fetch existing sessions)
          expect(mockApiClient.get).toHaveBeenCalledWith(`/api/chat/sessions/${userId}`);

          // Verify that loadSession was called with today's session ID
          expect(mockApiClient.get).toHaveBeenCalledWith(`/api/chat/session/${sessionId}`);

          // Verify that createSession (POST) was NOT called
          expect(mockApiClient.post).not.toHaveBeenCalled();

          // Verify the returned session is today's session
          expect(result?.session_id).toBe(sessionId);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 13: Same-Day Session Loading**
   * **Validates: Requirements 5.3**
   * 
   * Property: When no session exists for today, a new session is created
   */
  it('Property 13: New session is created when no same-day session exists', async () => {
    await fc.assert(
      fc.asyncProperty(
        userIdArb,
        sessionIdArb,
        sessionIdArb,
        async (userId, oldSessionId, newSessionId) => {
          // Ensure different IDs
          if (oldSessionId === newSessionId) return true;

          const store = useChatStore.getState();
          store.reset();

          // Create a session from yesterday
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const oldSession = createMockSession(oldSessionId, userId, yesterday, true);

          // Create a new session for today (to be returned by POST)
          const today = new Date();
          const newSession = createMockSession(newSessionId, userId, today, true);

          // Mock API
          mockApiClient.get.mockImplementation((url: string) => {
            if (url.includes('/sessions/')) {
              return Promise.resolve({
                data: { sessions: [toApiSession(oldSession)] }
              });
            }
            return Promise.reject(new Error('Unknown URL'));
          });

          mockApiClient.post.mockImplementation((url: string) => {
            if (url.includes('/session')) {
              return Promise.resolve({
                data: { session: toApiSession(newSession) }
              });
            }
            return Promise.reject(new Error('Unknown URL'));
          });

          // Call getOrCreateTodaySession
          const result = await store.getOrCreateTodaySession(userId);

          // Verify that loadSessions was called
          expect(mockApiClient.get).toHaveBeenCalledWith(`/api/chat/sessions/${userId}`);

          // Verify that createSession (POST) WAS called since no today session exists
          expect(mockApiClient.post).toHaveBeenCalledWith('/api/chat/session', expect.any(Object));

          // Verify the returned session is the new session
          expect(result?.session_id).toBe(newSessionId);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 13: Same-Day Session Loading**
   * **Validates: Requirements 5.3**
   * 
   * Property: Inactive sessions from today are not loaded
   */
  it('Property 13: Inactive same-day sessions are not loaded', async () => {
    await fc.assert(
      fc.asyncProperty(
        userIdArb,
        sessionIdArb,
        sessionIdArb,
        async (userId, inactiveSessionId, newSessionId) => {
          // Ensure different IDs
          if (inactiveSessionId === newSessionId) return true;

          const store = useChatStore.getState();
          store.reset();

          // Create an INACTIVE session from today
          const today = new Date();
          const inactiveSession = createMockSession(inactiveSessionId, userId, today, false);

          // Create a new session for today (to be returned by POST)
          const newSession = createMockSession(newSessionId, userId, today, true);

          // Mock API
          mockApiClient.get.mockImplementation((url: string) => {
            if (url.includes('/sessions/')) {
              return Promise.resolve({
                data: { sessions: [toApiSession(inactiveSession)] }
              });
            }
            return Promise.reject(new Error('Unknown URL'));
          });

          mockApiClient.post.mockImplementation((url: string) => {
            if (url.includes('/session')) {
              return Promise.resolve({
                data: { session: toApiSession(newSession) }
              });
            }
            return Promise.reject(new Error('Unknown URL'));
          });

          // Call getOrCreateTodaySession
          const result = await store.getOrCreateTodaySession(userId);

          // Verify that createSession (POST) WAS called since inactive session should be ignored
          expect(mockApiClient.post).toHaveBeenCalled();

          // Verify the returned session is the new session, not the inactive one
          expect(result?.session_id).toBe(newSessionId);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 13: Same-Day Session Loading**
   * **Validates: Requirements 5.3**
   * 
   * Property: Date comparison correctly identifies same-day sessions
   * regardless of time of day
   */
  it('Property 13: Same-day detection works regardless of time', async () => {
    await fc.assert(
      fc.asyncProperty(
        userIdArb,
        sessionIdArb,
        // Generate hour (0-23) and minute (0-59) for session creation time
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 }),
        async (userId, sessionId, hour, minute) => {
          const store = useChatStore.getState();
          store.reset();

          // Create a session from today at a specific time
          const today = new Date();
          today.setHours(hour, minute, 0, 0);
          const todaySession = createMockSession(sessionId, userId, today, true);

          // Mock API
          mockApiClient.get.mockImplementation((url: string) => {
            if (url.includes('/sessions/')) {
              return Promise.resolve({
                data: { sessions: [toApiSession(todaySession)] }
              });
            }
            if (url.includes('/session/')) {
              return Promise.resolve({
                data: { session: { ...toApiSession(todaySession), messages: [] } }
              });
            }
            return Promise.reject(new Error('Unknown URL'));
          });

          // Call getOrCreateTodaySession
          const result = await store.getOrCreateTodaySession(userId);

          // Verify that the session from today (regardless of time) is loaded
          expect(result?.session_id).toBe(sessionId);

          // Verify that createSession (POST) was NOT called
          expect(mockApiClient.post).not.toHaveBeenCalled();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mudita-bot, Property 13: Same-Day Session Loading**
   * **Validates: Requirements 5.3**
   * 
   * Property: When multiple sessions exist, only today's active session is loaded
   */
  it('Property 13: Correct session is selected from multiple sessions', async () => {
    await fc.assert(
      fc.asyncProperty(
        userIdArb,
        fc.array(sessionIdArb, { minLength: 3, maxLength: 5 }),
        async (userId, sessionIds) => {
          // Ensure unique session IDs
          const uniqueIds = [...new Set(sessionIds)];
          if (uniqueIds.length < 3) return true;

          const store = useChatStore.getState();
          store.reset();

          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const twoDaysAgo = new Date();
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

          // Create sessions: one from today (active), one from yesterday, one from 2 days ago
          const todaySession = createMockSession(uniqueIds[0], userId, today, true);
          const yesterdaySession = createMockSession(uniqueIds[1], userId, yesterday, true);
          const oldSession = createMockSession(uniqueIds[2], userId, twoDaysAgo, true);

          const allSessions = [todaySession, yesterdaySession, oldSession];

          // Mock API
          mockApiClient.get.mockImplementation((url: string) => {
            if (url.includes('/sessions/')) {
              return Promise.resolve({
                data: { sessions: allSessions.map(toApiSession) }
              });
            }
            if (url.includes('/session/')) {
              return Promise.resolve({
                data: { session: { ...toApiSession(todaySession), messages: [] } }
              });
            }
            return Promise.reject(new Error('Unknown URL'));
          });

          // Call getOrCreateTodaySession
          const result = await store.getOrCreateTodaySession(userId);

          // Verify that today's session is loaded
          expect(result?.session_id).toBe(uniqueIds[0]);

          // Verify that createSession (POST) was NOT called
          expect(mockApiClient.post).not.toHaveBeenCalled();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
