/**
 * ChatMessage Component
 * Individual message rendering with user/assistant styling
 * Validates: Requirements 1.5, 8.3
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { BookOpen, PenLine, LayoutDashboard, ArrowRight } from 'lucide-react';
import type { Message, DiaryReference, MessageAction } from '../../hooks/stores/use-chat-store';
import { MuditaAvatar } from './MuditaAvatar';

// Set Korean locale
dayjs.locale('ko');

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  isTyping?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
  isTyping = false,
}) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0">
          <MuditaAvatar size="sm" isActive={isStreaming || isTyping} />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-md'
              : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
          }`}
        >
          {/* Typing Indicator */}
          {isTyping && !message.content ? (
            <TypingIndicator />
          ) : (
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
              {/* Streaming cursor */}
              {isStreaming && message.content && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 align-middle"
                />
              )}
            </div>
          )}
        </div>

        {/* CTA Action Button */}
        {isAssistant && message.action && !isStreaming && (
          <CTAButton action={message.action} />
        )}

        {/* Diary References */}
        {isAssistant && message.relatedDiaries && message.relatedDiaries.length > 0 && (
          <DiaryReferences diaries={message.relatedDiaries} />
        )}

        {/* Timestamp */}
        {!isStreaming && (
          <span className="text-xs text-gray-400 mt-1 px-1">
            {dayjs(message.timestamp).format('A h:mm')}
          </span>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Typing Indicator Component
 * Validates: Requirements 8.3
 */
const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-violet-400 rounded-full"
        animate={{
          y: [0, -6, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

/**
 * CTA Button Component
 * Renders action buttons for diary writing, dashboard, etc.
 */
const CTAButton: React.FC<{ action: MessageAction }> = ({ action }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (action.type) {
      case 'write_diary':
        return <PenLine className="w-4 h-4" />;
      case 'view_dashboard':
        return <LayoutDashboard className="w-4 h-4" />;
      case 'view_diary':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  const handleClick = () => {
    navigate(action.path);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      onClick={handleClick}
      className="mt-2 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
    >
      {getIcon()}
      <span>{action.label}</span>
      <ArrowRight className="w-3 h-3" />
    </motion.button>
  );
};

/**
 * Diary References Component
 * Shows related diary entries referenced in the response
 */
const DiaryReferences: React.FC<{ diaries: DiaryReference[] }> = ({ diaries }) => {
  if (diaries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-2 flex flex-wrap gap-1.5"
    >
      {diaries.slice(0, 3).map((diary) => (
        <div
          key={diary.diary_id}
          className="flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-600 rounded-full text-xs"
        >
          <BookOpen className="w-3 h-3" />
          <span className="truncate max-w-[100px]">
            {diary.title || diary.date || `일기 #${diary.diary_id}`}
          </span>
        </div>
      ))}
      {diaries.length > 3 && (
        <div className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
          +{diaries.length - 3}개 더
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
