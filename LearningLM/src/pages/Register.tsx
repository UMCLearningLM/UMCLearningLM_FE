import axios from 'axios'
import { Check } from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../api/api'
import { saveAuthSession } from '../api/authStorage'

type VerificationStatus =
  | 'idle'
  | 'code-sent'
  | 'verified'
  | 'verification-error'

interface FeedbackMessage {
  type: 'error' | 'success'
  text: string
}

function validateEmail(
  value: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  )
}

function validatePassword(
  value: string,
): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(
    value,
  )
}

function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    axios.isAxiosError(error)
  ) {
    const message =
      error.response?.data
        ?.message

    if (
      typeof message ===
      'string' &&
      message.trim()
    ) {
      return message
    }
  }

  if (
    error instanceof Error &&
    error.message.trim()
  ) {
    return error.message
  }

  return fallback
}

function isDuplicateEmailError(
  error: unknown,
): boolean {
  if (
    !axios.isAxiosError(error)
  ) {
    return false
  }

  if (
    error.response?.status ===
    409
  ) {
    return true
  }

  const responseData =
    error.response?.data as
    | {
      code?: unknown
      message?: unknown
    }
    | undefined

  const searchableText = [
    responseData?.code,
    responseData?.message,
  ]
    .filter(
      (
        value,
      ): value is string =>
        typeof value ===
        'string',
    )
    .join(' ')
    .toLowerCase()

  return (
    searchableText.includes(
      'duplicate',
    ) ||
    searchableText.includes(
      'already',
    ) ||
    searchableText.includes(
      'exist',
    ) ||
    searchableText.includes(
      '이미',
    ) ||
    searchableText.includes(
      '가입',
    ) ||
    searchableText.includes(
      '중복',
    )
  )
}

