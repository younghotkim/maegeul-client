import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../hooks/stores/use-auth-store'
import { HeaderNav } from './layout/HeaderNav'
import { HeaderAuth } from './layout/HeaderAuth'
import Modal from './Modal'
import Logo from '../logo/main_logo.png'
import { Menu, X } from 'lucide-react'

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const openModal = (message: string) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalMessage('')
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 font-plus-jakarta-sans">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
            <img src={Logo} alt="Logo" className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px]" />
            <span className="text-blue-950 dark:text-white text-lg sm:text-[24px] font-extrabold tracking-[0.22em]">
              maegeul
            </span>
          </Link>

          {/* Desktop Navigation */}
          <HeaderNav
            isAuthenticated={isAuthenticated}
            onAuthRequired={openModal}
          />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-blue-950 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">
            <HeaderAuth isAuthenticated={isAuthenticated} />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <HeaderNav
              isAuthenticated={isAuthenticated}
              onAuthRequired={openModal}
              isMobile
              onNavClick={closeMobileMenu}
            />
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <HeaderAuth isAuthenticated={isAuthenticated} />
            </div>
          </div>
        )}
      </div>

      {/* Login Required Modal */}
      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={closeModal}
      />
    </header>
  )
}

export default Header
