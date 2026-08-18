const AUTH_STORAGE_KEYS = [
  'accessToken',
  'refreshToken',
  'user',
] as const

export interface AuthSessionPayload {
  accessToken: string
  refreshToken: string
  user?: unknown
}

function removeAuthKeys(
  storage: Storage,
) {
  for (
    const key of
      AUTH_STORAGE_KEYS
  ) {
    storage.removeItem(
      key,
    )
  }
}

/**
 * 기존 로그인 정보만 제거합니다.
 *
 * Google OAuth 진행 상태처럼 인증 흐름에 필요한 별도 sessionStorage 값은
 * 지우지 않습니다.
 */
export function clearAuthStorage() {
  removeAuthKeys(
    localStorage,
  )

  removeAuthKeys(
    sessionStorage,
  )
}

export function getAccessToken():
  string | null {
  return (
    localStorage.getItem(
      'accessToken',
    ) ??
    sessionStorage.getItem(
      'accessToken',
    )
  )
}

export function getRefreshToken():
  string | null {
  return (
    localStorage.getItem(
      'refreshToken',
    ) ??
    sessionStorage.getItem(
      'refreshToken',
    )
  )
}

export function isPersistentAuthSession():
  boolean {
  return (
    localStorage.getItem(
      'refreshToken',
    ) !== null ||
    localStorage.getItem(
      'accessToken',
    ) !== null
  )
}

/**
 * 일반 로그인 / Google 로그인 성공 결과를 저장합니다.
 *
 * rememberMe = true
 * → localStorage
 *
 * rememberMe = false
 * → sessionStorage
 */
export function saveAuthSession(
  {
    accessToken,
    refreshToken,
    user,
  }: AuthSessionPayload,

  rememberMe: boolean,
) {
  clearAuthStorage()

  const targetStorage =
    rememberMe
      ? localStorage
      : sessionStorage

  targetStorage.setItem(
    'accessToken',
    accessToken,
  )

  targetStorage.setItem(
    'refreshToken',
    refreshToken,
  )

  if (
    user !== undefined
  ) {
    targetStorage.setItem(
      'user',
      JSON.stringify(
        user,
      ),
    )
  }
}

/**
 * 토큰 재발급 시 기존 로그인 저장 위치를 유지합니다.
 */
export function saveReissuedAuthTokens(
  accessToken: string,
  refreshToken: string,
) {
  const targetStorage =
    isPersistentAuthSession()
      ? localStorage
      : sessionStorage

  targetStorage.setItem(
    'accessToken',
    accessToken,
  )

  targetStorage.setItem(
    'refreshToken',
    refreshToken,
  )
}