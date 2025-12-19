import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import mainLogo from "../logo/main_logo.png"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  message: React.ReactNode
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal Content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md mx-4",
          "bg-card rounded-2xl shadow-2xl",
          "p-8 text-center font-plus-jakarta-sans",
          "animate-in zoom-in-95 fade-in duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-1 rounded-full",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-muted transition-colors"
          )}
          aria-label="닫기"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="mb-6">
          <img
            src={mainLogo}
            className="w-20 h-20 mx-auto drop-shadow-lg"
            alt="Maegeul Logo"
          />
        </div>

        {/* Message */}
        <p className="text-lg font-semibold text-foreground mb-8">{message}</p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <Button variant="violet-outline" size="lg" asChild>
            <Link to="/mainlogin">로그인</Link>
          </Button>
          <Button variant="violet" size="lg" asChild>
            <Link to="/mainsignup">회원가입</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Modal
