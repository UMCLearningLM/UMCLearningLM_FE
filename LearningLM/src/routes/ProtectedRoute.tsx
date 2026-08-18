import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  Navigate,
  useLocation,
} from 'react-router-dom'

import api from '../api/api'

import {
  clearAuthStorage,
  getAccessToken,
} from '../api/authStorage'

interface ProtectedRouteProps {
  children: ReactNode
}

type AuthStatus =
  | 'checking'
  | 'authenticated'
  | 'guest'
  | 'error'

function getHttpStatus(
  error: unknown,
): number | undefined {
  if (
    typeof error !==
      'object' ||
    error ===
      null ||
    !(
      'response' in
      error
    )
  ) {
    return undefined
  }

  const candidate =
    error as {
      response?: {
        status?: number
      }
    }

  return candidate.response
    ?.status
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const location =
    useLocation()

  const [
    authStatus,
    setAuthStatus,
  ] =
    useState<AuthStatus>(
      'checking',
    )

  const [
    retryCount,
    setRetryCount,
  ] =
    useState(0)

  useEffect(
    () => {
      let cancelled =
        false

      const checkAuth =
        async () => {
          const accessToken =
            getAccessToken()

          if (
            !accessToken
          ) {
            if (
              !cancelled
            ) {
              setAuthStatus(
                'guest',
              )
            }

            return
          }

          setAuthStatus(
            'checking',
          )

          try {
            await api.get(
              '/auth/me',
            )

            if (
              cancelled
            ) {
              return
            }

            setAuthStatus(
              'authenticated',
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
              'ProtectedRoute 인증 확인 실패:',
              error,
            )

            const status =
              getHttpStatus(
                error,
              )

            if (
              status ===
                401 ||
              status ===
                403
            ) {
              clearAuthStorage()

              setAuthStatus(
                'guest',
              )

              return
            }

            setAuthStatus(
              'error',
            )
          }
        }

      void checkAuth()

      return () => {
        cancelled =
          true
      }
    },
    [
      retryCount,
    ],
  )

  if (
    authStatus ===
    'checking'
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="flex flex-col items-center gap-[12px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#E4E4E7] border-t-[#6366F1]" />

          <p className="text-[14px] font-medium text-[#666666]">
            로그인 상태를 확인하고 있습니다.
          </p>
        </div>
      </div>
    )
  }

  if (
    authStatus ===
    'error'
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-[24px]">
        <div className="w-full max-w-[460px] rounded-[14px] border-[1.5px] border-[#E4E4E7] bg-white px-[28px] py-[30px] text-center">
          <h1 className="text-[20px] font-bold text-[#27272A]">
            로그인 상태를 확인하지 못했습니다.
          </h1>

          <p className="mt-[10px] text-[14px] leading-[22px] text-[#666666]">
            서버 연결이 일시적으로 불안정할 수 있습니다. 잠시 후 다시 시도해 주세요.
          </p>

          <button
            type="button"
            onClick={() => {
              setRetryCount(
                (
                  current,
                ) =>
                  current +
                  1,
              )
            }}
            className="mt-[20px] h-[42px] rounded-[10px] bg-[#6366F1] px-[22px] text-[14px] font-bold text-white hover:bg-[#5558DB]"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (
    authStatus ===
    'guest'
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: {
            pathname:
              location.pathname,

            search:
              location.search,

            hash:
              location.hash,
          },
        }}
      />
    )
  }

  return children
}