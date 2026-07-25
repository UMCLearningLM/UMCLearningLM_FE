export const MOCK_AUTH_STORAGE_KEY =
  'learninglm.mock-auth-user'

export const MOCK_AUTH_CHANGED_EVENT =
  'learninglm:mock-auth-changed'

export type AuthProvider =
  | 'email'
  | 'google'

export interface MockAuthUser {
  id: number
  name: string
  email: string
  provider: AuthProvider
  avatarInitial: string
}

/*
 * VITE_USE_MOCK_AUTH를 명시하지 않은 개발 환경에서는
 * 백엔드가 준비되지 않은 현재 상황에 맞춰 Mock을 기본 사용합니다.
 *
 * 실제 API를 사용할 때:
 * VITE_USE_MOCK_AUTH=false
 */
export const USE_MOCK_AUTH =
  import.meta.env.VITE_USE_MOCK_AUTH !==
  'false'

export const MOCK_EMAIL_ACCOUNT = {
  email: 'ssemilife@gmail.com',
  password: '12345678',
} as const

export const MOCK_EMAIL_USER: MockAuthUser =
  {
    id: 1,
    name: '민지',
    email: MOCK_EMAIL_ACCOUNT.email,
    provider: 'email',
    avatarInitial: '민',
  }

export const MOCK_GOOGLE_USER: MockAuthUser =
  {
    id: 2,
    name: '구글 사용자',
    email:
      'learninglm.google@gmail.com',
    provider: 'google',
    avatarInitial: '구',
  }

function dispatchAuthChangedEvent(
  user: MockAuthUser | null,
) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(
      MOCK_AUTH_CHANGED_EVENT,
      {
        detail: user,
      },
    ),
  )
}

export function saveMockAuthUser(
  user: MockAuthUser,
) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    MOCK_AUTH_STORAGE_KEY,
    JSON.stringify(user),
  )

  dispatchAuthChangedEvent(user)
}

export function getMockAuthUser():
  | MockAuthUser
  | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedValue =
    window.localStorage.getItem(
      MOCK_AUTH_STORAGE_KEY,
    )

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(
      storedValue,
    ) as MockAuthUser
  } catch {
    window.localStorage.removeItem(
      MOCK_AUTH_STORAGE_KEY,
    )

    return null
  }
}

export function removeMockAuthUser() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(
    MOCK_AUTH_STORAGE_KEY,
  )

  dispatchAuthChangedEvent(null)
}