import React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  path: string
  requiresAuth: boolean
  modalMessage?: string
}

interface HeaderNavProps {
  isAuthenticated: boolean
  onAuthRequired: (message: string) => void
  isMobile?: boolean
  onNavClick?: () => void
}

const navItems: NavItem[] = [
  {
    label: "AI 하루진단",
    path: "/maegeul",
    requiresAuth: true,
    modalMessage: "무드 일기는 로그인 후 이용 할 수 있어요.",
  },
  {
    label: "마이매글",
    path: "/dashboard",
    requiresAuth: true,
    modalMessage: "마이매글은 로그인 후 이용 할 수 있어요.",
  },
]

export function HeaderNav({
  isAuthenticated,
  onAuthRequired,
  isMobile = false,
  onNavClick,
}: HeaderNavProps) {
  const handleClick = (item: NavItem) => {
    if (!isAuthenticated && item.requiresAuth && item.modalMessage) {
      onAuthRequired(item.modalMessage)
    } else if (onNavClick) {
      onNavClick()
    }
  }

  const navClassName = isMobile
    ? "flex flex-col space-y-4 py-4"
    : "hidden md:flex flex-grow justify-center space-x-8 lg:space-x-12 text-sm"

  const linkClassName = cn(
    "relative py-2 text-foreground/80 hover:text-primary transition-colors font-medium",
    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300",
    "hover:after:w-full"
  )

  return (
    <nav className={navClassName}>
      {navItems.map((item) =>
        isAuthenticated || !item.requiresAuth ? (
          <Link
            key={item.label}
            to={item.path}
            className={linkClassName}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </Link>
        ) : (
          <span
            key={item.label}
            className={cn(linkClassName, "cursor-pointer")}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </span>
        )
      )}
    </nav>
  )
}
