import React from 'react'
import { ThemeProvider } from '../theme/theme-provider'

interface DashboardWrapperProps {
  children: React.ReactNode
}

// Dashboard 페이지들에만 Material-UI ThemeProvider를 적용하는 래퍼
export function DashboardWrapper({ children }: DashboardWrapperProps) {
  return <ThemeProvider>{children}</ThemeProvider>
}
