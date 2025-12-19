import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuthStore } from "../hooks/stores/use-auth-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import WritingImage from "../Image/Banner.png"

interface BannerProps {
  className?: string
}

const Banner: React.FC<BannerProps> = ({ className }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <section
      className={cn(
        "w-full bg-background overflow-hidden",
        "py-12 sm:py-16 lg:py-20",
        className
      )}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="violet"
                className="mb-4 sm:mb-6 text-xs sm:text-sm tracking-wider"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Daily Mood Diary with Maegeul
              </Badge>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground/80 mb-2 sm:mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              나를 돌보는 하루 5분 습관
            </motion.p>

            {/* Main Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              마음챙김 글쓰기
              <br />
              <span className="text-primary">매글</span>과 시작해요
            </motion.h1>

            {/* Description */}
            <motion.div
              className="max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground/80">
                  매일 글로 기록하는 나의 감정, 매글과 함께 시작하는 하루 기록
                </span>
                <br className="hidden sm:block" />
                <span className="hidden sm:inline">
                  바쁜 일상을 살다보면 나의 기분과 감정을 돌볼 시간이 부족해요.
                </span>
                <br className="hidden sm:block" />
                매글에선 5분만에 오늘의 무드 진단과 일기 작성까지 가능해요!
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="violet"
                size="xl"
                className="w-full sm:w-auto gap-2 group"
                asChild
              >
                <Link to={isAuthenticated ? "/maegeul" : "/mainsignup"}>
                  지금 바로 시작하기
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto gap-2 text-muted-foreground hover:text-foreground"
              >
                <BookOpen className="w-4 h-4" />
                이용 가이드 보기
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  5분
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  하루 투자 시간
                </p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  AI
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  감정 분석
                </p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  무료
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  시작하기
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="w-full lg:w-[480px] flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              {/* 배경 장식 */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent rounded-3xl blur-2xl" />

              {/* 이미지 컨테이너 */}
              <div
                className={cn(
                  "relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[560px]",
                  "rounded-2xl lg:rounded-3xl overflow-hidden",
                  "shadow-2xl shadow-primary/10",
                  "ring-1 ring-border/50"
                )}
              >
                <img
                  src={WritingImage}
                  alt="매글 - 마음챙김 글쓰기"
                  className="w-full h-full object-cover"
                />

                {/* 오버레이 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* 플로팅 카드 */}
              <motion.div
                className={cn(
                  "absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6",
                  "bg-card/95 backdrop-blur-sm",
                  "rounded-xl sm:rounded-2xl shadow-xl",
                  "p-3 sm:p-4 border border-border/50"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      AI 감정 분석
                    </p>
                    <p className="text-xs text-muted-foreground">
                      맞춤형 피드백 제공
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Banner
