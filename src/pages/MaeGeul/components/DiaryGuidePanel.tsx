import React from 'react'
import { motion } from 'framer-motion'
import letter from '../../../Image/letter.png'
import postbox from '../../../Image/postbox.png'
import heart from '../../../Image/heart.png'

interface DiaryGuidePanelProps {
  emotionResult: string | null
  userName?: string
  colorName: string
  highlightedColor: string | null
  highlightedLabels: string[]
  onLabelClick: (label: string) => void
  onSaveAi: () => void
}

export function DiaryGuidePanel({
  emotionResult,
  userName,
  colorName,
  highlightedColor,
  highlightedLabels,
  onLabelClick,
  onSaveAi,
}: DiaryGuidePanelProps) {
  if (emotionResult) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="mx-auto text-scampi-950 font-plus-jakarta-sans font-extrabold text-xl dark:text-white mb-5"
      >
        <div className="User w-96 h-11 text-blue-950 font-bold text-xl leading-10 dark:text-white inline">
          {userName}님의 행복을 바라는 AI무디타의 편지{' '}
          <img src={letter} className="w-8 h-8 inline" alt="Letter" />
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
          className="BackgroundBorder relative p-5 mt-5 bg-white rounded-2xl border border-black/10 text-base before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-0 before:border-t-[15px] before:border-t-white before:border-l-[15px] before:border-l-transparent before:border-r-[15px] before:border-r-transparent before:border-b-0"
        >
          {emotionResult.split('\n').map((sentence, index) => (
            <p key={index} className="mb-2">
              {sentence}
            </p>
          ))}
        </motion.div>

        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center mt-5">
            <img src={postbox} className="w-20 h-20" alt="Postbox" />
          </div>

          <motion.button
            onClick={onSaveAi}
            className="rounded-xl border bg-violet-200 dark:bg-scampi-600 text-indigo-600 py-2 px-8 shadow-md
           hover:bg-transparent border-none dark:hover:bg-scampi-700 transition-colors
          font-bold font-plus-jakarta-sans leading-normal mt-3 text-lg"
          >
            편지 저장하기
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="User w-96 h-11 text-blue-950 font-bold text-2xl leading-10 dark:text-white mb-5">
      <div className="p-5 bg-white shadow-lg w-[550px] h-[670px] rounded-3xl">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-blue-950">
            {userName}님의 무드일기
            <img
              src={heart}
              alt="Heart"
              className="w-8 h-8 inline-block ml-2"
            />
          </h1>
        </div>

        <div className="p-5 border border-gray-200 rounded-xl mt-12">
          <h2 className="text-[22px] font-bold text-blue-950 mb-2">
            작성 안내
          </h2>
          <ul className="text-xs text-blue-950 space-y-1">
            <li>
              1. 감정을 느낀 구체적인 "상황"과 그 때 나의 "행동", "생각"을
              포함해 적어보세요.
            </li>
            <li>
              2. 하루를 회고하며 나의 감정을 중심으로 3줄 이상 적어보는 것을
              추천드려요.
            </li>
            <li>
              3. 감정을 느꼈을 때 나의 신체적 변화에 대해서 적어보는 것도
              도움이 되어요.
            </li>
          </ul>
        </div>

        <div className="p-5 border border-gray-200 rounded-xl mt-5">
          <h2 className="text-xl font-bold text-blue-950 mb-2">
            오늘의 무드 진단
          </h2>
          <div className="text-sm text-blue-950">
            <p className="mb-4">
              무드 컬러: {colorName}
              {highlightedColor && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    marginLeft: '5px',
                    backgroundColor: highlightedColor,
                    borderRadius: '3px',
                    verticalAlign: 'middle',
                  }}
                />
              )}
            </p>

            <div className="flex items-center mb-4">
              <p className="mr-2 whitespace-nowrap">무드 태그:</p>
              <div className="flex flex-wrap">
                {highlightedLabels.map((label) => (
                  <span
                    key={label}
                    onClick={() => onLabelClick(label)}
                    className="text-sm text-blue-950 dark:text-scampi-200 py-1 px-2 rounded-lg cursor-pointer transition-colors ml-1"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#E9E3FF',
                      color: '#333',
                      padding: '4px 8px',
                    }}
                  >
                    #{label}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-blue-950 mb-5">
              💭 감정 키워드를 선택하면 제목에 무드태그를 걸 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
