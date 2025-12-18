import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../../components/Header'
import Footer from '../../components/Footer'
import { User, Laptop, Bell, ChevronRight } from 'lucide-react'

interface MenuItem {
  icon: typeof User
  label: string
  children: string[]
}

const Mypage: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string>('subnav 1')

  const menuItems: MenuItem[] = [
    {
      icon: User,
      label: 'subnav 1',
      children: ['option1', 'option2', 'option3', 'option4'],
    },
    {
      icon: Laptop,
      label: 'subnav 2',
      children: ['option5', 'option6', 'option7', 'option8'],
    },
    {
      icon: Bell,
      label: 'subnav 3',
      children: ['option9', 'option10', 'option11', 'option12'],
    },
  ]

  const cards = [
    { title: '무드 컬러 그래프' },
    { title: '글쓰기 현황' },
    { title: '글쓰기 작성 일수' },
    { title: '감정 변화 그래프' },
    { title: '나의 마음 구름' },
    { title: "'user'님을 위한 콘텐츠 추천" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <AppHeader />

      <main className="flex-1 px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 my-4 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/home" className="hover:text-violet-500">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link to="/mypage" className="hover:text-violet-500">
            My page
          </Link>
          <ChevronRight size={16} />
          <span className="text-blue-950 dark:text-white">대시보드</span>
        </nav>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-48 flex-shrink-0">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isOpen = openMenu === item.label
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() =>
                          setOpenMenu(isOpen ? '' : item.label)
                        }
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-950 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                      {isOpen && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child}
                              to="#"
                              className="block px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                            >
                              {child}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </aside>

            {/* Content Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-sm font-semibold text-blue-950 dark:text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Card content
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Mypage

