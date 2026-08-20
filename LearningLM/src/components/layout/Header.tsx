import { Search } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import api from '../../api/api'
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
} from '../../api/authStorage'

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

interface CurrentUser {
  userId: number
  email: string
  nickname: string
  loginType:
  | 'LOCAL'
  | 'SOCIAL'
  provider: string | null
}

type AuthStatus =
  | 'checking'
  | 'authenticated'
  | 'guest'

export function Header() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  // =====================================================
  // 검색
  // =====================================================

  const [
    searchKeyword,
    setSearchKeyword,
  ] = useState('')

  // =====================================================
  // 로그인 상태
  // =====================================================

  const [
    authStatus,
    setAuthStatus,
  ] = useState<AuthStatus>(
    'checking',
  )

  const [
    currentUser,
    setCurrentUser,
  ] = useState<
    CurrentUser | null
  >(null)

  // =====================================================
  // 프로필 메뉴
  // =====================================================

  const [
    isProfileMenuOpen,
    setIsProfileMenuOpen,
  ] = useState(false)

  const profileMenuRef =
    useRef<HTMLDivElement>(
      null,
    )

  // =====================================================
  // 프로필 메뉴 바깥 클릭
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsProfileMenuOpen(
          false,
        )
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  // =====================================================
  // 로그인 상태 확인
  // =====================================================

  useEffect(() => {
    let cancelled = false

    const checkAuth =
      async () => {
        const accessToken =
          getAccessToken()

        // 토큰이 없으면 비로그인 상태
        if (!accessToken) {
          if (!cancelled) {
            setCurrentUser(
              null,
            )

            setAuthStatus(
              'guest',
            )
          }

          return
        }

        try {
          const response =
            await api.get(
              '/auth/me',
            )

          if (cancelled) {
            return
          }

          const user =
            response.data
              ?.result as
            | CurrentUser
            | undefined

          if (!user) {
            throw new Error(
              '현재 사용자 정보가 없습니다.',
            )
          }

          setCurrentUser(
            user,
          )

          setAuthStatus(
            'authenticated',
          )
        } catch (
        error
        ) {
          if (cancelled) {
            return
          }

          console.error(
            '현재 사용자 조회 실패:',
            error,
          )

          // 인증정보 정리
          clearAuthStorage()

          setCurrentUser(
            null,
          )

          setAuthStatus(
            'guest',
          )
        }
      }

    void checkAuth()

    return () => {
      cancelled = true
    }
  }, [])

  // =====================================================
  // 현재 메뉴 활성화
  // =====================================================

  const isActivePath =
    (path: string) => {
      // 홈은 정확하게 /
      if (path === '/') {
        return (
          location.pathname ===
          '/'
        )
      }

      return location.pathname.startsWith(
        path,
      )
    }

  // =====================================================
  // 검색
  // =====================================================

  const handleSearch =
    () => {
      const keyword =
        searchKeyword.trim()

      if (!keyword) {
        navigate(
          '/official-tutorials',
        )

        return
      }

      navigate(
        `/official-tutorials?q=${encodeURIComponent(
          keyword,
        )}`,
      )
    }

  const handleSearchSubmit =
    (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault()

      handleSearch()
    }

  // =====================================================
  // 로그아웃
  // =====================================================

  const handleLogout =
    async () => {
      const refreshToken =
        getRefreshToken()

      try {
        // Refresh Token이 있으면
        // 서버 로그아웃 API 호출
        if (refreshToken) {
          await api.post(
            '/auth/logout',
            {
              refreshToken,
            },
          )

          console.log(
            '로그아웃 API 성공',
          )
        }
      } catch (
      error
      ) {
        /*
         * 서버 로그아웃 API가 실패하더라도
         * 프론트에서는 반드시 로그아웃 처리
         */
        console.error(
          '로그아웃 API 호출 실패:',
          error,
        )
      } finally {
        // =================================================
        // 브라우저 인증정보 삭제
        // =================================================

        clearAuthStorage()

        // Google 로그인 관련 정보도 정리
        sessionStorage.removeItem(
          'googleLoginRememberMe',
        )

        sessionStorage.removeItem(
          'googleLoginRedirect',
        )

        // =================================================
        // Header 상태 초기화
        // =================================================

        setCurrentUser(
          null,
        )

        setAuthStatus(
          'guest',
        )

        setIsProfileMenuOpen(
          false,
        )

        // =================================================
        // 홈으로 이동
        // =================================================

        navigate(
          '/',
          {
            replace: true,
          },
        )
      }
    }

  // =====================================================
  // 프로필 아이콘
  // =====================================================

  const profileLabel =
    currentUser?.nickname
      ?.trim()
      ?.charAt(0) || '내'

  // =====================================================
  // 화면
  // =====================================================

  return (
    <header className="sticky top-0 z-[999] w-full border-b border-[#E4E4E7] bg-white">

      <div className="mx-auto flex h-[58px] w-full max-w-[1440px] items-center px-[28px]">

        {/* =================================================
            Logo + Navigation
        ================================================= */}

        <div className="flex min-w-0 items-center">

          {/* Logo */}

          <button
            type="button"
            aria-label="홈으로 이동"
            className="flex cursor-pointer items-center gap-[8px]"
            onClick={() => {
              navigate('/')
            }}
          >

            <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[7px] bg-[#6366F1] text-[14px] font-bold text-white">
              L
            </div>

            <span className="whitespace-nowrap text-[18px] font-bold tracking-[-0.03em] text-[#27272A]">
              LearningLM
            </span>

          </button>

          {/* Navigation */}

          <nav className="ml-[34px] hidden items-center gap-[31px] lg:flex">

            {navItems.map(
              (
                item,
              ) => {
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
                      'cursor-pointer whitespace-nowrap text-[13px] font-medium tracking-[-0.02em] transition-colors',

                      active
                        ? 'font-semibold text-[#6366F1]'
                        : 'text-[#666666] hover:text-[#6366F1]',
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

        {/* =================================================
            오른쪽 영역
        ================================================= */}

        <div className="ml-auto flex shrink-0 items-center gap-[17px]">

          {/* =================================================
              검색
          ================================================= */}

          <form
            onSubmit={
              handleSearchSubmit
            }
            className="hidden h-[31px] w-[205px] items-center overflow-hidden rounded-[3px] bg-[#F1F1F3] md:flex"
          >

            <input
              type="search"
              value={
                searchKeyword
              }
              onChange={(
                event,
              ) => {
                setSearchKeyword(
                  event.target.value,
                )
              }}
              placeholder="검색어를 입력하세요"
              aria-label="검색어 입력"
              className="h-full min-w-0 flex-1 bg-transparent px-[11px] text-[11px] text-[#52525B] outline-none placeholder:text-[#9A9AA3]"
            />

            <button
              type="submit"
              aria-label="검색"
              className="flex h-full w-[31px] cursor-pointer items-center justify-center text-[#52525B] transition-colors hover:text-[#6366F1]"
            >
              <Search
                size={14}
                strokeWidth={
                  2
                }
              />
            </button>

          </form>

          {/* =================================================
              로그인 상태 확인 중
          ================================================= */}

          {authStatus ===
            'checking' && (
              <div
                className="h-[31px] w-[72px]"
                aria-hidden="true"
              />
            )}

          {/* =================================================
              비로그인
          ================================================= */}

          {authStatus ===
            'guest' && (
              <button
                type="button"
                onClick={() => {
                  navigate(
                    '/login',
                  )
                }}
                className="cursor-pointer whitespace-nowrap text-[11px] font-medium tracking-[-0.02em] text-[#666666] transition-colors hover:text-[#6366F1]"
              >
                로그인/회원가입
              </button>
            )}

          {/* =================================================
              로그인 상태
          ================================================= */}

          {authStatus ===
            'authenticated' &&
            currentUser && (
              <div
                ref={
                  profileMenuRef
                }
                className="relative"
              >

                {/* 프로필 버튼 */}

                <button
                  type="button"
                  aria-label={`${currentUser.nickname}님의 프로필 메뉴`}
                  title={
                    currentUser.nickname
                  }
                  onClick={() => {
                    setIsProfileMenuOpen(
                      (
                        previous,
                      ) =>
                        !previous,
                    )
                  }}
                  className="flex h-[31px] w-[31px] cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-[#F5F5F7] text-[12px] font-bold text-[#52525B] transition-colors hover:border-[#6366F1] hover:text-[#6366F1]"
                >
                  {
                    profileLabel
                  }
                </button>

                {/* 프로필 메뉴 */}

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-[39px] z-[1000] w-[145px] overflow-hidden rounded-[2px] border border-[#E4E4E7] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]">

                    {/* 프로필 설정 */}

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(
                          false,
                        )

                        navigate(
                          '/myProfile',
                        )
                      }}
                      className="flex h-[55px] w-full cursor-pointer items-center justify-center border-b border-[#E4E4E7] bg-white text-[18px] font-semibold text-[#52525B] transition-colors hover:bg-[#F8F8FA]"
                    >
                      프로필 설정
                    </button>

                    {/* 로그아웃 */}

                    <button
                      type="button"
                      onClick={() => {
                        void handleLogout()
                      }}
                      className="flex h-[55px] w-full cursor-pointer items-center justify-center bg-white text-[18px] font-semibold text-[#E58A8A] transition-colors hover:bg-[#F8F8FA]"
                    >
                      로그아웃
                    </button>

                  </div>
                )}

              </div>
            )}

        </div>

      </div>

    </header>
  )
}