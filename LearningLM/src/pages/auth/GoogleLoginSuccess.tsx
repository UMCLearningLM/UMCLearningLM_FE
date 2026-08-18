import axios from 'axios'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import api from '../../api/api'
import googleImg from '../../assets/google.svg';

import {
  clearAuthStorage,
  saveAuthSession,
} from '../../api/authStorage'

interface GoogleTokenResult {
  userId: number
  email: string
  nickname: string
  accessToken: string
  refreshToken: string
}

interface GoogleTokenExchangeResponse {
  code: string
  message: string
  result: GoogleTokenResult
  success: boolean
}

interface BackendErrorResponse {
  code?: string
  message?: string
  success?: boolean
}

type ExchangeStatus =
  | 'processing'
  | 'success'
  | 'error'

function getGoogleTokenErrorDetails(
  error: unknown,
): {
  code: string
  message: string
} {
  if (
    axios.isAxiosError<BackendErrorResponse>(
      error,
    )
  ) {
    const backendCode =
      error.response
        ?.data
        ?.code

    const backendMessage =
      error.response
        ?.data
        ?.message

    return {
      /*
       * 서버가 실제 에러 코드를 보냈다면 AUTH40107 등
       * 해당 값을 그대로 보존합니다.
       *
       * 서버 응답 자체가 없거나 코드가 없는 경우에만
       * TOKEN_EXCHANGE_FAILED를 fallback으로 사용합니다.
       */
      code:
        backendCode ||
        'TOKEN_EXCHANGE_FAILED',

      message:
        backendMessage ||
        error.message ||
        'Google 로그인 처리에 실패했습니다.',
    }
  }

  return {
    code:
      'TOKEN_EXCHANGE_FAILED',

    message:
      error instanceof Error
        ? error.message
        : 'Google 로그인 처리에 실패했습니다.',
  }
}

function getGoogleRememberMe():
  boolean {
  return (
    sessionStorage.getItem(
      'googleLoginRememberMe',
    ) ===
    'true'
  )
}

function getSafeGoogleRedirect():
  string {
  const redirectPath =
    sessionStorage.getItem(
      'googleLoginRedirect',
    )

  if (
    redirectPath &&
    redirectPath.startsWith(
      '/',
    ) &&
    !redirectPath.startsWith(
      '//',
    )
  ) {
    return redirectPath
  }

  return '/'
}

function clearGoogleFlowState() {
  sessionStorage.removeItem(
    'googleLoginPending',
  )

  sessionStorage.removeItem(
    'googleLoginRememberMe',
  )

  sessionStorage.removeItem(
    'googleLoginRedirect',
  )
}

