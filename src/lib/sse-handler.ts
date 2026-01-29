/**
 * SSE Handler for Mudita Bot Chat
 * Handles Server-Sent Events for streaming chat responses
 * Validates: Requirements 8.1, 8.2, 8.3
 */

import type { MessageAction } from '../hooks/stores/use-chat-store';

// ============================================================================
// Types
// ============================================================================

export interface SSECallbacks {
  onToken: (token: string) => void;
  onSessionId: (sessionId: string) => void;
  onDone: (diaryIds: number[], action?: MessageAction) => void;
  onError: (error: string, partialContent?: string) => void;
}

export interface SSEOptions {
  baseUrl: string;
  token: string;
  sessionId?: string;
}

// ============================================================================
// SSE Event Types
// ============================================================================

export type SSEEventType = 'session' | 'token' | 'done' | 'error';

export interface SSESessionEvent {
  session_id: string;
}

export interface SSETokenEvent {
  token: string;
}

export interface SSEDoneEvent {
  message_id: string;
  diary_ids: number[];
  action?: MessageAction;
}

export interface SSEErrorEvent {
  error: string;
  partial_content?: string;
}

// ============================================================================
// SSE Handler Class
// ============================================================================

export class ChatSSEHandler {
  private abortController: AbortController | null = null;
  private callbacks: SSECallbacks;
  private options: SSEOptions;

  constructor(options: SSEOptions, callbacks: SSECallbacks) {
    this.options = options;
    this.callbacks = callbacks;
  }

  /**
   * Send a message and handle the streaming response
   * Validates: Requirements 8.1, 8.2, 9.3
   */
  async sendMessage(message: string): Promise<void> {
    // Cancel any existing request
    this.abort();

    this.abortController = new AbortController();

    try {
      const url = `${this.options.baseUrl}/chat/message`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.options.token}`,
        },
        body: JSON.stringify({
          message,
          session_id: this.options.sessionId,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      await this.processStream(response.body);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was aborted, don't report as error
        return;
      }
      
      // Handle network errors with retry suggestion
      let errorMessage = error.message || 'Failed to send message';
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Unable to connect to the AI service. Please try again.';
      }
      
      this.callbacks.onError(errorMessage);
    }
  }

  /**
   * Process the SSE stream
   * Validates: Requirements 8.1, 8.2
   */
  private async processStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentEventType: SSEEventType | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();

          // Parse event type
          if (trimmedLine.startsWith('event:')) {
            currentEventType = trimmedLine.slice(6).trim() as SSEEventType;
            continue;
          }

          // Parse data
          if (trimmedLine.startsWith('data:')) {
            const data = trimmedLine.slice(5).trim();
            this.handleEventData(currentEventType, data);
            currentEventType = null;
            continue;
          }

          // Handle retry directive
          if (trimmedLine.startsWith('retry:')) {
            // Retry interval - we can ignore this for now
            continue;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Handle parsed SSE event data
   */
  private handleEventData(eventType: SSEEventType | null, data: string): void {
    try {
      const parsed = JSON.parse(data);

      switch (eventType) {
        case 'session':
          if (parsed.session_id) {
            this.callbacks.onSessionId(parsed.session_id);
          }
          break;

        case 'token':
          if (parsed.token !== undefined) {
            this.callbacks.onToken(parsed.token);
          }
          break;

        case 'done':
          this.callbacks.onDone(parsed.diary_ids || [], parsed.action);
          break;

        case 'error':
          this.callbacks.onError(parsed.error, parsed.partial_content);
          break;

        default:
          // Handle data without explicit event type
          if (parsed.token !== undefined) {
            this.callbacks.onToken(parsed.token);
          } else if (parsed.diary_ids !== undefined) {
            this.callbacks.onDone(parsed.diary_ids, parsed.action);
          } else if (parsed.error !== undefined) {
            this.callbacks.onError(parsed.error, parsed.partial_content);
          } else if (parsed.session_id !== undefined) {
            this.callbacks.onSessionId(parsed.session_id);
          }
      }
    } catch (e) {
      // Ignore JSON parse errors for non-JSON data
    }
  }

  /**
   * Abort the current request
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Update the session ID for subsequent requests
   */
  setSessionId(sessionId: string): void {
    this.options.sessionId = sessionId;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a new SSE handler instance
 */
export function createChatSSEHandler(
  callbacks: SSECallbacks,
  sessionId?: string
): ChatSSEHandler {
  // Get auth token from localStorage
  let token = '';
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      token = parsed.state?.token || '';
    } catch (e) {
      console.error('Failed to parse auth storage:', e);
    }
  }

  const baseUrl = import.meta.env.VITE_API_URL || '';

  return new ChatSSEHandler(
    { baseUrl, token, sessionId },
    callbacks
  );
}
