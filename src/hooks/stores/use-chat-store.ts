/**
 * Chat Store for Mudita Bot
 * Manages chat sessions, messages, and streaming state using Zustand
 * Validates: Requirements 2.1, 2.3, 8.1, 8.2, 8.3, 8.4
 */

import { create } from 'zustand';
import { apiClient } from '../../lib/api-client';
import { createChatSSEHandler, type ChatSSEHandler } from '../../lib/sse-handler';

// ============================================================================
// Interfaces
// ============================================================================

export interface DiaryReference {
  diary_id: number;
  title: string;
  date: string;
  relevanceScore: number;
}

export interface MessageAction {
  type: 'write_diary' | 'view_dashboard' | 'view_diary';
  label: string;
  path: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  relatedDiaries?: DiaryReference[];
  action?: MessageAction;  // CTA 버튼 액션
}

export interface ChatSession {
  session_id: string;
  user_id: number;
  title?: string;
  summary?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  messages?: Message[];
}

interface QueuedMessage {
  content: string;
  timestamp: Date;
}

// ============================================================================
// Chat Store State Interface
// ============================================================================

interface ChatState {
  // Session state
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoadingSessions: boolean;

  // Message state
  messages: Message[];
  isLoadingMessages: boolean;

  // Streaming state
  isStreaming: boolean;
  isTyping: boolean;
  streamingContent: string;

  // SSE handler instance
  sseHandler: ChatSSEHandler | null;

  // Message queue (for messages sent during streaming)
  messageQueue: QueuedMessage[];

  // Error state
  error: string | null;

  // Actions - Session management
  loadSessions: (userId: number) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  createSession: (title?: string) => Promise<ChatSession | null>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  setCurrentSession: (session: ChatSession | null) => void;
  getOrCreateTodaySession: (userId: number) => Promise<ChatSession | null>;

  // Actions - Message management
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  abortMessage: () => void;

  // Actions - Streaming
  startStreaming: () => void;
  appendStreamingContent: (token: string) => void;
  finishStreaming: (diaryIds?: number[], action?: MessageAction) => void;
  handleStreamError: (error: string, partialContent?: string) => void;

  // Actions - Queue management
  queueMessage: (content: string) => void;
  processQueue: () => Promise<void>;

  // Actions - Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Actions - Reset
  reset: () => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const parseSessionFromApi = (apiSession: any): ChatSession => ({
  session_id: apiSession.session_id,
  user_id: apiSession.user_id,
  title: apiSession.title,
  summary: apiSession.summary,
  created_at: new Date(apiSession.created_at),
  updated_at: new Date(apiSession.updated_at),
  is_active: apiSession.is_active,
  messages: apiSession.messages?.map(parseMessageFromApi),
});

const parseMessageFromApi = (apiMessage: any): Message => ({
  id: apiMessage.message_id || generateMessageId(),
  role: apiMessage.role,
  content: apiMessage.content,
  timestamp: new Date(apiMessage.created_at),
  relatedDiaries: apiMessage.related_diary_ids?.map((id: number) => ({
    diary_id: id,
    title: '',
    date: '',
    relevanceScore: 0,
  })),
});

/**
 * Converts error messages to user-friendly Korean messages
 * Validates: Requirements 9.3
 */
const getErrorMessage = (error: string): string => {
  // Rate limit error
  if (error.includes('Rate limit') || error.includes('429')) {
    return '잠시 후 다시 시도해주세요. 요청이 너무 많아요.';
  }
  
  // Connection error
  if (error.includes('connect') || error.includes('network') || error.includes('timeout')) {
    return 'AI 서비스에 연결할 수 없어요. 잠시 후 다시 시도해주세요.';
  }
  
  // API key error
  if (error.includes('API key') || error.includes('401')) {
    return '서비스 설정에 문제가 있어요. 관리자에게 문의해주세요.';
  }
  
  // Generic error
  return '메시지를 처리하는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
};

// ============================================================================
// Chat Store
// ============================================================================

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  currentSession: null,
  sessions: [],
  isLoadingSessions: false,
  messages: [],
  isLoadingMessages: false,
  isStreaming: false,
  isTyping: false,
  streamingContent: '',
  sseHandler: null,
  messageQueue: [],
  error: null,

