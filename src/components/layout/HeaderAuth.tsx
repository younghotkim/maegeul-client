import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../hooks/stores/use-auth-store'
import { useThemeStore } from '../../hooks/stores/use-theme-store'
import { AccountPopover } from '../../layouts/components/account-popover'
import { Iconify } from '../../dashboardComponents/iconify'
import { ThemeProvider } from '../../theme/theme-provider'

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
    navigate('/')
    window.location.reload()
  }

  const buttonClassName =
    'bg-violet-100 hover:bg-violet-300 dark:bg-scampi-600 py-2 px-3 sm:px-4 rounded-lg shadow-md dark:hover:bg-scampi-700 transition-colors text-indigo-600 dark:text-white text-xs sm:text-sm font-extrabold whitespace-nowrap'

  if (isAuthenticated) {
    return (
      <ThemeProvider>
        <div className="flex items-center gap-2 sm:gap-4">
          <AccountPopover
            data={[
              {
                label: '마이매글',
                href: '/dashboard',
                icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
              },
              {
                label: '다크모드',
                href: '#',
                icon: (
                  <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />
                ),
                onclick: toggleDarkMode,
              },
              {
                label: '회원정보수정',
                href: '#',
                icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
              },
            ]}
          />
          <button onClick={handleLogout} className={buttonClassName}>
            로그아웃
          </button>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link to="/mainlogin">
        <button className="dark:bg-scampi-600 py-2 px-3 sm:px-4 rounded-lg dark:hover:bg-scampi-700 transition-colors text-blue-950 dark:text-white text-xs sm:text-sm font-medium whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-800">
          로그인
        </button>
      </Link>
      <Link to="/mainsignup">
        <button className={buttonClassName}>회원가입</button>
      </Link>
    </div>
  )
}
