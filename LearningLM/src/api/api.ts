import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

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
 * 일반 객체 요청은 Axios가 JSON으로 처리하고,
 * 이후 프로필 이미지처럼 FormData를 전송할 때는
 * multipart boundary를 Axios가 자동으로 설정할 수 있게 둡니다.
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

function getAccessToken() {
  return (
    localStorage.getItem(
      'accessToken',
    ) ??
    sessionStorage.getItem(
      'accessToken',
    )
  )
}

function getRefreshToken() {
  return (
    localStorage.getItem(
      'refreshToken',
    ) ??
    sessionStorage.getItem(
      'refreshToken',
    )
  )
}

function usesLocalStorageAuth() {
  return (
    localStorage.getItem(
      'refreshToken',
    ) !== null
  )
}

function saveReissuedTokens(
  accessToken: string,
  refreshToken: string,
) {
  if (
    usesLocalStorageAuth()
  ) {
    localStorage.setItem(
      'accessToken',
      accessToken,
    )

    localStorage.setItem(
      'refreshToken',
      refreshToken,
    )

    return
  }

  sessionStorage.setItem(
    'accessToken',
    accessToken,
  )

  sessionStorage.setItem(
    'refreshToken',
    refreshToken,
  )
}

function clearAuthStorage() {
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
 * 여기 포함된 인증 API에서 401이 발생했을 때는
 * Refresh Token 재발급을 다시 시도하지 않습니다.
 *
 * 특히 /auth/reissue 자체가 401인데 다시 /auth/reissue를 호출하면
 * 무한 재시도 구조가 생길 수 있으므로 반드시 제외합니다.
 */
const reissueExcludedPaths = [
  '/auth/login',
  '/auth/signup',
  '/auth/reissue',
  '/auth/google',
  '/auth/google/token',
  '/auth/oauth2',
  '/auth/email/request',
  '/auth/email/verify',
  '/auth/password',
]

function isReissueExcludedRequest(
  requestUrl: string,
) {
  return reissueExcludedPaths.some(
    (path) =>
      requestUrl.startsWith(
        path,
      ),
  )
}

/**
 * 모든 공용 API 요청에 현재 저장된 Access Token을 붙입니다.
 *
 * 로그인 상태 유지:
 * localStorage
 *
 * 로그인 상태 유지 안 함:
 * sessionStorage
 */
api.interceptors.request.use(
  (config) => {
    const accessToken =
      getAccessToken()

    if (
      accessToken
    ) {
      /*
       * InternalAxiosRequestConfig.headers는 AxiosHeaders 기반 타입이므로
       * 단순 객체를 새로 할당하지 않고 set()을 사용합니다.
       */
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
 * Access Token 만료 시 Refresh Token으로 토큰을 재발급하고
 * 실패했던 원래 요청을 한 번만 다시 실행합니다.
 *
 * 동시에 여러 API가 401을 받아도 reissuePromise 하나만 공유하여
 * /auth/reissue 요청이 여러 번 중복되지 않게 합니다.
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
      isReissueExcludedRequest(
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

                saveReissuedTokens(
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

      /*
       * 기존 코드:
       *
       * originalRequest.headers =
       *   originalRequest.headers ?? {}
       *
       * Axios 1.x의 InternalAxiosRequestConfig.headers는
       * AxiosRequestHeaders/AxiosHeaders이기 때문에
       * 빈 객체 {}를 대입하면 TS2322가 발생합니다.
       *
       * headers는 이미 존재하므로 AxiosHeaders.set()으로
       * 갱신하면 해당 타입 오류 없이 재시도할 수 있습니다.
       */
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