  // ============================================================================
  // Session Management Actions
  // ============================================================================

  loadSessions: async (userId: number) => {
    set({ isLoadingSessions: true, error: null });
    try {
      const response = await apiClient.get(`/chat/sessions/${userId}`);
      const sessions = response.data.sessions.map(parseSessionFromApi);
      set({ sessions, isLoadingSessions: false });
    } catch (error: any) {
      console.error('Failed to load sessions:', error);
      set({ 
        error: error.response?.data?.error || 'Failed to load sessions',
        isLoadingSessions: false 
      });
    }
  },

  loadSession: async (sessionId: string) => {
    set({ isLoadingMessages: true, error: null });
    try {
      const response = await apiClient.get(`/chat/session/${sessionId}`);
      const session = parseSessionFromApi(response.data.session);
      set({ 
        currentSession: session,
        messages: session.messages || [],
        isLoadingMessages: false 
      });
    } catch (error: any) {
      console.error('Failed to load session:', error);
      set({ 
        error: error.response?.data?.error || 'Failed to load session',
        isLoadingMessages: false 
      });
    }
  },

  createSession: async (title?: string) => {
    set({ error: null });
    try {
      const response = await apiClient.post('/chat/session', { title });
      const session = parseSessionFromApi(response.data.session);
      set(state => ({ 
        sessions: [session, ...state.sessions],
        currentSession: session,
        messages: []
      }));
      return session;
    } catch (error: any) {
      console.error('Failed to create session:', error);
      set({ error: error.response?.data?.error || 'Failed to create session' });
      return null;
    }
  },

  deleteSession: async (sessionId: string) => {
    set({ error: null });
    try {
      await apiClient.delete(`/chat/session/${sessionId}`);
      set(state => ({
        sessions: state.sessions.filter(s => s.session_id !== sessionId),
        currentSession: state.currentSession?.session_id === sessionId 
          ? null 
          : state.currentSession,
        messages: state.currentSession?.session_id === sessionId 
          ? [] 
          : state.messages
      }));
      return true;
    } catch (error: any) {
      console.error('Failed to delete session:', error);
      set({ error: error.response?.data?.error || 'Failed to delete session' });
      return false;
    }
  },

  setCurrentSession: (session: ChatSession | null) => {
    set({ currentSession: session, messages: session?.messages || [] });
  },