export default function GoogleLoginSuccess() {
  const navigate =
    useNavigate()

  const [
    searchParams,
  ] =
    useSearchParams()

  const exchangeStartedRef =
    useRef(false)

  const [
    status,
    setStatus,
  ] =
    useState<ExchangeStatus>(
      'processing',
    )

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState('')

  useEffect(
    () => {
      if (
        exchangeStartedRef.current
      ) {
        return
      }

      exchangeStartedRef.current =
        true

      const exchangeCode =
        async () => {
          const code =
            searchParams.get(
              'code',
            )

          if (!code) {
            sessionStorage.removeItem(
              'googleLoginPending',
            )

            setStatus(
              'error',
            )

            setErrorMessage(
              'Google 인증 코드가 없습니다.',
            )

            window.setTimeout(
              () => {
                navigate(
                  '/auth/google/error?error=OAUTH_CODE_MISSING&message=Google%20인증%20코드가%20없습니다.',
                  {
                    replace:
                      true,
                  },
                )
              },
              1000,
            )

            return
          }

          /*
           * 코드 교환 전에 이전 인증정보를 정리합니다.
           *
           * request interceptor도 /auth/google/token에서 Authorization을
           * 제거하므로 이중 방어가 됩니다.
           */
          clearAuthStorage()

          try {
            const response =
              await api.post<GoogleTokenExchangeResponse>(
                '/auth/google/token',
                {
                  code,
                },
              )

            const result =
              response.data
                ?.result

            if (
              !response.data
                ?.success ||
              !result
                ?.accessToken ||
              !result
                ?.refreshToken
            ) {
              throw new Error(
                response.data
                  ?.message ||
                'Google 로그인 토큰 응답이 올바르지 않습니다.',
              )
            }

            const rememberMe =
              getGoogleRememberMe()

            const redirectPath =
              getSafeGoogleRedirect()

            saveAuthSession(
              {
                accessToken:
                  result.accessToken,

                refreshToken:
                  result.refreshToken,

                user: {
                  userId:
                    result.userId,

                  email:
                    result.email,

                  nickname:
                    result.nickname,
                },
              },

              rememberMe,
            )

            clearGoogleFlowState()

            setStatus(
              'success',
            )

            window.setTimeout(
              () => {
                navigate(
                  redirectPath,
                  {
                    replace:
                      true,
                  },
                )
              },
              900,
            )
          } catch (
          error
          ) {
            console.error(
              'Google 인증 코드 교환 실패:',
              error,
            )

            sessionStorage.removeItem(
              'googleLoginPending',
            )

            const {
              code:
              errorCode,
              message,
            } =
              getGoogleTokenErrorDetails(
                error,
              )

            setStatus(
              'error',
            )

            setErrorMessage(
              `${errorCode} · ${message}`,
            )

            window.setTimeout(
              () => {
                navigate(
                  `/auth/google/error?error=${encodeURIComponent(
                    errorCode,
                  )}&message=${encodeURIComponent(
                    message,
                  )}`,
                  {
                    replace:
                      true,
                  },
                )
              },
              1200,
            )
          }
        }

      void exchangeCode()
    },
    [
      navigate,
      searchParams,
    ],
  )

  const success =
    status ===
    'success'

  const failed =
    status ===
    'error'

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F5F5F7] px-[24px]">
      <div className="flex w-full max-w-[600px] flex-col items-center gap-[47px]">
        <div className="flex flex-col items-center gap-[14px]">
          <div className="flex items-center justify-center gap-[8px]">
            <div className="flex h-[43px] w-[44px] items-center justify-center rounded-[8px] bg-[#6366F1]">
              <span className="text-[24px] font-bold tracking-[-0.03em] text-white">
                L
              </span>
            </div>

            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#27272A]">
              LearningLM
            </h1>
          </div>

          <p className="text-center text-[18px] text-[#52525B]">
            AI 활용 흐름을 블록형 튜토리얼로 배우는 플랫폼
          </p>
        </div>

        <div className="flex min-h-[374px] w-full flex-col items-center justify-center rounded-[12px] border-2 border-[#E4E4E7] bg-white px-[40px] py-[50px]">
          <div className="flex w-full flex-col items-center gap-[38px]">

            <img src={googleImg} className='w-[60px] h-[60px]' />
            <div className="flex flex-col items-center gap-[11px]">
              <h2 className="text-center text-[28px] font-bold tracking-[-0.03em] text-[#27272A]">
                {success
                  ? 'Google 인증 성공'
                  : failed
                    ? 'Google 로그인 실패'
                    : 'Google 계정으로 인증 중...'}
              </h2>

              <p className="text-center text-[18px] text-[#52525B]">
                {success
                  ? '로그인되었습니다. 이동합니다.'
                  : failed
                    ? errorMessage
                    : '인증 코드를 확인하고 로그인 정보를 생성하고 있습니다.'}
              </p>
            </div>

            <div
              className={[
                'flex min-h-[73px] w-full items-center justify-center rounded-[12px] border-2 px-[29px] text-center text-[18px]',

                success
                  ? 'border-[#5FAA81] bg-[#DFF2DF]'
                  : failed
                    ? 'border-[#E9C9C9] bg-[#FBF1F0]'
                    : 'border-[#E4E4E7] bg-[#F5F5F7]',
              ].join(
                ' ',
              )}
            >
              <span
                className={[
                  'font-bold',

                  success
                    ? 'text-[#2F7D52]'
                    : failed
                      ? 'text-[#EF8888]'
                      : 'text-[#6366F1]',
                ].join(
                  ' ',
                )}
              >
                {success
                  ? '인증 성공'
                  : failed
                    ? '인증 실패'
                    : '토큰 발급 중'}
              </span>
            </div>
          </div>
        </div>

        <footer>
          <div className="flex flex-wrap items-center justify-center gap-[36px] text-[18px] text-[#9A9AA3]">
            <span>
              © 2026 LearningLM
            </span>

            <span>
              이용약관
            </span>

            <span>
              개인정보처리방침
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}