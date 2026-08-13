import {
  useEffect,
  useState,
} from 'react'

import {
  Check,
} from 'lucide-react'

import {
  FcGoogle,
} from 'react-icons/fc'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import api from '../api/api'

import {
  clearAuthStorage,
  saveAuthSession,
} from '../api/authStorage'

interface LoginLocationState {
  from?: {
    pathname: string
    search?: string
    hash?: string
  }
}

function isSafeInternalPath(
  pathname: string,
): boolean {
  return (
    pathname.startsWith(
      '/',
    ) &&
    !pathname.startsWith(
      '//',
    )
  )
}

export function Login() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const [
    rememberMe,
    setRememberMe,
  ] =
    useState(false)

  const [
    email,
    setEmail,
  ] =
    useState('')

  const [
    password,
    setPassword,
  ] =
    useState('')

  const [
    emailState,
    setEmailState,
  ] =
    useState<
      'basic' |
      'incorrect' |
      'success'
    >(
      'basic',
    )

  const [
    emailFormError,
    setEmailFormError,
  ] =
    useState(false)

  const [
    passwordState,
    setPasswordState,
  ] =
    useState<
      'basic' |
      'incorrect' |
      'success'
    >(
      'basic',
    )

  const [
    passwordLengthState,
    setPasswordLengthState,
  ] =
    useState<
      'basic' |
      'incorrect' |
      'success'
    >(
      'basic',
    )

  const validateEmail = (
    value: string,
  ) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(
      value,
    )
  }

  useEffect(
    () => {
      if (
        password.length >
          0 &&
        password.length <
          8
      ) {
        setPasswordLengthState(
          'incorrect',
        )

        return
      }

      setPasswordLengthState(
        'success',
      )
    },
    [
      password,
    ],
  )

  const getRedirectPath =
    (): string | null => {
      const state =
        location.state as
          | LoginLocationState
          | null

      const from =
        state?.from

      if (
        !from?.pathname ||
        !isSafeInternalPath(
          from.pathname,
        )
      ) {
        return null
      }

      return (
        `${from.pathname}` +
        `${from.search ?? ''}` +
        `${from.hash ?? ''}`
      )
    }

  const login =
    async () => {
      if (
        !validateEmail(
          email,
        )
      ) {
        setEmailFormError(
          true,
        )

        return
      }

      setEmailFormError(
        false,
      )

      if (
        password.length <
        8
      ) {
        setPasswordLengthState(
          'incorrect',
        )

        return
      }

      setPasswordLengthState(
        'success',
      )

      setEmailState(
        'basic',
      )

      setPasswordState(
        'basic',
      )

      /*
       * 로그인 재시도 전에 이전 인증정보를 먼저 정리합니다.
       *
       * api.ts에서도 /auth/login에는 Authorization을 붙이지 않지만,
       * 오래된 인증정보가 로그인 성공 이후의 상태 판단에 섞이지 않도록
       * 로그인 시작 시점에도 한 번 정리합니다.
       */
      clearAuthStorage()

      try {
        const response =
          await api.post(
            '/auth/login',
            {
              email,

              password,

              rememberMe,
            },
          )

        const {
          accessToken,
          refreshToken,
        } =
          response.data
            .result

        saveAuthSession(
          {
            accessToken,

            refreshToken,

            /*
             * 기존 코드와의 호환을 위해 로그인 result를
             * 그대로 user 저장값으로 유지합니다.
             */
            user:
              response.data
                .result,
          },

          rememberMe,
        )

        const redirectPath =
          getRedirectPath()

        if (
          redirectPath
        ) {
          navigate(
            redirectPath,
            {
              replace:
                true,
            },
          )

          return
        }

        navigate(
          '/',
          {
            replace:
              true,
          },
        )
      } catch (
        error: any
      ) {
        console.error(
          '로그인 실패:',
          error,
        )

        if (
          error.response
        ) {
          console.error(
            '상태 코드:',
            error.response
              .status,
          )

          console.error(
            '에러 응답:',
            error.response
              .data,
          )
        }

        if (
          error.response
            ?.status ===
          401
        ) {
          setEmailState(
            'incorrect',
          )

          setPasswordState(
            'incorrect',
          )
        }
      }
    }

  const googleLogin =
    () => {
      /*
       * Google 로그인도 명시적인 새 로그인 시도이므로
       * 이전 Access/Refresh Token을 제거합니다.
       */
      clearAuthStorage()

      sessionStorage.setItem(
        'googleLoginRememberMe',
        rememberMe
          ? 'true'
          : 'false',
      )

      const redirectPath =
        getRedirectPath()

      if (
        redirectPath
      ) {
        sessionStorage.setItem(
          'googleLoginRedirect',
          redirectPath,
        )
      } else {
        sessionStorage.removeItem(
          'googleLoginRedirect',
        )
      }

      navigate(
        '/auth/google/loading',
      )
    }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-[#F5F5F7] text-[#464646] text-[18px] pt-[91px]">
        <div className="px-[10px] flex flex-col items-center mb-[34px]">
          <div className="flex flex-row gap-[8px]">
            <div className="h-[40px] flex flex-col rounded-[8px] bg-[#6366F1] px-[15px] justify-center items-center text-[21px] font-bold text-[#FFF]">
              L
            </div>

            <p className="mt-[-1.5px] text-[#27272A] text-[26px] font-bold">
              LearningLM
            </p>
          </div>

          <p className="text-[#52525B] text-[15px] mt-[9.5px] tracking-tighter">
            AI활용 흐름을 블록형 튜토리얼로 배우는 플랫폼
          </p>
        </div>

        <div className="bg-white w-[600px] min-h-[791px] flex flex-col items-center px-[10px] py-[39px] rounded-[12px] border-[#E4E4E7] border-[2px]">
          <div className="flex flex-col w-[529px]">
            <p className="text-[28px] font-bold text-[#27272A] tracking-tighter">
              로그인
            </p>

            <p className="text-[15px] text-[#52525B] tracking-tighter">
              학습을 이어서 진행하려면 로그인하세요.
            </p>
          </div>

          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col mt-[26px] w-[519px]">
              <p className="text-[20px]">
                이메일
              </p>

              <div className="mt-[8px]">
                <input
                  type="email"
                  onChange={(
                    event,
                  ) => {
                    setEmail(
                      event.target
                        .value,
                    )

                    setEmailState(
                      'basic',
                    )
                  }}
                  value={
                    email
                  }
                  placeholder="you@example.com"
                  className="hover:border-[#666666] w-full h-[51px] flex items-center pl-[20px] rounded-[8px] border-2 border-[#E4E4E7]"
                />

                {emailState ===
                  'incorrect' && (
                  <p className="mt-[6.5px] text-[16px] font-bold text-[#EF8888] tracking-tighter">
                    이메일이 맞지 않습니다. 다시 입력해주세요.
                  </p>
                )}

                {emailFormError && (
                  <p className="mt-[4px] text-[16px] font-bold text-[#EF8888] tracking-tighter">
                    유효한 이메일이 아닙니다. 다시 작성해 주세요.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col w-[519px] mt-[-8px]">
              <p className="text-[20px] tracking-tighter">
                비밀번호
              </p>

              <input
                type="password"
                onChange={(
                  event,
                ) => {
                  setPassword(
                    event.target
                      .value,
                  )

                  setPasswordState(
                    'basic',
                  )
                }}
                value={
                  password
                }
                placeholder="********"
                className="hover:border-[#666666] h-[51px] flex items-center rounded-[8px] mt-[8px] pl-[20px] border-2 border-[#E4E4E7]"
              />

              {passwordState ===
                'incorrect' && (
                <p className="mt-[6px] text-[16px] font-bold text-[#EF8888] tracking-tighter">
                  비밀번호가 맞지 않습니다. 다시 입력해주세요.
                </p>
              )}

              {passwordLengthState ===
                'incorrect' && (
                <p className="mt-[4px] text-[16px] font-bold text-[#EF8888] tracking-tighter">
                  비밀번호 8자리 이상 입력해주세요.
                </p>
              )}
            </div>

            <label className="w-[519px] mt-[-7px] cursor-pointer agreement flex items-center">
              <input
                type="checkbox"
                checked={
                  rememberMe
                }
                className="hidden"
                onChange={(
                  event,
                ) => {
                  setRememberMe(
                    event.target
                      .checked,
                  )
                }}
              />

              <div
                className={[
                  'w-[17px] h-[17px] flex items-center justify-center text-center border-2 rounded-[2px] border-[#6366F1]',

                  rememberMe
                    ? 'bg-[#6366F1]'
                    : 'border-[#6366F1]',
                ].join(
                  ' ',
                )}
              >
                {rememberMe && (
                  <Check
                    size={18}
                    className="text-white stroke-[3]"
                  />
                )}
              </div>

              <span className="text-[15.5px] text-[#52525B] tracking-tighter">
                로그인 상태 유지
              </span>
            </label>

            <button
              type="button"
              className="hover:bg-[#6366F1] hover:text-white text-[#9D9ED0] cursor-pointer w-[519px] h-[51px] mt-[-4px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
              onClick={() => {
                void login()
              }}
            >
              <span className="text-[24px] font-bold tracking-tighter">
                로그인
              </span>
            </button>
          </div>

          <div className="flex items-center w-[519px] mt-[30px]">
            <div className="flex-1 h-px bg-[#E4E4E7]" />

            <span className="mx-[16px] text-[#9A9AA3] text-[15px] tracking-tighter">
              또는
            </span>

            <div className="flex-1 h-px bg-[#E4E4E7]" />
          </div>

          <button
            type="button"
            className="cursor-pointer w-[522px] h-[56px] mt-[28px] flex items-center justify-center gap-[10px] rounded-[8px] border-2 border-[#E4E4E7]"
            onClick={
              googleLogin
            }
          >
            <FcGoogle
              size={32}
            />

            <span className="cursor-pointer text-[18px] font-bold text-[#27272A] tracking-tighter">
              Google 계정으로 계속하기
            </span>
          </button>

          <div className="mb-[3px]">
            <p className="text-[#52525B] text-[16px] mt-[20.5px] tracking-tighter">
              아직 계정이 없으신가요?{' '}

              <button
                type="button"
                onClick={() => {
                  navigate(
                    '/register',
                  )
                }}
              >
                <span className="cursor-pointer text-[#6366F1] font-bold mt-[20px]">
                  회원가입
                </span>
              </button>
            </p>

            <p className="text-[#52525B] text-[16px] mt-[8px] tracking-tighter">
              비밀번호를 잊으셨나요?{' '}

              <button
                type="button"
                onClick={() => {
                  navigate(
                    '/pw-find',
                  )
                }}
              >
                <span className="cursor-pointer text-[#6366F1] font-bold mt-[20px]">
                  비밀번호 찾기
                </span>
              </button>
            </p>
          </div>
        </div>

        <div className="flex flex-row mt-[32px] mb-[86px] text-[16px] text-[#9A9AA3] gap-[38px]">
          <p>
            ©2026LearningLM
          </p>

          <p>
            이용약관
          </p>

          <p>
            개인정보처리방침
          </p>
        </div>
      </div>
    </>
  )
}