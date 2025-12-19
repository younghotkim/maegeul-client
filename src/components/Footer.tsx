import React, { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Heart, Sparkles } from "lucide-react"
import Logo from "../logo/main_logo.png"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const [showCredits, setShowCredits] = useState(false)

  const developers = ["이승연", "최성환", "김현우", "김영하", "박세양"]

  const footerLinks = [
    { label: "서비스 소개", href: "#" },
    { label: "이용약관", href: "#" },
    { label: "개인정보처리방침", href: "#" },
    { label: "고객센터", href: "#" },
  ]

  return (
    <footer className="w-full bg-muted/30 dark:bg-gray-900/50 border-t border-border/50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            {/* Logo & Description */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <img src={Logo} alt="Maegeul" className="w-8 h-8" />
                <span className="text-xl font-bold text-foreground tracking-wide">
                  maegeul
                </span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                매일 글로 기록하는 나의 감정,
                <br className="hidden sm:block" />
                마음챙김 글쓰기 매글
              </p>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    "text-sm text-muted-foreground",
                    "hover:text-foreground transition-colors",
                    "whitespace-nowrap"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Contact Info */}
            <div className="flex flex-col items-center lg:items-end gap-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    서울특별시 강남구 역삼로 160
                  </span>
                </span>
                <span className="hidden sm:block text-border">|</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">070-4112-2308</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Copyright */}
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>© {currentYear} Litme Team. All rights reserved.</span>
            <span className="hidden sm:flex items-center gap-1">
              <span>•</span>
              {/* 이스터에그: hover/click으로 개발자 크레딧 표시 */}
              <span 
                className="relative flex items-center gap-1 cursor-pointer group"
                onMouseEnter={() => setShowCredits(true)}
                onMouseLeave={() => setShowCredits(false)}
                onClick={() => setShowCredits(!showCredits)}
              >
                <span className="flex items-center gap-1">
                  Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 group-hover:animate-pulse" /> in Seoul
                </span>
                
                {/* 크레딧 팝업 */}
                <div 
                  className={cn(
                    "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                    "px-4 py-3 rounded-xl shadow-lg",
                    "bg-white dark:bg-gray-800 border border-violet-200 dark:border-violet-800",
                    "transition-all duration-300 ease-out",
                    showCredits 
                      ? "opacity-100 translate-y-0 pointer-events-auto" 
                      : "opacity-0 translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-2 text-violet-600 dark:text-violet-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold whitespace-nowrap">Built by</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {developers.map((name, i) => (
                      <span 
                        key={name}
                        className="px-2 py-0.5 text-xs rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 whitespace-nowrap"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  {/* 화살표 */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                    <div className="border-8 border-transparent border-t-white dark:border-t-gray-800" />
                  </div>
                </div>
              </span>
            </span>
          </div>
          
          {/* 모바일용 이스터에그 */}
          <div 
            className="sm:hidden flex items-center justify-center mt-2 cursor-pointer"
            onClick={() => setShowCredits(!showCredits)}
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Seoul
            </span>
          </div>
          
          {/* 모바일 크레딧 표시 */}
          <div 
            className={cn(
              "sm:hidden overflow-hidden transition-all duration-300",
              showCredits ? "max-h-20 opacity-100 mt-3" : "max-h-0 opacity-0"
            )}
          >
            <div className="flex flex-wrap justify-center gap-1.5">
              {developers.map((name) => (
                <span 
                  key={name}
                  className="px-2 py-0.5 text-xs rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
