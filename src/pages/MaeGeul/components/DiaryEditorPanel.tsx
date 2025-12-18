import React from 'react'
import { motion } from 'framer-motion'

interface DiaryEditorPanelProps {
  title: string
  formattedDate: string
  content: string
  userName?: string
  maxLength: number
  isContentEditable: boolean
  isButtonVisible: boolean
  isValid: boolean
  onContentChange: (content: string) => void
  onComplete: () => void
}

export function DiaryEditorPanel({
  title,
  formattedDate,
  content,
  userName,
  maxLength,
  isContentEditable,
  isButtonVisible,
  isValid,
  onContentChange,
  onComplete,
}: DiaryEditorPanelProps) {
  return (
    <motion.div
      className="w-1/2 h-full p-8 bg-violet-100 rounded-3xl shadow-md dark:bg-gray-700 flex flex-col justify-between"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      style={{ transformOrigin: 'center left' }}
    >
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="User w-120 h-11 text-blue-950 font-bold text-xl dark:text-white">
            {title}
          </div>
        </div>
        <div className="text-sm text-neutral-500 mt-2 flex justify-end">
          작성 시간: {formattedDate}
        </div>
        <textarea
          className="w-full h-[370px] bg-violet-100 text-[16px] mt-4 p-4 border border-transparent rounded-lg resize-none dark:bg-gray-600 dark:text-white"
          placeholder={`${
            userName || ''
          }님의 오늘 하루는 어떠셨나요?\n오늘 하루에 대해 열 글자 이상 적어보아요!`}
          maxLength={maxLength}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          disabled={!isContentEditable}
        />
        <div className="flex justify-end text-xs text-gray-600 dark:text-gray-400">
          글자수: {content.length} / {maxLength}
        </div>
      </div>

      <div className="flex space-x-4 mt-4 justify-end mb-10">
        {isButtonVisible && (
          <button
            onClick={onComplete}
            className={`rounded-xl border bg-violet-200 dark:bg-scampi-600 text-indigo-600 py-2 px-6 shadow-md
          hover:bg-transparent border-none dark:hover:bg-scampi-700 transition-colors
          font-bold font-plus-jakarta-sans leading-normal ${
            isValid ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
          }`}
            disabled={!isValid}
          >
            작성 완료
          </button>
        )}
      </div>
    </motion.div>
  )
}
