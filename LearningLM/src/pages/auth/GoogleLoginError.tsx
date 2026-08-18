import {
  Info,
} from 'lucide-react'

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  clearAuthStorage,
} from '../../api/authStorage'
import googleImg from '../../assets/google.svg';

function getFallbackMessage(
  errorCode: string,
): string {
  switch (
  errorCode
  ) {
    case 'OAUTH_CODE_MISSING':
      return 'Google 인증 코드가 없습니다.'

    case 'TOKEN_EXCHANGE_FAILED':
      return 'Google 인증 코드 교환에 실패했습니다.'

    case 'GOOGLE_AUTH_START_FAILED':
      return 'Google 로그인 요청을 시작하지 못했습니다.'

    default:
      return 'Google 인증에 실패했습니다.'
  }
}

export default function GoogleLoginError() {
  const navigate =
    useNavigate()

  const [
    searchParams,
  ] =
    useSearchParams()

  const errorCode =
    searchParams.get(
      'error',
    ) ||
    'GOOGLE_LOGIN_FAILED'

  const errorMessage =
    searchParams.get(
      'message',
    ) ||
    getFallbackMessage(
      errorCode,
    )

  const handleRetry =
    () => {
      /*
       * 실패 후 다시 시도할 때도 오래된 인증정보가
       * Google 공개 API 요청에 섞이지 않게 정리합니다.
       */
      clearAuthStorage()

      navigate(
        '/auth/google/loading',
        {
          replace:
            true,
        },
      )
    }

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

        <div className="flex w-full flex-col items-center rounded-[12px] border-2 border-[#E4E4E7] bg-white px-[40px] py-[50px]">
          <div className="flex w-full flex-col items-center gap-[38px]">
            {/* <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#FBF1F0] text-[#EF8888]">
              <Info
                size={32}
              />
            </div> */}
            <img src={googleImg} className='w-[60px] h-[60px]' />

            <div className="flex w-full flex-col items-center gap-[11px]">
              <h1 className="text-center text-[28px] font-bold tracking-[-0.03em] text-[#27272A]">
                Google 계정으로 인증 실패
              </h1>

              <p className="text-center text-[18px] text-[#52525B]">
                잠시만 기다려 주세요. 권한 확인을 실패하여 잠시 중단합니다.
              </p>
            </div>

            <div className="w-full rounded-[12px] border-2 border-[#E9C9C9] bg-[#FBF1F0] px-[24px] py-[22px]">
              <div className="flex items-start gap-[12px]">
                <Info
                  size={24}
                  className="mt-[1px] shrink-0 text-[#EF8888]"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-[#27272A]">
                    인증 실패
                  </p>

                  <p className="mt-[4px] break-words text-[15px] leading-[22px] text-[#52525B]">
                    {errorMessage}
                  </p>
                </div>
              </div>

              <div className="mt-[20px] flex justify-end">
                <button
                  type="button"
                  onClick={
                    handleRetry
                  }
                  className="text-[16px] font-bold text-[#6366F1]"
                >
                  다시 시도
                </button>
              </div>
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