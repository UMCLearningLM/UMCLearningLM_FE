import {
  useEffect,
  useState,
} from 'react'

import {
  Check,
} from 'lucide-react'

import {
  FcGoogle,
} from 'react-icons/fc'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import api from '../api/api'

import {
  clearAuthStorage,
  saveAuthSession,
} from '../api/authStorage'

interface LoginLocationState {
  from?: {
    pathname: string
    search?: string
    hash?: string
  }
}

function isSafeInternalPath(
  pathname: string,
): boolean {
  return (
    pathname.startsWith('/') &&
    !pathname.startsWith('//')
  )
}

// =====================================================
// 이메일 형식 검사
// =====================================================

function validateEmail(
  value: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  )
}

export function Login() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  // =====================================================
  // 로그인 상태 유지
  // =====================================================

  const [
    rememberMe,
    setRememberMe,
  ] = useState(false)

  // =====================================================
  // 로그인 중 상태
  // =====================================================

  const [
    isLoggingIn,
    setIsLoggingIn,
  ] = useState(false)

  // =====================================================
  // 이메일
  // =====================================================

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    emailState,
    setEmailState,
  ] = useState<
    'basic' |
    'incorrect' |
    'success'
  >('basic')

  const [
    emailFormError,
    setEmailFormError,
  ] = useState(false)

  // =====================================================
  // 로그인 실패 오류
  // =====================================================

  const [
    loginError,
    setLoginError,
  ] = useState(false)

  // =====================================================
  // 비밀번호
  // =====================================================

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    passwordState,
    setPasswordState,
  ] = useState<
    'basic' |
    'incorrect' |
    'success'
  >('basic')

  const [
    passwordLengthState,
    setPasswordLengthState,
  ] = useState<
    'basic' |
    'incorrect' |
    'success'
  >('basic')

  // =====================================================
  // 비밀번호 길이 실시간 검사
  // =====================================================

  useEffect(() => {
    if (
      password.length > 0 &&
      password.length < 8
    ) {
      setPasswordLengthState(
        'incorrect',
      )

      return
    }

    if (
      password.length >= 8
    ) {
      setPasswordLengthState(
        'success',
      )

      return
    }

    setPasswordLengthState(
      'basic',
    )
  }, [
    password,
  ])

  // =====================================================
  // 로그인 후 이동할 경로
  // =====================================================

  const getRedirectPath =
    (): string | null => {
      const state =
        location.state as
        | LoginLocationState
        | null

      const from =
        state?.from

      if (
        !from?.pathname ||
        !isSafeInternalPath(
          from.pathname,
        )
      ) {
        return null
      }

      return (
        `${from.pathname}` +
        `${from.search ?? ''}` +
        `${from.hash ?? ''}`
      )
    }

  // =====================================================
  // 일반 로그인
  // =====================================================

  const login = async () => {

    // -----------------------------------------------------
    // 이메일 검사
    // -----------------------------------------------------

    if (
      !validateEmail(
        email.trim(),
      )
    ) {
      setEmailFormError(
        true,
      )

      return
    }

    setEmailFormError(
      false,
    )

    // -----------------------------------------------------
    // 비밀번호 검사
    // -----------------------------------------------------

    if (
      password.length < 8
    ) {
      setPasswordLengthState(
        'incorrect',
      )

      return
    }

    setPasswordLengthState(
      'success',
    )

    // -----------------------------------------------------
    // 이전 오류 초기화
    // -----------------------------------------------------

    setEmailState(
      'basic',
    )

    setPasswordState(
      'basic',
    )

    setLoginError(
      false,
    )

    // -----------------------------------------------------
    // 로그인 시작
    // -----------------------------------------------------

    setIsLoggingIn(
      true,
    )

    // -----------------------------------------------------
    // 이전 인증정보 삭제
    // -----------------------------------------------------

    clearAuthStorage()

    try {

      // ---------------------------------------------------
      // 로그인 API
      // ---------------------------------------------------

      const response =
        await api.post(
          '/auth/login',
          {
            email:
              email.trim(),

            password,

            rememberMe,
          },
        )

      console.log(
        '로그인 응답:',
        response.data,
      )

      const result =
        response.data?.result

      if (
        !result?.accessToken
      ) {
        throw new Error(
          'accessToken이 없습니다.',
        )
      }

      const {
        accessToken,
        refreshToken,
      } = result

      // ---------------------------------------------------
      // 로그인 정보 저장
      // ---------------------------------------------------

      saveAuthSession(
        {
          accessToken,
          refreshToken,

          /*
           * 기존 코드와의 호환을 위해
           * 로그인 result 전체를 user로 저장
           */
          user: result,
        },
        rememberMe,
      )

      console.log(
        '로그인 성공!',
      )

      // ---------------------------------------------------
      // 로그인 후 이동할 페이지 확인
      // ---------------------------------------------------

      const redirectPath =
        getRedirectPath()

      if (
        redirectPath
      ) {
        navigate(
          redirectPath,
          {
            replace: true,
          },
        )

        return
      }

      // ---------------------------------------------------
      // 세션 확인 페이지
      // ---------------------------------------------------

      navigate(
        '/session-check',
        {
          replace: true,
        },
      )

    } catch (error: any) {

      console.error(
        '===== 로그인 실패 =====',
      )

      console.log(
        'HTTP 상태:',
        error.response?.status,
      )

      console.log(
        '백엔드 에러 응답:',
        error.response?.data,
      )

      console.log(
        '에러 코드:',
        error.response?.data?.code,
      )

      console.log(
        '에러 메시지:',
        error.response?.data?.message,
      )

      console.log(
        '======================',
      )

      // ===================================================
      // 이메일 또는 비밀번호가 잘못된 경우
      // ===================================================

      if (
        error.response?.status === 401
      ) {
        setLoginError(
          true,
        )

        return
      }

      // ---------------------------------------------------
      // 그 외 오류
      // ---------------------------------------------------

      setLoginError(
        false,
      )

      console.error(
        '로그인 요청 중 알 수 없는 오류가 발생했습니다.',
      )

    } finally {

      setIsLoggingIn(
        false,
      )
    }
  }

  // =====================================================
  // Google 로그인
  // =====================================================

  const googleLogin = () => {

    /*
     * Google 로그인도 새로운 로그인 시도이므로
     * 기존 인증정보를 먼저 제거합니다.
     */

    clearAuthStorage()

    // ---------------------------------------------------
    // 로그인 상태 유지 여부 저장
    // ---------------------------------------------------

    sessionStorage.setItem(
      'googleLoginRememberMe',
      rememberMe
        ? 'true'
        : 'false',
    )

    // ---------------------------------------------------
    // 원래 접근하려던 페이지 저장
    // ---------------------------------------------------

    const redirectPath =
      getRedirectPath()

    if (
      redirectPath
    ) {
      sessionStorage.setItem(
        'googleLoginRedirect',
        redirectPath,
      )
    } else {
      sessionStorage.removeItem(
        'googleLoginRedirect',
      )
    }

    // ---------------------------------------------------
    // Google 로그인 로딩 페이지
    // ---------------------------------------------------

    navigate(
      '/auth/google/loading',
    )
  }

  // =====================================================
  // 화면
  // =====================================================

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-[#F5F5F7] text-[#464646] text-[18px] pt-[91px]">

        {/* =================================================
            Logo
        ================================================= */}

        <div className="px-[10px] flex flex-col items-center mb-[34px]">

          <div
            className="cursor-pointer flex flex-row gap-[8px]"
            onClick={() => {
              navigate("/")
            }}
          >

            <div className="h-[40px] flex flex-col rounded-[8px] bg-[#6366F1] px-[15px] justify-center items-center text-[21px] font-bold text-[#FFF]">
              L
            </div>

            <span className="text-[26px] font-bold text-[#27272A]">
              LearningLM
            </span>

          </div>

          <p className="text-[#52525B] text-[15px] mt-[9.5px] tracking-tighter">
            AI활용 흐름을 블록형 튜토리얼로 배우는 플랫폼
          </p>

        </div>

        {/* =================================================
            Login Card
        ================================================= */}

        <div className="bg-white w-[600px] min-h-[791px] flex flex-col items-center px-[10px] py-[39px] rounded-[12px] border-[#E4E4E7] border-[2px]">

          {/* 제목 */}

          <div className="flex flex-col w-[529px]">

            <p className="text-[28px] font-bold text-[#27272A] tracking-tighter">
              로그인
            </p>

            <p className="text-[15px] tracking-tighter text-[#52525B]">
              학습을 이어서 진행하려면
              로그인하세요.
            </p>

          </div>

          <div className="flex flex-col gap-[30px]">

            {/* =================================================
                이메일
            ================================================= */}

            <div className="flex flex-col mt-[26px] w-[519px]">

              <p className="text-[20px]">
                이메일
              </p>

              <div className="mt-[8px]">

                <input
                  type="email"
                  value={email}
                  onChange={(
                    event,
                  ) => {
                    setEmail(
                      event.target.value,
                    )

                    setEmailState(
                      'basic',
                    )

                    setEmailFormError(
                      false,
                    )

                    // 다시 입력하면
                    // 로그인 오류 문구 제거
                    setLoginError(
                      false,
                    )
                  }}
                  placeholder="you@example.com"
                  className="hover:border-[#666666] w-full h-[51px] flex items-center pl-[20px] rounded-[8px] border-2 border-[#E4E4E7]"
                />

                {/* =================================================
                    이메일 형식 오류
                ================================================= */}

                {emailFormError && (
                  <p className="mt-[6.5px] text-[16px] font-bold text-[#EF8888] tracking-tighter">
                    유효한 이메일이 아닙니다. 다시 작성해 주세요.
                  </p>
                )}

              </div>

            </div>

            {/* =================================================
                비밀번호
            ================================================= */}

            <div className="flex flex-col w-[519px] mt-[-8px]">

              <p className="text-[20px] tracking-tighter">
                비밀번호
              </p>

              <input
                type="password"
                value={password}
                onChange={(
                  event,
                ) => {
                  setPassword(
                    event.target.value,
                  )

                  setPasswordState(
                    'basic',
                  )

                  // 다시 입력하면
                  // 로그인 오류 문구 제거
                  setLoginError(
                    false,
                  )
                }}
                placeholder="********"
                className={[
                  'mt-[8px] h-[51px] rounded-[8px] border-2 pl-[20px] outline-none hover:border-[#666666]',
                  loginError
                    ? 'border-[#F8A3A3]'
                    : 'border-[#E4E4E7]',
                ].join(
                  ' ',
                )}
              />

              {/* =================================================
                  이메일 또는 비밀번호 오류
              ================================================= */}

              {loginError && (
                <p className="mt-[6px] text-[16px] font-bold text-[#EF8888] tracking-tighter">
                  이메일 또는 비밀번호가 올바르지 않습니다
                </p>
              )}

              {/* =================================================
                  비밀번호 오류
              ================================================= */}

              {passwordState ===
                'incorrect' && (
                  <p className="mt-[6px] text-[16px] font-bold text-[#EF8888] tracking-tighter">
                    비밀번호가 맞지 않습니다. 다시 입력해주세요.
                  </p>
                )}

              {/* =================================================
                  비밀번호 길이 오류
              ================================================= */}

              {passwordLengthState ===
                'incorrect' && (
                  <p className="mt-[4px] text-[16px] font-bold text-[#EF8888] tracking-tighter">
                    비밀번호 8자리 이상 입력해주세요.
                  </p>
                )}

            </div>

            {/* =================================================
                로그인 상태 유지
            ================================================= */}

            <label className="w-[519px] mt-[-7px] cursor-pointer agreement flex items-center">

              <input
                type="checkbox"
                checked={
                  rememberMe
                }
                onChange={(
                  event,
                ) => {
                  setRememberMe(
                    event.target.checked,
                  )
                }}
                className="sr-only"
              />

              <span
                className={[
                  'flex h-[17px] w-[17px] items-center justify-center rounded-[2px] border-2 border-[#6366F1]',
                  rememberMe
                    ? 'bg-[#6366F1]'
                    : 'bg-white',
                ].join(
                  ' ',
                )}
              >

                {rememberMe && (
                  <Check
                    size={
                      15
                    }
                    className="stroke-[3] text-white"
                  />
                )}

              </span>

              <span className="text-[15.5px] tracking-tighter text-[#52525B]">
                로그인 상태 유지
              </span>

            </label>

            {/* =================================================
                로그인 버튼
            ================================================= */}

            <button
              type="button"
              disabled={
                isLoggingIn
              }
              onClick={() => {
                void login()
              }}
              className="h-[51px] w-full cursor-pointer rounded-[8px] border border-[#6366F1] text-[22px] font-bold tracking-tighter text-[#6366F1] transition-colors hover:bg-[#6366F1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >

              <span className="text-[24px] font-bold tracking-tighter">
                로그인
              </span>

            </button>

          </div>

          {/* =================================================
              또는
          ================================================= */}

          <div className="flex items-center w-[519px] mt-[30px]">

            <div className="flex-1 h-px bg-[#E4E4E7]" />

            <span className="mx-[16px] text-[15px] tracking-tighter text-[#9A9AA3]">
              또는
            </span>

            <div className="flex-1 h-px bg-[#E4E4E7]" />

          </div>

          {/* =================================================
              Google 로그인
          ================================================= */}

          <button
            type="button"
            onClick={
              googleLogin
            }
            className="mt-[28px] flex h-[56px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[8px] border-2 border-[#E4E4E7] transition-colors hover:border-[#BDBDC5] hover:bg-[#FAFAFB]"
          >

            <FcGoogle
              size={32}
            />

            <span className="text-[18px] font-bold tracking-tighter text-[#27272A]">
              Google 계정으로 계속하기
            </span>

          </button>

          {/* =================================================
              회원가입 / 비밀번호 찾기
          ================================================= */}

          <div className="mb-[3px]">

            <p className="text-[#52525B] text-[16px] mt-[20.5px] tracking-tighter">

              아직 계정이 없으신가요?{' '}

              <button
                type="button"
                onClick={() => {
                  navigate(
                    '/register',
                  )
                }}
                className="font-bold text-[#6366F1] hover:text-[#3A3DC2]"
              >
                회원가입
              </button>

            </p>

            <p className="text-[#52525B] text-[16px] mt-[8px] tracking-tighter">

              비밀번호를 잊으셨나요?{' '}

              <button
                type="button"
                onClick={() => {
                  navigate(
                    '/pw-find',
                  )
                }}
                className="font-bold text-[#6366F1] hover:text-[#3A3DC2]"
              >
                비밀번호 찾기
              </button>

            </p>

          </div>

        </div>

        {/* =================================================
            Footer
        ================================================= */}

        <div className="flex flex-row mt-[32px] mb-[86px] text-[16px] text-[#9A9AA3] gap-[38px]">

          <p>
            ©2026 LearningLM
          </p>

          <button
            type="button"
            onClick={() => {
              navigate(
                '/terms',
              )
            }}
            className="transition-colors hover:text-[#6366F1]"
          >
            이용약관
          </button>

          <button
            type="button"
            onClick={() => {
              navigate(
                '/privacy',
              )
            }}
            className="transition-colors hover:text-[#6366F1]"
          >
            개인정보처리방침
          </button>

        </div>

      </div>
    </>
  )
}