import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()

  // 현재 API 코드에서 사용하는 두 토큰 키를 모두 확인합니다.
  const accessToken =
    localStorage.getItem('accessToken') ??
    localStorage.getItem('token')

  if (!accessToken) {
    // 로그인 후 원래 요청한 내 저장소 주소로 돌아갈 수 있도록 위치를 보관합니다.
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return children
}
