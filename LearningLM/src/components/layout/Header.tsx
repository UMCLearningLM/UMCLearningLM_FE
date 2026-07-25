import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../ui/Button'

const navItems = [
  { label: '홈', active: true },
  { label: '공식 튜토리얼', active: false },
  { label: '스튜디오', active: false },
  { label: '공개 라이브러리', active: false },
  { label: '내 저장소', active: false },
]

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-[999] border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-black text-white">
              L
            </div>

            <span className="text-lg font-bold text-slate-950">
              LearningLM
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={[
                  'text-sm font-semibold transition',
                  item.active
                    ? 'text-indigo-500'
                    : 'text-slate-500 hover:text-indigo-500',
                ].join(' ')}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Search size={16} />}
            className="hidden md:inline-flex"
          >
            검색
          </Button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
            aria-label="로그인 페이지로 이동"
          >
            민
          </button>
        </div>
      </div>
    </header>
  )
}