export function Register() {
  const navigate =
    useNavigate()

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    verificationCode,
    setVerificationCode,
  ] = useState('')

  const [
    verificationStatus,
    setVerificationStatus,
  ] =
    useState<VerificationStatus>(
      'idle',
    )

  const [
    temporaryAccessToken,
    setTemporaryAccessToken,
  ] = useState('')

  const [
    emailMessage,
    setEmailMessage,
  ] =
    useState<FeedbackMessage | null>(
      null,
    )

  const [
    isSendingEmail,
    setIsSendingEmail,
  ] = useState(false)

  const [
    isVerifyingCode,
    setIsVerifyingCode,
  ] = useState(false)

  const [
    countdown,
    setCountdown,
  ] = useState(180)

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    passwordConfirm,
    setPasswordConfirm,
  ] = useState('')

  const [
    nickname,
    setNickname,
  ] = useState('')

  const [
    agreed,
    setAgreed,
  ] = useState(false)

  const [
    showAgreementError,
    setShowAgreementError,
  ] = useState(false)

  const [
    showPasswordError,
    setShowPasswordError,
  ] = useState(false)

  const [
    showPasswordMismatch,
    setShowPasswordMismatch,
  ] = useState(false)

  const [
    showNicknameError,
    setShowNicknameError,
  ] = useState(false)

  const [
    signupMessage,
    setSignupMessage,
  ] =
    useState<FeedbackMessage | null>(
      null,
    )

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const emailVerified =
    verificationStatus ===
    'verified' &&
    Boolean(
      temporaryAccessToken.trim(),
    )

  const passwordValid =
    validatePassword(
      password,
    )

  const passwordsMatch =
    Boolean(password) &&
    password ===
    passwordConfirm

  useEffect(
    () => {
      if (
        verificationStatus !==
        'code-sent'
      ) {
        return
      }

      if (
        countdown <=
        0
      ) {
        setVerificationStatus(
          'idle',
        )
        setVerificationCode(
          '',
        )
        setEmailMessage({
          type:
            'error',
          text:
            '인증 시간이 만료되었습니다. 인증번호를 다시 요청해 주세요.',
        })

        return
      }

      const timer =
        window.setTimeout(
          () => {
            setCountdown(
              (
                current,
              ) =>
                current -
                1,
            )
          },
          1000,
        )

      return () => {
        window.clearTimeout(
          timer,
        )
      }
    },
    [
      countdown,
      verificationStatus,
    ],
  )

  const resetVerification =
    () => {
      setVerificationStatus(
        'idle',
      )
      setTemporaryAccessToken(
        '',
      )
      setVerificationCode(
        '',
      )
      setCountdown(
        180,
      )
      setEmailMessage(
        null,
      )
    }

  const handleEmailChange =
    (
      value: string,
    ) => {
      setEmail(
        value,
      )

      if (
        verificationStatus !==
        'idle' ||
        temporaryAccessToken
      ) {
        resetVerification()
      }

      setSignupMessage(
        null,
      )
    }

  const sendEmail =
    async () => {
      const normalizedEmail =
        email.trim()

      setSignupMessage(
        null,
      )

      if (
        !validateEmail(
          normalizedEmail,
        )
      ) {
        setEmailMessage({
          type:
            'error',
          text:
            '유효한 이메일이 아닙니다. 다시 작성해 주세요.',
        })

        return
      }

      setIsSendingEmail(
        true,
      )
      setEmailMessage(
        null,
      )

      try {
        await api.post(
          '/auth/email/request',
          {
            verificationType:
              'NON_LOGIN',
            purpose:
              'SIGNUP',
            email:
              normalizedEmail,
          },
        )

        setVerificationStatus(
          'code-sent',
        )
        setVerificationCode(
          '',
        )
        setCountdown(
          180,
        )
        setEmailMessage({
          type:
            'success',
          text:
            '인증번호를 전송했습니다. 이메일을 확인해 주세요.',
        })
      } catch (
      error
      ) {
        console.error(
          '인증번호 전송 실패:',
          error,
        )

        setVerificationStatus(
          'idle',
        )
        setTemporaryAccessToken(
          '',
        )

        if (
          isDuplicateEmailError(
            error,
          )
        ) {
          setEmailMessage({
            type:
              'error',
            text:
              '이미 가입된 이메일입니다. 로그인해 주세요.',
          })

          return
        }

        setEmailMessage({
          type:
            'error',
          text:
            getApiErrorMessage(
              error,
              '인증메일을 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.',
            ),
        })
      } finally {
        setIsSendingEmail(
          false,
        )
      }
    }

  const verifyCode =
    async () => {
      const code =
        verificationCode.trim()

      if (!code) {
        setEmailMessage({
          type:
            'error',
          text:
            '인증번호를 입력해 주세요.',
        })

        return
      }

      setIsVerifyingCode(
        true,
      )
      setEmailMessage(
        null,
      )

      try {
        const response =
          await api.post(
            '/auth/email/verify',
            {
              verificationType:
                'NON_LOGIN',
              purpose:
                'SIGNUP',
              email:
                email.trim(),
              code,
            },
          )

        const temporaryToken =
          response.data
            ?.result
            ?.temporaryAccessToken

        if (
          typeof temporaryToken !==
          'string' ||
          !temporaryToken.trim()
        ) {
          throw new Error(
            '이메일 인증 토큰을 받지 못했습니다.',
          )
        }

        setTemporaryAccessToken(
          temporaryToken,
        )
        setVerificationStatus(
          'verified',
        )
      } catch (
      error
      ) {
        console.error(
          '이메일 인증 실패:',
          error,
        )

        setTemporaryAccessToken(
          '',
        )
        setVerificationStatus(
          'verification-error',
        )
        setEmailMessage({
          type:
            'error',
          text:
            getApiErrorMessage(
              error,
              '인증번호가 유효하지 않습니다. 다시 입력해 주세요.',
            ),
        })
      } finally {
        setIsVerifyingCode(
          false,
        )
      }
    }

  const memberOk =
    async () => {
      setSignupMessage(
        null,
      )

      if (
        !emailVerified
      ) {
        setEmailMessage({
          type:
            'error',
          text:
            '이메일 인증을 완료해 주세요.',
        })

        return
      }

      if (
        !passwordValid
      ) {
        setShowPasswordError(
          true,
        )

        return
      }

      setShowPasswordError(
        false,
      )

      if (
        !passwordsMatch
      ) {
        setShowPasswordMismatch(
          true,
        )

        return
      }

      setShowPasswordMismatch(
        false,
      )

      if (
        !nickname.trim()
      ) {
        setShowNicknameError(
          true,
        )

        return
      }

      setShowNicknameError(
        false,
      )

      if (!agreed) {
        setShowAgreementError(
          true,
        )

        return
      }

      setShowAgreementError(
        false,
      )
      setIsSubmitting(
        true,
      )

      try {
        const response =
          await api.post(
            '/auth/signup',
            {
              email:
                email.trim(),
              password,
              nickname:
                nickname.trim(),
              termsAgreed:
                true,
            },
            {
              headers: {
                'X-Email-Verification-Token':
                  temporaryAccessToken.trim(),
              },
            },
          )

        const result =
          response.data
            ?.result

        const accessToken =
          result?.accessToken

        const refreshToken =
          result?.refreshToken

        if (
          typeof accessToken ===
          'string' &&
          accessToken &&
          typeof refreshToken ===
          'string' &&
          refreshToken
        ) {
          saveAuthSession(
            {
              accessToken,
              refreshToken,
              user:
                result,
            },
            true,
          )
        }

        setSignupMessage({
          type:
            'success',
          text:
            '회원가입이 완료되었습니다.',
        })

        navigate(
          '/',
          {
            replace:
              true,
          },
        )
      } catch (
      error
      ) {
        console.error(
          '회원가입 실패:',
          error,
        )

        if (
          isDuplicateEmailError(
            error,
          )
        ) {
          setSignupMessage({
            type:
              'error',
            text:
              '이미 가입된 이메일입니다. 로그인해 주세요.',
          })

          return
        }

        setSignupMessage({
          type:
            'error',
          text:
            getApiErrorMessage(
              error,
              '회원가입을 완료하지 못했습니다. 입력 내용을 확인한 뒤 다시 시도해 주세요.',
            ),
        })
      } finally {
        setIsSubmitting(
          false,
        )
      }
    }

  const verificationArea =
    () => {
      if (
        emailVerified
      ) {
        return (
          <p className="mt-[11px] font-bold text-[#5FAA81]">
            이메일 인증을
            완료했습니다.
          </p>
        )
      }

      if (
        verificationStatus ===
        'code-sent' ||
        verificationStatus ===
        'verification-error'
      ) {
        return (
          <>
            <input
              type="text"
              value={
                verificationCode
              }
              onChange={(
                event,
              ) => {
                setVerificationCode(
                  event.target
                    .value,
                )
              }}
              placeholder="인증번호 6자리를 입력해주세요."
              className={[
                'mt-[15px] h-[54px] rounded-[8px] border-2 pl-[20px] outline-none',
                verificationStatus ===
                  'verification-error'
                  ? 'border-[#F8A3A3]'
                  : 'border-[#E4E4E7] hover:border-[#666666]',
              ].join(
                ' ',
              )}
            />

            <div className="flex items-center justify-between">
              <p className="my-[15px] text-[15px] text-[#666666]">
                인증번호를 받지
                못하셨나요?{' '}
                <button
                  type="button"
                  disabled={
                    isSendingEmail
                  }
                  onClick={() => {
                    void sendEmail()
                  }}
                  className="font-bold text-[#6366F1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  인증번호 재전송
                </button>
              </p>

              <span className="font-bold text-[#EF8888]">
                {Math.floor(
                  countdown /
                  60,
                )}
                :
                {String(
                  countdown %
                  60,
                ).padStart(
                  2,
                  '0',
                )}
              </span>
            </div>

            <button
              type="button"
              disabled={
                isVerifyingCode
              }
              onClick={() => {
                void verifyCode()
              }}
              className="mt-[2px] h-[48px] w-[112px] cursor-pointer rounded-[10px] border-2 border-[#6366F1] text-[17px] font-bold text-[#6366F1] transition-colors hover:bg-[#6366F1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifyingCode
                ? '확인 중'
                : '인증 완료'}
            </button>
          </>
        )
      }

      return (
        <button
          type="button"
          disabled={
            isSendingEmail
          }
          onClick={() => {
            void sendEmail()
          }}
          className="mt-[13px] flex h-[49px] w-[145px] cursor-pointer items-center justify-center rounded-[12px] border-2 border-[#6366F1] bg-[#6366F1] text-[17px] font-bold text-white transition-colors hover:border-[#3A3DC2] hover:bg-[#3A3DC2] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSendingEmail
            ? '전송 중'
            : '인증번호 전송'}
        </button>
      )
    }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-[100px] pt-[36px] text-[18px] text-[#52525B]">
      <div className="mx-auto w-[580px] max-w-[calc(100%_-_32px)]">
        <button
          type="button"
          onClick={() => {
            navigate('/')
          }}
          className="mb-[28px] text-[14px] font-bold text-[#6366F1] hover:text-[#3A3DC2]"
        >
          ← 홈으로 돌아가기
        </button>

        <button
          type="button"
          onClick={() => {
            navigate('/')
          }}
          aria-label="LearningLM 홈으로 이동"
          className="mx-auto mb-[37px] flex flex-col items-center"
        >
          <span className="flex items-center gap-[8px]">
            <span className="flex h-[39px] w-[40px] items-center justify-center rounded-[8px] bg-[#6366F1] text-[22px] font-bold text-white">
              L
            </span>

            <span className="text-[26px] font-bold text-[#27272A]">
              LearningLM
            </span>
          </span>

          <span className="mt-[11px] text-[15px] tracking-tighter text-[#52525B]">
            AI활용 흐름을 블록형
            튜토리얼로 배우는 플랫폼
          </span>
        </button>

        <div className="flex min-h-[858px] flex-col items-center rounded-[12px] border border-[#E4E4E7] bg-white px-[25px] pb-[44px] pt-[41px]">
          <div className="flex w-full flex-col tracking-tighter">
            <p className="text-[27px] font-bold text-[#27272A]">
              회원가입
            </p>

            <p className="mt-[1px] text-[15px] text-[#52525B]">
              무료로 시작하고 첫
              튜토리얼을 진행해 보세요.
            </p>
          </div>

          <div className="mt-[39px] flex w-full flex-col gap-[20px]">
            <div className="flex flex-col tracking-tighter">
              <p className="text-[16.5px] font-bold text-[#52525B]">
                이메일
              </p>

              <input
                type="email"
                value={
                  email
                }
                disabled={
                  emailVerified
                }
                onChange={(
                  event,
                ) => {
                  handleEmailChange(
                    event.target
                      .value,
                  )
                }}
                placeholder="you@example.com"
                className="mt-[5px] h-[50px] rounded-[8px] border-2 border-[#E4E4E7] pl-[20px] outline-none hover:border-[#666666] disabled:bg-[#F5F5F7] disabled:text-[#9A9AA3]"
              />

              {verificationArea()}

              {emailMessage && (
                <div className="mt-[11px]">
                  <p
                    className={[
                      'font-bold',
                      emailMessage.type ===
                        'success'
                        ? 'text-[#5FAA81]'
                        : 'text-[#EF8888]',
                    ].join(
                      ' ',
                    )}
                  >
                    {
                      emailMessage.text
                    }
                  </p>

                  {emailMessage.type ===
                    'error' &&
                    emailMessage.text.includes(
                      '이미 가입',
                    ) && (
                      <button
                        type="button"
                        onClick={() => {
                          navigate(
                            '/login',
                          )
                        }}
                        className="mt-[7px] text-[15px] font-bold text-[#6366F1] hover:text-[#3A3DC2]"
                      >
                        로그인으로 이동
                      </button>
                    )}
                </div>
              )}
            </div>

            <div className="flex flex-col tracking-tighter">
              <p className="text-[16.5px] font-bold text-[#52525B]">
                비밀번호
              </p>

              <input
                type="password"
                value={
                  password
                }
                onChange={(
                  event,
                ) => {
                  setPassword(
                    event.target
                      .value,
                  )
                  setShowPasswordError(
                    false,
                  )
                  setSignupMessage(
                    null,
                  )
                }}
                placeholder="********"
                className={[
                  'mb-[11px] mt-[6px] h-[51px] rounded-[8px] border-2 pl-[20px] outline-none hover:border-[#666666]',
                  showPasswordError
                    ? 'border-[#F8A3A3]'
                    : 'border-[#E4E4E7]',
                ].join(
                  ' ',
                )}
              />

              <p className="mt-[-5px] text-[15px] text-[#9A9AA3]">
                영문·숫자 포함 8~20자
              </p>

              {showPasswordError && (
                <p className="mt-[11px] font-bold text-[#EF8888]">
                  비밀번호는 영문·숫자를
                  포함한 8~20자로 작성해
                  주세요.
                </p>
              )}
            </div>

            <div className="flex flex-col tracking-tighter">
              <p className="text-[15px] font-bold text-[#52525B]">
                비밀번호 확인
              </p>

              <input
                type="password"
                value={
                  passwordConfirm
                }
                onChange={(
                  event,
                ) => {
                  setPasswordConfirm(
                    event.target
                      .value,
                  )
                  setShowPasswordMismatch(
                    false,
                  )
                  setSignupMessage(
                    null,
                  )
                }}
                placeholder="********"
                className={[
                  'mb-[11px] mt-[6px] h-[51px] rounded-[8px] border-2 pl-[20px] outline-none hover:border-[#666666]',
                  showPasswordMismatch
                    ? 'border-[#F8A3A3]'
                    : 'border-[#E4E4E7]',
                ].join(
                  ' ',
                )}
              />

              {passwordConfirm &&
                passwordsMatch && (
                  <p className="font-bold text-[#5FAA81]">
                    입력한 비밀번호가
                    일치합니다.
                  </p>
                )}

              {showPasswordMismatch && (
                <p className="font-bold text-[#EF8888]">
                  입력한 비밀번호가
                  같지 않습니다.
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-[15px] font-bold text-[#52525B]">
                닉네임
              </p>

              <input
                type="text"
                value={
                  nickname
                }
                onChange={(
                  event,
                ) => {
                  setNickname(
                    event.target
                      .value,
                  )
                  setShowNicknameError(
                    false,
                  )
                  setSignupMessage(
                    null,
                  )
                }}
                placeholder="학습자 닉네임을 입력하세요."
                className={[
                  'mt-[6.5px] h-[51px] rounded-[8px] border-2 pl-[20px] text-[18px] outline-none hover:border-[#666666]',
                  showNicknameError
                    ? 'border-[#F8A3A3]'
                    : 'border-[#E4E4E7]',
                ].join(
                  ' ',
                )}
              />

              {showNicknameError && (
                <p className="mt-[11px] font-bold text-[#EF8888]">
                  닉네임을 입력해 주세요.
                </p>
              )}
            </div>
          </div>

          <div className="mt-[40px] w-full">
            <div className="flex items-start gap-[8px]">
              <label className="mt-[3px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    agreed
                  }
                  onChange={(
                    event,
                  ) => {
                    setAgreed(
                      event.target
                        .checked,
                    )
                    setShowAgreementError(
                      false,
                    )
                    setSignupMessage(
                      null,
                    )
                  }}
                  className="sr-only"
                />

                <span
                  className={[
                    'flex h-[17px] w-[17px] items-center justify-center rounded-[2px] border-2 border-[#6366F1]',
                    agreed
                      ? 'bg-[#6366F1]'
                      : 'bg-white',
                  ].join(
                    ' ',
                  )}
                >
                  {agreed && (
                    <Check
                      size={
                        15
                      }
                      className="stroke-[3] text-white"
                    />
                  )}
                </span>
              </label>

              <p className="text-[16.5px] tracking-tighter text-[#52525B]">
                <button
                  type="button"
                  onClick={() => {
                    navigate(
                      '/terms',
                    )
                  }}
                  className="font-bold text-[#6366F1] hover:text-[#3A3DC2]"
                >
                  이용약관
                </button>{' '}
                및{' '}
                <button
                  type="button"
                  onClick={() => {
                    navigate(
                      '/privacy',
                    )
                  }}
                  className="font-bold text-[#6366F1] hover:text-[#3A3DC2]"
                >
                  개인정보 처리방침
                </button>
                에 동의합니다.
              </p>
            </div>

            {showAgreementError && (
              <p className="mt-[20px] font-bold text-[#EF8888]">
                이용약관 및 개인정보
                처리방침 동의가
                필요합니다.
              </p>
            )}
          </div>

          {signupMessage && (
            <p
              className={[
                'mt-[18px] w-full text-center text-[15px] font-bold',
                signupMessage.type ===
                  'success'
                  ? 'text-[#5FAA81]'
                  : 'text-[#EF8888]',
              ].join(
                ' ',
              )}
            >
              {
                signupMessage.text
              }
            </p>
          )}

          <button
            type="button"
            disabled={
              isSubmitting
            }
            onClick={() => {
              void memberOk()
            }}
            className="mt-[16px] h-[52px] w-full cursor-pointer rounded-[8px] border border-[#6366F1] text-[21px] font-bold text-[#6366F1] transition-colors hover:bg-[#6366F1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? '가입 중...'
              : '회원가입'}
          </button>

          <p className="mt-[48px] text-[15px] tracking-tighter text-[#52525B]">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => {
                navigate(
                  '/login',
                )
              }}
              className="font-bold text-[#6366F1] hover:text-[#3A3DC2]"
            >
              로그인
            </button>
          </p>
        </div>

        <p className="mt-[44px] text-center text-[15px] text-[#9A9AA3]">
          ©2026 LearningLM
        </p>
      </div>
    </div>
  )
}