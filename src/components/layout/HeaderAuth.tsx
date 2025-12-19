import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../hooks/stores/use-auth-store"
import { useThemeStore } from "../../hooks/stores/use-theme-store"
import { AccountPopover } from "../../layouts/components/account-popover"
import { Iconify } from "../../dashboardComponents/iconify"
import { ThemeProvider } from "../../theme/theme-provider"
import { Button } from "@/components/ui/button"

interface HeaderAuthProps {
  isAuthenticated: boolean
}

export function HeaderAuth({ isAuthenticated }: HeaderAuthProps) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const setUser = useAuthStore((state) => state.setUser)
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode)

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate("/")
    window.location.reload()
  }

  if (isAuthenticated) {
    return (
      <ThemeProvider>
        <div className="flex items-center gap-2 sm:gap-3">
          <AccountPopover
            data={[
              {
                label: "마이매글",
                href: "/dashboard",
                icon: (
                  <Iconify width={22} icon="solar:home-angle-bold-duotone" />
                ),
              },
              {
                label: "다크모드",
                href: "#",
                icon: (
                  <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />
                ),
                onclick: toggleDarkMode,
              },
              {
                label: "회원정보수정",
                href: "#",
                icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
              },
            ]}
          />
          <Button variant="violet-outline" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/mainlogin">로그인</Link>
      </Button>
      <Button variant="violet" size="sm" asChild>
        <Link to="/mainsignup">회원가입</Link>
      </Button>
    </div>
  )
}
