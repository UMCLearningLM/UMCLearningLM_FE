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

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let reissuePromise: Promise<string> | null = null

function getAccessToken() {
  return (
    localStorage.getItem('accessToken') ??
    sessionStorage.getItem('accessToken')
  )
}

function getRefreshToken() {
  return (
    localStorage.getItem('refreshToken') ??
    sessionStorage.getItem('refreshToken')
  )
}

function clearAuthStorage() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('refreshToken')
  sessionStorage.removeItem('user')
}

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

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
      requestUrl.startsWith(path),
  )
}

api.interceptors.request.use(
  (config) => {
    const accessToken =
      getAccessToken()

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`
    }

    return config
  },

  (error) =>
    Promise.reject(error),
)

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

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const status =
      error.response?.status

    const requestUrl =
      originalRequest.url ?? ''

    if (
      status !== 401 ||
      originalRequest._retry ||
      isReissueExcludedRequest(
        requestUrl,
      )
    ) {
      return Promise.reject(error)
    }

    const refreshToken =
      getRefreshToken()

    if (!refreshToken) {
      clearAuthStorage()
      redirectToLogin()

      return Promise.reject(error)
    }

    originalRequest._retry =
      true

    try {
      if (!reissuePromise) {
        reissuePromise =
          axios
            .post(
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
                const {
                  accessToken:
                    newAccessToken,
                  refreshToken:
                    newRefreshToken,
                } =
                  response.data.result

                if (
                  !newAccessToken ||
                  !newRefreshToken
                ) {
                  throw new Error(
                    '토큰 재발급 응답이 올바르지 않습니다.',
                  )
                }

                const useLocalStorage =
                  localStorage.getItem(
                    'refreshToken',
                  ) !== null

                if (useLocalStorage) {
                  localStorage.setItem(
                    'accessToken',
                    newAccessToken,
                  )

                  localStorage.setItem(
                    'refreshToken',
                    newRefreshToken,
                  )
                } else {
                  sessionStorage.setItem(
                    'accessToken',
                    newAccessToken,
                  )

                  sessionStorage.setItem(
                    'refreshToken',
                    newRefreshToken,
                  )
                }

                return newAccessToken
              },
            )
            .finally(
              () => {
                reissuePromise = null
              },
            )
      }

      const newAccessToken =
        await reissuePromise

      originalRequest.headers =
        originalRequest.headers ?? {}

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch (reissueError) {
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