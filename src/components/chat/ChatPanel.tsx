/**
 * ChatPanel Component
 * Slide-out panel for Mudita Bot chat interface
 * Validates: Requirements 5.2, 5.3, 5.4
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, ChevronDown, RotateCcw } from 'lucide-react';
import { useChatStore } from '../../hooks/stores/use-chat-store';
import { useAuthStore } from '../../hooks/stores/use-auth-store';
import { useRecentMood, generateWelcomeMessage } from '../../hooks/useRecentMood';
import { ChatMessage } from './ChatMessage';
import { MuditaAvatar } from './MuditaAvatar';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const user = useAuthStore((state) => state.user);
  const recentMood = useRecentMood(user?.user_id);
  const {
    messages,
    isStreaming,
    isTyping,
    streamingContent,
    isLoadingMessages,
    error,
    sendMessage,
    getOrCreateTodaySession,
    currentSession,
    clearMessages,
    createSession,
  } = useChatStore();

  // Load or create session when panel opens
  useEffect(() => {
    if (isOpen && user?.user_id && !currentSession) {
      getOrCreateTodaySession(user.user_id);
    }
  }, [isOpen, user?.user_id, currentSession, getOrCreateTodaySession]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    
    if (!trimmedInput || isStreaming) return;

    setInputValue('');
    await sendMessage(trimmedInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Handle reset conversation
  const handleResetConversation = async () => {
    clearMessages();
    setShowResetConfirm(false);
    // Create a new session
    await createSession();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
          />

          {/* Panel - adjusted height to not cover header */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-full sm:w-[380px] md:w-[400px] bg-white shadow-2xl z-50 flex flex-col rounded-tl-2xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b rounded-tl-2xl"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <MuditaAvatar size="sm" isActive={isStreaming} showStatus />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-base">무디타봇</h2>
                  <p className="text-white/70 text-xs">당신의 감정 동반자</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Reset button */}
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="대화 초기화"
                  title="대화 초기화"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="채팅 닫기"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Reset Confirmation Modal */}
            <AnimatePresence>
              {showResetConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center rounded-tl-2xl"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-5 mx-4 shadow-xl max-w-[280px]"
                  >
                    <h3 className="text-gray-800 font-semibold text-center mb-2">
                      대화를 초기화할까요?
                    </h3>
                    <p className="text-gray-500 text-sm text-center mb-4">
                      현재 대화 내용이 모두 삭제됩니다.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleResetConversation}
                        className="flex-1 py-2 px-4 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-colors text-sm"
                      >
                        초기화
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Container */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <WelcomeMessage 
                  userName={user?.profile_name} 
                  recentMood={recentMood}
                  onSuggestionClick={(suggestion) => {
                    setInputValue(suggestion);
                    inputRef.current?.focus();
                  }}
                />
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {/* Streaming message */}
                  {(isTyping || streamingContent) && (
                    <ChatMessage
                      message={{
                        id: 'streaming',
                        role: 'assistant',
                        content: streamingContent,
                        timestamp: new Date(),
                      }}
                      isStreaming={true}
                      isTyping={isTyping}
                    />
                  )}
                </>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50 transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="무디타봇에게 이야기해보세요..."
                    disabled={isStreaming}
                    rows={1}
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none resize-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    style={{ maxHeight: '120px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isStreaming}
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: inputValue.trim() && !isStreaming
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#e5e7eb',
                  }}
                >
                  {isStreaming ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Welcome message component with personalization
// Validates: Requirements 1.1
interface WelcomeMessageProps {
  userName?: string;
  recentMood?: ReturnType<typeof useRecentMood>;
  onSuggestionClick?: (suggestion: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  userName, 
  recentMood,
  onSuggestionClick 
}) => {
  const { greeting, subtext } = generateWelcomeMessage(userName, recentMood);
  
  const suggestions = [
    '오늘 기분이 좋아요',
    '요즘 힘들어요',
    '내 감정 패턴이 궁금해요',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center px-6"
    >
      <div className="relative mb-4">
        <MuditaAvatar size="xl" isActive />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-1 -right-1 text-2xl"
        >
          👋
        </motion.div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {greeting}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {subtext}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick?.(suggestion)}
            className="px-3 py-1.5 text-sm bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatPanel;
