import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  saveReissuedAuthTokens,
} from './authStorage'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_BASE_URL 환경변수가 설정되지 않았습니다.',
  )
}

/**
 * LearningLM 공용 Axios 인스턴스입니다.
 *
 * Content-Type을 전역에서 application/json으로 고정하지 않습니다.
 * JSON은 Axios가 자동 처리하고,
 * FormData는 multipart boundary를 Axios가 자동으로 설정하게 둡니다.
 */
const api = axios.create({
  baseURL:
    API_BASE_URL,

  timeout:
    10_000,
})

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface ReissueResponse {
  result?: {
    accessToken?: string
    refreshToken?: string
  }
}

let reissuePromise:
  Promise<string> | null =
    null

/**
 * 기존 Access Token이 절대로 붙으면 안 되는 공개 인증 API입니다.
 *
 * exact:
 * 정확히 해당 endpoint만 공개
 *
 * prefix:
 * 하위 경로까지 모두 공개
 */
const PUBLIC_AUTH_EXACT_PATHS = [
  '/auth/login',
  '/auth/signup',
  '/auth/reissue',
  '/auth/password',
  '/auth/email/request',
  '/auth/email/verify',
]

const PUBLIC_AUTH_PREFIX_PATHS = [
  '/auth/google',
  '/auth/oauth2',
]

function getRequestPath(
  requestUrl: string,
): string {
  try {
    const normalizedBase =
      API_BASE_URL.endsWith(
        '/',
      )
        ? API_BASE_URL
        : `${API_BASE_URL}/`

    return new URL(
      requestUrl,
      normalizedBase,
    ).pathname
  } catch {
    return requestUrl.split(
      '?',
    )[0]
  }
}

function matchesExactApiPath(
  pathname: string,
  targetPath: string,
): boolean {
  return (
    pathname ===
      targetPath ||
    pathname.endsWith(
      targetPath,
    )
  )
}

function matchesApiPathPrefix(
  pathname: string,
  targetPrefix: string,
): boolean {
  const index =
    pathname.indexOf(
      targetPrefix,
    )

  if (
    index === -1
  ) {
    return false
  }

  const remainder =
    pathname.slice(
      index +
        targetPrefix.length,
    )

  return (
    remainder ===
      '' ||
    remainder.startsWith(
      '/',
    )
  )
}

/**
 * 공개 인증 API 여부를 request/response interceptor 양쪽에서
 * 동일한 기준으로 사용합니다.
 *
 * 이렇게 해야
 * "Authorization은 붙이지 않지만 401 refresh는 시도하는"
 * 식의 정책 불일치가 생기지 않습니다.
 */
export function isPublicAuthRequest(
  requestUrl: string,
): boolean {
  const pathname =
    getRequestPath(
      requestUrl,
    )

  if (
    PUBLIC_AUTH_EXACT_PATHS.some(
      (
        path,
      ) =>
        matchesExactApiPath(
          pathname,
          path,
        ),
    )
  ) {
    return true
  }

  return PUBLIC_AUTH_PREFIX_PATHS.some(
    (
      prefix,
    ) =>
      matchesApiPathPrefix(
        pathname,
        prefix,
      ),
  )
}

function redirectToLogin() {
  if (
    window.location.pathname !==
    '/login'
  ) {
    window.location.assign(
      '/login',
    )
  }
}

/**
 * 요청 인터셉터
 *
 * 공개 인증 API:
 * 기존 Authorization을 명시적으로 제거합니다.
 *
 * 보호 API:
 * 현재 Access Token이 존재할 때만 Authorization을 추가합니다.
 */
api.interceptors.request.use(
  (config) => {
    const requestUrl =
      config.url ??
      ''

    if (
      isPublicAuthRequest(
        requestUrl,
      )
    ) {
      /*
       * 혹시 개별 호출부에서 Authorization을 직접 넣었더라도
       * 공개 인증 API에서는 제거합니다.
       */
      config.headers.delete(
        'Authorization',
      )

      return config
    }

    const accessToken =
      getAccessToken()

    if (
      accessToken
    ) {
      config.headers.set(
        'Authorization',
        `Bearer ${accessToken}`,
      )
    }

    return config
  },

  (error) =>
    Promise.reject(
      error,
    ),
)

/**
 * 응답 인터셉터
 *
 * 보호 API에서 Access Token이 만료되어 401이 발생한 경우에만
 * Refresh Token으로 재발급 후 원래 요청을 한 번 재시도합니다.
 *
 * 로그인, Google OAuth, 코드 교환 같은 공개 인증 API의 401은
 * 재발급 대상으로 처리하지 않고 호출부에 그대로 전달합니다.
 */
api.interceptors.response.use(
  (response) =>
    response,

  async (
    error: AxiosError,
  ) => {
    const originalRequest =
      error.config as
        | RetryableRequestConfig
        | undefined

    if (
      !originalRequest
    ) {
      return Promise.reject(
        error,
      )
    }

    const status =
      error.response
        ?.status

    const requestUrl =
      originalRequest.url ??
      ''

    if (
      status !== 401 ||
      originalRequest._retry ||
      isPublicAuthRequest(
        requestUrl,
      )
    ) {
      return Promise.reject(
        error,
      )
    }

    const refreshToken =
      getRefreshToken()

    if (
      !refreshToken
    ) {
      clearAuthStorage()
      redirectToLogin()

      return Promise.reject(
        error,
      )
    }

    originalRequest._retry =
      true

    try {
      if (
        !reissuePromise
      ) {
        /*
         * raw axios를 사용해 /auth/reissue를 호출합니다.
         * 따라서 공용 api interceptor를 다시 타지 않고,
         * Access Token도 포함되지 않습니다.
         */
        reissuePromise =
          axios
            .post<ReissueResponse>(
              `${API_BASE_URL}/auth/reissue`,
              {
                refreshToken,
              },
              {
                headers: {
                  'Content-Type':
                    'application/json',
                },
              },
            )
            .then(
              (
                response,
              ) => {
                const newAccessToken =
                  response.data
                    .result
                    ?.accessToken

                const newRefreshToken =
                  response.data
                    .result
                    ?.refreshToken

                if (
                  !newAccessToken ||
                  !newRefreshToken
                ) {
                  throw new Error(
                    '토큰 재발급 응답이 올바르지 않습니다.',
                  )
                }

                saveReissuedAuthTokens(
                  newAccessToken,
                  newRefreshToken,
                )

                return newAccessToken
              },
            )
            .finally(
              () => {
                reissuePromise =
                  null
              },
            )
      }

      const newAccessToken =
        await reissuePromise

      originalRequest.headers.set(
        'Authorization',
        `Bearer ${newAccessToken}`,
      )

      return api(
        originalRequest,
      )
    } catch (
      reissueError
    ) {
      console.error(
        '토큰 재발급 실패:',
        reissueError,
      )

      clearAuthStorage()
      redirectToLogin()

      return Promise.reject(
        reissueError,
      )
    }
  },
)

export default api