import axios from 'axios'

import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import api from '../../api/api'

import {
  clearAuthStorage,
} from '../../api/authStorage'
import googleImg from '../../assets/google.svg';

interface GoogleAuthorizationResponse {
  code: string
  message: string

  result: {
    authorizationUrl: string
  }

  success: boolean
}

interface BackendErrorResponse {
  code?: string
  message?: string
  success?: boolean
}

function resolveAuthorizationUrl(
  authorizationUrl: string,
): string {
  if (
    authorizationUrl.startsWith(
      'http://',
    ) ||
    authorizationUrl.startsWith(
      'https://',
    )
  ) {
    return authorizationUrl
  }

  const baseURL =
    api.defaults.baseURL

  if (!baseURL) {
    throw new Error(
      'API 서버 주소가 설정되어 있지 않습니다.',
    )
  }

  const apiUrl =
    new URL(
      baseURL,
      window.location.origin,
    )

  if (
    authorizationUrl.startsWith(
      '/',
    )
  ) {
    return new URL(
      authorizationUrl,
      apiUrl.origin,
    ).toString()
  }

  const normalizedBaseURL =
    baseURL.endsWith(
      '/',
    )
      ? baseURL
      : `${baseURL}/`

  return new URL(
    authorizationUrl,
    normalizedBaseURL,
  ).toString()
}

function getGoogleErrorDetails(
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
    return {
      code:
        error.response
          ?.data
          ?.code ||
        'GOOGLE_AUTH_START_FAILED',

      message:
        error.response
          ?.data
          ?.message ||
        error.message ||
        'Google 로그인 요청을 시작하지 못했습니다.',
    }
  }

  return {
    code:
      'GOOGLE_AUTH_START_FAILED',

    message:
      error instanceof Error
        ? error.message
        : 'Google 로그인 요청을 시작하지 못했습니다.',
  }
}

export default function GoogleLogin() {
  const navigate =
    useNavigate()

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState('')

  useEffect(
    () => {
      let cancelled =
        false

      const startGoogleLogin =
        async () => {
          /*
           * /auth/google은 공개 OAuth 시작 endpoint입니다.
           *
           * api.ts interceptor에서도 Authorization을 제거하지만,
           * 오래된 Access/Refresh Token이 이후 흐름에 남지 않도록
           * Google 로그인 시작 시점에 한 번 더 정리합니다.
           */
          clearAuthStorage()

          try {
            const response =
              await api.get<GoogleAuthorizationResponse>(
                '/auth/google',
              )

            if (
              cancelled
            ) {
              return
            }

            const authorizationUrl =
              response.data
                ?.result
                ?.authorizationUrl

            if (
              !response.data
                ?.success ||
              !authorizationUrl
            ) {
              throw new Error(
                response.data
                  ?.message ||
                'Google 인증 URL을 받지 못했습니다.',
              )
            }

            sessionStorage.setItem(
              'googleLoginPending',
              'true',
            )

            window.location.replace(
              resolveAuthorizationUrl(
                authorizationUrl,
              ),
            )
          } catch (
          error
          ) {
            if (
              cancelled
            ) {
              return
            }

            console.error(
              'Google 로그인 시작 실패:',
              error,
            )

            sessionStorage.removeItem(
              'googleLoginPending',
            )

            const {
              code,
              message,
            } =
              getGoogleErrorDetails(
                error,
              )

            setErrorMessage(
              message,
            )

            window.setTimeout(
              () => {
                navigate(
                  `/auth/google/error?error=${encodeURIComponent(
                    code,
                  )}&message=${encodeURIComponent(
                    message,
                  )}`,
                  {
                    replace:
                      true,
                  },
                )
              },
              1000,
            )
          }
        }

      void startGoogleLogin()

      return () => {
        cancelled =
          true
      }
    },
    [
      navigate,
    ],
  )

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

        <div className="flex min-h-[310px] w-full flex-col items-center justify-center rounded-[12px] border-2 border-[#E4E4E7] bg-white px-[30px] py-[50px]">
          <div className="flex w-full flex-col items-center gap-[21px]">
            <img src={googleImg} className='w-[60px] h-[60px]' />

            <div className="h-[40px] w-[40px] animate-spin rounded-full border-[4px] border-[#E4E4E7] border-t-[#6366F1]" />

            <div className="flex flex-col items-center gap-[11px]">
              <h2 className="text-center text-[28px] font-bold tracking-[-0.03em] text-[#27272A]">
                Google 계정으로 인증 중...
              </h2>

              <p
                className={[
                  'text-center text-[18px]',

                  errorMessage
                    ? 'font-medium text-[#EF8888]'
                    : 'text-[#52525B]',
                ].join(
                  ' ',
                )}
              >
                {errorMessage ||
                  '잠시만 기다려주세요. Google 인증 페이지로 이동합니다.'}
              </p>
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