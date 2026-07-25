import { Search } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { Button } from '../ui/Button'

interface NavItem {
  label: string
  to: string
  end?: boolean
}

const navItems: NavItem[] = [
  {
    label: '홈',
    to: '/',
    end: true,
  },
  {
    label: '공식 튜토리얼',
    to: '/official-tutorials',
  },
  {
    label: '스튜디오',
    to: '/studio',
  },
  {
    label: '공개 라이브러리',
    to: '/public-library',
  },
  {
    label: '내 저장소',
    to: '/my-storage',
  },
]

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-[999] border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            aria-label="LearningLM 홈으로 이동"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-black text-white">
              L
            </div>

            <span className="text-lg font-bold text-slate-950">
              LearningLM
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'text-sm font-semibold transition',
                    isActive
                      ? 'text-indigo-500'
                      : 'text-slate-500 hover:text-indigo-500',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<Search size={16} />}
            className="hidden md:inline-flex"
            onClick={() => navigate('/official-tutorials')}
          >
            검색
          </Button>

          <button
            type="button"
            aria-label="로그인 페이지로 이동"
            onClick={() => navigate('/login')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
          >
            민
          </button>
        </div>
      </div>
    </header>
  )
}