import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuthStore } from "../hooks/stores/use-auth-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowRight, Sparkles, PenLine, LayoutDashboard } from "lucide-react"
import ImageSrc1 from "../Image/01.jpeg"
import ImageSrc2 from "../Image/02.jpeg"
import ImageSrc3 from "../Image/03.jpeg"
import ImageSrc4 from "../Image/04.jpeg"

const Contents: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const cardContents = [
    {
      title: "자기 계발",
      text: "더 단단한 나를 만드는 일상 실천 콘텐츠",
      tag: ["독서하기", "외국어 배우기", "전공 공부하기", "버킷리스트 실천"],
      src: ImageSrc1,
      color: "from-violet-500/80 to-purple-600/80",
    },
    {
      title: "자기 관리",
      text: "건강한 루틴으로 시작하는 하루",
      tag: ["일정한 수면", "감사일기", "정리정돈", "명상·호흡"],
      src: ImageSrc2,
      color: "from-blue-500/80 to-indigo-600/80",
    },
    {
      title: "취미 활동",
      text: "나를 위한 즐거운 시간 만들기",
      tag: ["맛있는 음식", "영화·드라마", "그림그리기", "음악 듣기"],
      src: ImageSrc3,
      color: "from-pink-500/80 to-rose-600/80",
    },
    {
      title: "건강",
      text: "몸과 마음의 균형 찾기",
      tag: ["스트레칭", "운동하기", "건강식품", "체중조절"],
      src: ImageSrc4,
      color: "from-emerald-500/80 to-teal-600/80",
    },
  ]

  return (
    <>
      {/* 카드 컨텐츠 섹션 */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="violet" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              맞춤 루틴 추천
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-3 sm:mb-4">
              마음돌봄을 위한 루틴추천
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              감정 기록을 바탕으로 요즘 나에게 필요한
              <br className="sm:hidden" />
              자기돌봄 루틴 콘텐츠를 추천해드릴게요.
            </p>
          </motion.div>

          {/* 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {cardContents.map((content, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  title={content.title}
                  text={content.text}
                  tag={content.tag}
                  src={content.src}
                  color={content.color}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-violet-500/5 to-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className={cn(
              "relative overflow-hidden",
              "bg-gradient-to-r from-primary to-violet-600",
              "rounded-2xl sm:rounded-3xl",
              "p-6 sm:p-8 lg:p-12",
              "shadow-xl shadow-primary/20"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              {/* 텍스트 */}
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-2">
                  나를 돌보는 하루 5분 마음챙김
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-white/90 font-medium">
                  매글에서 지금 바로 시작해보세요.
                </p>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full sm:w-auto",
                    "bg-white/10 border-white/30 text-white",
                    "hover:bg-white hover:text-primary",
                    "backdrop-blur-sm"
                  )}
                  asChild
                >
                  <Link
                    to={isAuthenticated ? "/maegeul" : "/mainsignup"}
                    className="gap-2"
                  >
                    <PenLine className="w-4 h-4" />
                    {isAuthenticated ? "글 쓰러 가기" : "지금 바로 시작하기"}
                  </Link>
                </Button>

                <Button
                  size="lg"
                  className={cn(
                    "w-full sm:w-auto",
                    "bg-white text-primary",
                    "hover:bg-white/90",
                    "shadow-lg"
                  )}
                  asChild
                >
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/mainsignup"}
                    className="gap-2"
                  >
                    {isAuthenticated ? (
                      <>
                        <LayoutDashboard className="w-4 h-4" />
                        마이매글
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        회원가입 하기
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

interface CardProps {
  title: string
  text: string
  tag: string[]
  src: string
  color: string
}

const Card: React.FC<CardProps> = ({ title, text, tag, src, color }) => {
  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl sm:rounded-2xl",
        "aspect-[16/10] sm:aspect-[16/9]",
        "cursor-pointer"
      )}
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${src})` }}
      />

      {/* 기본 오버레이 */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t",
          color,
          "opacity-70 transition-opacity duration-500 group-hover:opacity-0"
        )}
      />

      {/* 기본 콘텐츠 */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white transition-opacity duration-500 group-hover:opacity-0">
        <h3 className="text-lg sm:text-xl font-bold mb-1">{title}</h3>
        <p className="text-xs sm:text-sm text-white/90">{text}</p>
      </div>

      {/* 호버 오버레이 */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-white/95 dark:bg-gray-900/95",
          "opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        )}
      />

      {/* 호버 콘텐츠 */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
            {title}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tag.map((t, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-normal"
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <Button variant="violet" size="sm" className="self-start gap-2 mt-4">
          콘텐츠 탐색하기
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

export default Contents
