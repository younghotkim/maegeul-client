import React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Heart } from "lucide-react"
import Logo from "../logo/main_logo.png"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

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
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Seoul
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
