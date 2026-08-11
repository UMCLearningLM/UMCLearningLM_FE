import {
  Search,
} from 'lucide-react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  Button,
} from '../ui/Button'

const navItems = [
  {
    label: '홈',
    path: '/',
  },
  {
    label: '공식 튜토리얼',
    path: '/official-tutorials',
  },
  {
    label: '스튜디오',
    path: '/studio',
  },
  {
    label: '공개 라이브러리',
    path: '/public-library',
  },
  {
    label: '내 저장소',
    path: '/my-storage',
  },
]

export function Header() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const isActivePath = (
    path: string,
  ) => {
    if (path === '/') {
      return (
        location.pathname === '/'
      )
    }

    return location.pathname.startsWith(
      path,
    )
  }

  return (
    <header className="sticky top-0 z-[999] border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="flex items-center gap-3"
            onClick={() => {
              navigate('/')
            }}
            aria-label="홈으로 이동"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-black text-white">
              L
            </div>

            <span className="text-lg font-bold text-slate-950">
              LearningLM
            </span>
          </button>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map(
              (item) => {
                const active =
                  isActivePath(
                    item.path,
                  )

                return (
                  <button
                    key={
                      item.path
                    }
                    type="button"
                    onClick={() => {
                      navigate(
                        item.path,
                      )
                    }}
                    className={[
                      'text-sm font-semibold transition',
                      active
                        ? 'text-indigo-500'
                        : 'text-slate-500 hover:text-indigo-500',
                    ].join(
                      ' ',
                    )}
                  >
                    {
                      item.label
                    }
                  </button>
                )
              },
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={
              <Search
                size={16}
              />
            }
            className="hidden md:inline-flex"
            onClick={() => {
              navigate(
                '/official-tutorials',
              )
            }}
          >
            검색
          </Button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
            aria-label="내 저장소로 이동"
            onClick={() => {
              navigate(
                '/my-storage',
              )
            }}
          >
            민
          </button>
        </div>
      </div>
    </header>
  )
}