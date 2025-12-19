import React from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, Home, LayoutDashboard, Sparkles, Mail } from "lucide-react"

interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const goToDashboard = () => {
    navigate("/dashboard")
    onClose()
  }

  const goToHome = () => {
    navigate("/home")
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative z-[10000] w-full max-w-md my-4",
            "bg-card rounded-2xl shadow-2xl",
            "max-h-[90vh] overflow-y-auto"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 장식 */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-violet-500 to-primary" />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4 p-2 rounded-full",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted transition-colors"
            )}
          >
            <X size={18} />
          </button>

          {/* 내용 */}
          <div className="p-6 sm:p-8 text-center">
            {/* 아이콘 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <Mail className="w-8 h-8 text-primary" />
            </motion.div>

            {/* 제목 */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl font-bold text-primary mb-2"
            >
              AI무디타의 편지가 저장되었습니다!
            </motion.h2>

            {/* 설명 */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-6 flex items-center justify-center gap-1"
            >
              매글과 함께 마음지도를 채워가보세요
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </motion.p>

            {/* 버튼 그룹 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                onClick={goToHome}
                variant="outline"
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                홈으로
              </Button>
              <Button
                onClick={goToDashboard}
                variant="violet"
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                마이매글
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default SaveModal
