import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../hooks/stores/use-auth-store"
import { HeaderNav } from "./layout/HeaderNav"
import { HeaderAuth } from "./layout/HeaderAuth"
import Modal from "./Modal"
import Logo from "../logo/main_logo.png"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const openModal = (message: string) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalMessage("")
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full font-plus-jakarta-sans",
        "bg-background/80 backdrop-blur-lg",
        "border-b border-border/40"
      )}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <img
              src={Logo}
              alt="Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105"
            />
            <span className="text-foreground text-lg sm:text-xl font-bold tracking-wider">
              maegeul
            </span>
          </Link>

          {/* Desktop Navigation */}
          <HeaderNav
            isAuthenticated={isAuthenticated}
            onAuthRequired={openModal}
          />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">
            <HeaderAuth isAuthenticated={isAuthenticated} />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 border-t border-border/40">
            <HeaderNav
              isAuthenticated={isAuthenticated}
              onAuthRequired={openModal}
              isMobile
              onNavClick={closeMobileMenu}
            />
            <div className="mt-4 pt-4 border-t border-border/40">
              <HeaderAuth isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />
    </header>
  )
}

export default Header
