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

type ExchangeStatus =
  | 'processing'
  | 'success'
  | 'error'

function clearPreviousAuthStorage() {
  localStorage.removeItem(
    'accessToken',
  )
  localStorage.removeItem(
    'refreshToken',
  )
  localStorage.removeItem(
    'user',
  )

  sessionStorage.removeItem(
    'accessToken',
  )
  sessionStorage.removeItem(
    'refreshToken',
  )
  sessionStorage.removeItem(
    'user',
  )
}

function saveGoogleLoginResult(
  result: GoogleTokenResult,
) {
  clearPreviousAuthStorage()

  localStorage.setItem(
    'accessToken',
    result.accessToken,
  )

  localStorage.setItem(
    'refreshToken',
    result.refreshToken,
  )

  localStorage.setItem(
    'user',
    JSON.stringify({
      userId:
        result.userId,
      email:
        result.email,
      nickname:
        result.nickname,
    }),
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

            setStatus('error')

            setErrorMessage(
              'Google 인증 코드가 없습니다.',
            )

            window.setTimeout(
              () => {
                navigate(
                  '/auth/google/error?error=OAUTH_CODE_MISSING',
                  {
                    replace: true,
                  },
                )
              },
              1000,
            )

            return
          }

          try {
            const response =
              await api.post<GoogleTokenExchangeResponse>(
                '/auth/google/token',
                {
                  code,
                },
              )

            const result =
              response.data?.result

            if (
              !response.data?.success ||
              !result?.accessToken ||
              !result?.refreshToken
            ) {
              throw new Error(
                response.data?.message ||
                  'Google 로그인 토큰 응답이 올바르지 않습니다.',
              )
            }

            saveGoogleLoginResult(
              result,
            )

            sessionStorage.removeItem(
              'googleLoginPending',
            )

            setStatus('success')

            window.setTimeout(
              () => {
                navigate(
                  '/',
                  {
                    replace: true,
                  },
                )
              },
              900,
            )
          } catch (error) {
            console.error(
              'Google 인증 코드 교환 실패:',
              error,
            )

            sessionStorage.removeItem(
              'googleLoginPending',
            )

            setStatus('error')

            setErrorMessage(
              'Google 로그인 처리에 실패했습니다.',
            )

            window.setTimeout(
              () => {
                navigate(
                  '/auth/google/error?error=TOKEN_EXCHANGE_FAILED',
                  {
                    replace: true,
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
    status === 'success'

  const failed =
    status === 'error'

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
            {success ? (
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#DFF2DF] text-[32px] font-bold text-[#3C7A52]">
                ✓
              </div>
            ) : failed ? (
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#FBF1F0] text-[30px] font-bold text-[#EF8888]">
                !
              </div>
            ) : (
              <div className="h-[52px] w-[52px] animate-spin rounded-full border-[5px] border-[#E4E4E7] border-t-[#6366F1]" />
            )}

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
                  ? '로그인되었습니다. 홈으로 이동합니다.'
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
              ].join(' ')}
            >
              <span
                className={[
                  'font-bold',
                  success
                    ? 'text-[#2F7D52]'
                    : failed
                      ? 'text-[#EF8888]'
                      : 'text-[#6366F1]',
                ].join(' ')}
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