  getOrCreateTodaySession: async (userId: number) => {
    const { sessions, loadSessions, createSession } = get();
    
    // Load sessions if not loaded
    if (sessions.length === 0) {
      await loadSessions(userId);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find session from today
    const updatedSessions = get().sessions;
    const todaySession = updatedSessions.find(session => {
      const sessionDate = new Date(session.created_at);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime() && session.is_active;
    });

    if (todaySession) {
      await get().loadSession(todaySession.session_id);
      return todaySession;
    }

    // Create new session if none exists for today
    return await createSession();
  },

  // ============================================================================
  // Message Management Actions
  // ============================================================================

  sendMessage: async (content: string) => {
    const { isStreaming, queueMessage, currentSession, addMessage, startStreaming } = get();

    // If currently streaming, queue the message
    if (isStreaming) {
      queueMessage(content);
      return;
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Start streaming state
    startStreaming();

    // Create or reuse SSE handler
    let handler = get().sseHandler;
    if (!handler) {
      handler = createChatSSEHandler(
        {
          onToken: (token) => get().appendStreamingContent(token),
          onSessionId: (sessionId) => {
            const session = get().currentSession;
            if (!session) {
              set({
                currentSession: {
                  session_id: sessionId,
                  user_id: 0,
                  created_at: new Date(),
                  updated_at: new Date(),
                  is_active: true,
                } as ChatSession
              });
            }
            handler?.setSessionId(sessionId);
          },
          onDone: (diaryIds, action) => get().finishStreaming(diaryIds, action),
          onError: (error, partialContent) => get().handleStreamError(error, partialContent),
        },
        currentSession?.session_id
      );
      set({ sseHandler: handler });
    } else if (currentSession?.session_id) {
      handler.setSessionId(currentSession.session_id);
    }

    await handler.sendMessage(content);
  },

  addMessage: (message: Message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  abortMessage: () => {
    const handler = get().sseHandler;
    if (handler) {
      handler.abort();
    }
    set({
      isStreaming: false,
      isTyping: false,
      streamingContent: '',
    });
  },

  // ============================================================================
  // Streaming Actions
  // ============================================================================

  startStreaming: () => {
    set({ 
      isStreaming: true, 
      isTyping: true, 
      streamingContent: '',
      error: null 
    });
  },

  appendStreamingContent: (token: string) => {
    set(state => ({
      streamingContent: state.streamingContent + token,
      isTyping: false, // First token received, stop typing indicator
    }));
  },

  finishStreaming: (diaryIds?: number[], action?: MessageAction) => {
    const { streamingContent, processQueue } = get();
    
    // Create assistant message from streamed content
    const assistantMessage: Message = {
      id: generateMessageId(),
      role: 'assistant',
      content: streamingContent,
      timestamp: new Date(),
      relatedDiaries: diaryIds?.map(id => ({
        diary_id: id,
        title: '',
        date: '',
        relevanceScore: 0,
      })),
      action: action,  // CTA 액션 추가
    };

    set(state => ({
      messages: [...state.messages, assistantMessage],
      isStreaming: false,
      isTyping: false,
      streamingContent: '',
    }));

    // Process any queued messages
    processQueue();
  },

  handleStreamError: (error: string, partialContent?: string) => {
    const { streamingContent, processQueue } = get();
    const content = partialContent || streamingContent;

    // If there's partial content, save it as a message with error indicator
    if (content && content.trim().length > 0) {
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: content + '\n\n[응답이 중단되었습니다]',
        timestamp: new Date(),
      };

      set(state => ({
        messages: [...state.messages, assistantMessage],
        isStreaming: false,
        isTyping: false,
        streamingContent: '',
        error,
      }));
    } else {
      // No partial content - show a friendly error message
      const errorMessage = getErrorMessage(error);
      set({
        isStreaming: false,
        isTyping: false,
        streamingContent: '',
        error: errorMessage,
      });
    }

    // Process any queued messages
    get().processQueue();
  },

  // ============================================================================
  // Queue Management Actions
  // ============================================================================

  queueMessage: (content: string) => {
    set(state => ({
      messageQueue: [...state.messageQueue, { content, timestamp: new Date() }]
    }));
  },

  processQueue: async () => {
    const { messageQueue, sendMessage } = get();
    
    if (messageQueue.length === 0) return;

    // Get the first queued message
    const [nextMessage, ...remainingQueue] = messageQueue;
    set({ messageQueue: remainingQueue });

    // Send the queued message
    await sendMessage(nextMessage.content);
  },

  // ============================================================================
  // Error Handling Actions
  // ============================================================================

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // ============================================================================
  // Reset Action
  // ============================================================================

  reset: () => {
    // Abort any ongoing SSE request
    const handler = get().sseHandler;
    if (handler) {
      handler.abort();
    }
    
    set({
      currentSession: null,
      sessions: [],
      isLoadingSessions: false,
      messages: [],
      isLoadingMessages: false,
      isStreaming: false,
      isTyping: false,
      streamingContent: '',
      sseHandler: null,
      messageQueue: [],
      error: null,
    });
  },
}));

// ============================================================================
// Selectors (for optimized re-renders)
// ============================================================================

export const selectCurrentSession = (state: ChatState) => state.currentSession;
export const selectMessages = (state: ChatState) => state.messages;
export const selectIsStreaming = (state: ChatState) => state.isStreaming;
export const selectIsTyping = (state: ChatState) => state.isTyping;
export const selectStreamingContent = (state: ChatState) => state.streamingContent;
export const selectError = (state: ChatState) => state.error;
export const selectMessageQueue = (state: ChatState) => state.messageQueue;
