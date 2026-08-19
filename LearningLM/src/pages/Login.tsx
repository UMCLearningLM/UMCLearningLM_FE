import axios from 'axios'
import { Check } from 'lucide-react'
import {
  useState,
} from 'react'
import { FcGoogle } from 'react-icons/fc'
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
    pathname.startsWith(
      '/',
    ) &&
    !pathname.startsWith(
      '//',
    )
  )
}

function validateEmail(
  value: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  )
}

function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    axios.isAxiosError(error)
  ) {
    const message =
      error.response?.data
        ?.message

    if (
      typeof message ===
        'string' &&
      message.trim()
    ) {
      return message
    }
  }

  return fallback
}

export function Login() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const [
    rememberMe,
    setRememberMe,
  ] = useState(false)

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    emailError,
    setEmailError,
  ] = useState('')

  const [
    passwordError,
    setPasswordError,
  ] = useState('')

  const [
    loginError,
    setLoginError,
  ] = useState('')

  const [
    isLoggingIn,
    setIsLoggingIn,
  ] = useState(false)

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

  const login =
    async () => {
      const normalizedEmail =
        email.trim()

      setEmailError(
        '',
      )
      setPasswordError(
        '',
      )
      setLoginError(
        '',
      )

      if (
        !validateEmail(
          normalizedEmail,
        )
      ) {
        setEmailError(
          '유효한 이메일이 아닙니다. 다시 작성해 주세요.',
        )

        return
      }

      if (
        password.length <
        8
      ) {
        setPasswordError(
          '비밀번호를 8자리 이상 입력해 주세요.',
        )

        return
      }

      setIsLoggingIn(
        true,
      )

      /*
       * 새 로그인 요청 전에 이전 인증정보를 정리합니다.
       * 공개 로그인 API에는 Authorization을 보내지 않지만,
       * 성공 이후 상태가 과거 세션과 섞이는 것도 방지합니다.
       */
      clearAuthStorage()

      try {
        const response =
          await api.post(
            '/auth/login',
            {
              email:
                normalizedEmail,
              password,
              rememberMe,
            },
          )

        const result =
          response.data
            ?.result

        const accessToken =
          result?.accessToken

        const refreshToken =
          result?.refreshToken

        if (
          typeof accessToken !==
            'string' ||
          !accessToken ||
          typeof refreshToken !==
            'string' ||
          !refreshToken
        ) {
          throw new Error(
            '로그인 응답의 인증정보가 올바르지 않습니다.',
          )
        }

        saveAuthSession(
          {
            accessToken,
            refreshToken,
            user:
              result,
          },
          rememberMe,
        )

        const redirectPath =
          getRedirectPath()

        navigate(
          redirectPath ??
            '/',
          {
            replace:
              true,
          },
        )
      } catch (
        error
      ) {
        console.error(
          '로그인 실패:',
          error,
        )

        clearAuthStorage()

        if (
          axios.isAxiosError(
            error,
          ) &&
          error.response?.status ===
            401
        ) {
          setLoginError(
            '이메일 또는 비밀번호가 맞지 않습니다.',
          )

          return
        }

        setLoginError(
          getApiErrorMessage(
            error,
            '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          ),
        )
      } finally {
        setIsLoggingIn(
          false,
        )
      }
    }

  const googleLogin =
    () => {
      clearAuthStorage()

      sessionStorage.setItem(
        'googleLoginRememberMe',
        rememberMe
          ? 'true'
          : 'false',
      )

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

      navigate(
        '/auth/google/loading',
      )
    }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-[86px] pt-[36px] text-[18px] text-[#464646]">
      <div className="mx-auto w-[600px] max-w-[calc(100%_-_32px)]">
        <button
          type="button"
          onClick={() => {
            navigate('/')
          }}
          className="mb-[28px] text-[14px] font-bold text-[#6366F1] transition-colors hover:text-[#3A3DC2]"
        >
          ← 홈으로 돌아가기
        </button>

        <button
          type="button"
          onClick={() => {
            navigate('/')
          }}
          aria-label="LearningLM 홈으로 이동"
          className="mx-auto mb-[34px] flex flex-col items-center"
        >
          <span className="flex items-center gap-[8px]">
            <span className="flex h-[40px] items-center justify-center rounded-[8px] bg-[#6366F1] px-[15px] text-[21px] font-bold text-white">
              L
            </span>

            <span className="text-[26px] font-bold text-[#27272A]">
              LearningLM
            </span>
          </span>

          <span className="mt-[9.5px] text-[15px] tracking-tighter text-[#52525B]">
            AI활용 흐름을 블록형
            튜토리얼로 배우는 플랫폼
          </span>
        </button>

        <div className="flex min-h-[791px] flex-col items-center rounded-[12px] border-2 border-[#E4E4E7] bg-white px-[39px] py-[39px]">
          <div className="flex w-full flex-col">
            <p className="text-[28px] font-bold tracking-tighter text-[#27272A]">
              로그인
            </p>

            <p className="text-[15px] tracking-tighter text-[#52525B]">
              학습을 이어서 진행하려면
              로그인하세요.
            </p>
          </div>

          <div className="mt-[26px] flex w-full flex-col gap-[22px]">
            <div className="flex flex-col">
              <p className="text-[20px]">
                이메일
              </p>

              <input
                type="email"
                value={
                  email
                }
                onChange={(
                  event,
                ) => {
                  setEmail(
                    event.target
                      .value,
                  )
                  setEmailError(
                    '',
                  )
                  setLoginError(
                    '',
                  )
                }}
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    'Enter'
                  ) {
                    void login()
                  }
                }}
                placeholder="you@example.com"
                className={[
                  'mt-[8px] h-[51px] w-full rounded-[8px] border-2 pl-[20px] outline-none hover:border-[#666666]',
                  emailError
                    ? 'border-[#F8A3A3]'
                    : 'border-[#E4E4E7]',
                ].join(
                  ' ',
                )}
              />

              {emailError && (
                <p className="mt-[6px] text-[16px] font-bold tracking-tighter text-[#EF8888]">
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-[20px] tracking-tighter">
                비밀번호
              </p>

              <input
                type="password"
                value={
                  password
                }
                onChange={(
                  event,
                ) => {
                  setPassword(
                    event.target
                      .value,
                  )
                  setPasswordError(
                    '',
                  )
                  setLoginError(
                    '',
                  )
                }}
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    'Enter'
                  ) {
                    void login()
                  }
                }}
                placeholder="********"
                className={[
                  'mt-[8px] h-[51px] rounded-[8px] border-2 pl-[20px] outline-none hover:border-[#666666]',
                  passwordError
                    ? 'border-[#F8A3A3]'
                    : 'border-[#E4E4E7]',
                ].join(
                  ' ',
                )}
              />

              {passwordError && (
                <p className="mt-[6px] text-[16px] font-bold tracking-tighter text-[#EF8888]">
                  {passwordError}
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-[7px]">
              <input
                type="checkbox"
                checked={
                  rememberMe
                }
                onChange={(
                  event,
                ) => {
                  setRememberMe(
                    event.target
                      .checked,
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

            {loginError && (
              <p className="rounded-[8px] bg-[#FFF4F4] px-[14px] py-[11px] text-[15px] font-bold text-[#EF8888]">
                {loginError}
              </p>
            )}

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
              {isLoggingIn
                ? '로그인 중...'
                : '로그인'}
            </button>
          </div>

          <div className="mt-[30px] flex w-full items-center">
            <div className="h-px flex-1 bg-[#E4E4E7]" />

            <span className="mx-[16px] text-[15px] tracking-tighter text-[#9A9AA3]">
              또는
            </span>

            <div className="h-px flex-1 bg-[#E4E4E7]" />
          </div>

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

          <div className="mt-[20px] w-full text-[16px] tracking-tighter text-[#52525B]">
            <p>
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

            <p className="mt-[8px]">
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

        <div className="mt-[32px] flex items-center justify-center gap-[38px] text-[16px] text-[#9A9AA3]">
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
    </div>
  )
}