import React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Sparkles, Clock, Zap, Shield } from "lucide-react"

const ServiceFeatures: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: "5분 일기 모드",
      description: "오늘 하루를 돌아보며 감정을 글로 표현해보세요. AI가 당신의 마음을 분석해드려요.",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: Zap,
      title: "5초 퀵체크인",
      description: "바쁜 하루, 단 5초만에 무드미터로 감정을 기록하세요. 터치 한 번이면 끝!",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Shield,
      title: "안전한 암호화",
      description: "모든 일기는 bcrypt로 암호화되어 오직 본인만 볼 수 있어요.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      hasProof: true,
    },
  ]

  return (
    <>
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <motion.div
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="violet" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              매글만의 특별함
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-3 sm:mb-4">
              당신의 마음을 위한 <span className="text-primary">두 가지 방법</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              바쁜 일상 속에서도 나를 돌볼 수 있도록,
              <br className="sm:hidden" />
              상황에 맞는 기록 방식을 선택하세요.
            </p>
          </motion.div>

          {/* 특징 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative group rounded-2xl overflow-hidden",
                  "border border-border/50",
                  "shadow-sm hover:shadow-xl transition-all duration-300",
                  "hover:-translate-y-1",
                  feature.hasProof 
                    ? "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30" 
                    : "bg-white dark:bg-gray-900"
                )}
              >


                {/* 콘텐츠 */}
                <div className="relative p-6 sm:p-8">
                  {/* 아이콘 */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-5",
                    feature.bgColor
                  )}>
                    <feature.icon className={cn("w-7 h-7", feature.iconColor)} />
                  </div>

                  {/* 텍스트 */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* 암호화 증거 이미지 */}
                  {feature.hasProof && (
                    <div className="mt-4">
                      {/* 이미지 프레임 */}
                      <div className={cn(
                        "relative rounded-lg overflow-hidden",
                        "border-2 border-emerald-200 dark:border-emerald-800",
                        "shadow-sm",
                        "bg-gray-900"
                      )}>
                        {/* 브라우저 탭 바 */}
                        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-800 border-b border-gray-700">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="ml-2 text-[8px] text-gray-400 truncate">Database - bcrypt hash</span>
                        </div>
                        {/* 실제 이미지 */}
                        <img 
                          src="/assets/images/bycrpt.png" 
                          alt="bcrypt 암호화 증거" 
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      {/* 설명 */}
                      <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>실제 DB 저장 모습 - 관리자도 원본을 볼 수 없어요</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 호버 그라데이션 효과 (암호화 카드 제외) */}
                {!feature.hasProof && (
                  <div className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "bg-gradient-to-br pointer-events-none",
                    feature.color,
                    "opacity-0 group-hover:opacity-[0.03]"
                  )} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ServiceFeatures
