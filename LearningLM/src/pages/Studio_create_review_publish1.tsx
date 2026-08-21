import {
  useMemo,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { Header } from '../components/layout/Header'

import {
  createDefaultStudioSaveDraft,
  type StudioSaveDraft,
  type StudioSaveNavigationState,
  type StudioSaveVisibility,
} from '../features/studio/types/studioSave'

import {
  buildStudioFlowUpdateRequest,
} from '../features/studio/utils/studioFlowPersistence'

import {
  getStudioBlocks,
  saveFlow,
} from './api/StudioApi'

const difficultyLabelMap = {
  BEGINNER: '입문',
  BASIC: '기초',
  ADVANCED: '응용',
} as const

export function Studio_create_review_publish1() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const navigationState =
    (
      location.state as
      | StudioSaveNavigationState
      | null
    ) ?? {}

  const initialDraft =
    navigationState.saveDraft ??
    createDefaultStudioSaveDraft()

  const [
    visibility,
    setVisibility,
  ] =
    useState<StudioSaveVisibility>(
      initialDraft.visibility,
    )

  const [
    isSaveModalOpen,
    setIsSaveModalOpen,
  ] =
    useState(false)

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false)

  const [
    savedAt,
    setSavedAt,
  ] =
    useState<string | null>(
      null,
    )

  const [
    saveError,
    setSaveError,
  ] =
    useState<string | null>(
      null,
    )

  const flowId =
    navigationState.flowId

  const nodeCount =
    navigationState.nodes?.length ??
    0

  const hasExample =
    initialDraft.exampleInput.trim().length >
    0 ||
    initialDraft.exampleResult.trim().length >
    0

  const difficultyLabel =
    difficultyLabelMap[
    initialDraft.difficulty
    ]

  const primaryCategory =
    initialDraft.categories[0] ??
    '카테고리 미선택'

  const visibleTags =
    initialDraft.tags.slice(
      0,
      3,
    )

  const currentVisibilityLabel =
    visibility === 'PUBLIC'
      ? '🌐 공개'
      : '🔒 비공개'

  const buildSaveDraft =
    (): StudioSaveDraft => ({
      ...initialDraft,
      visibility,
    })

  const buildNavigationState =
    (): StudioSaveNavigationState => ({
      ...navigationState,
      saveDraft:
        buildSaveDraft(),
    })

  const currentNavigationState =
    useMemo(
      () =>
        buildNavigationState(),
      [
        navigationState,
        visibility,
      ],
    )

  const handleBack =
    () => {
      navigate(
        '/studio/save/details',
        {
          state:
            currentNavigationState,
        },
      )
    }

  const handlePreview =
    () => {
      if (!flowId) {
        setSaveError(
          '미리보기에 사용할 flowId가 없습니다.',
        )
        return
      }

      setSaveError(
        null,
      )

      navigate(
        `/workflows/${flowId}/preview`,
        {
          state:
            currentNavigationState,
        },
      )
    }

  const handleContinueEditing =
    () => {
      if (!flowId) {
        navigate(
          '/studio/create',
          {
            state:
              currentNavigationState,
          },
        )
        return
      }

      const mode =
        navigationState.mode ??
        'edit'

      navigate(
        `/studio/create?mode=${mode}&flowId=${flowId}`,
        {
          state:
            currentNavigationState,
        },
      )
    }

  const handleOpenStorage =
    () => {
      navigate(
        '/my-storage?tab=created',
      )
    }

  const handleSaveClick =
    async () => {
      if (!flowId) {
        setSaveError(
          '저장할 flowId가 없습니다.',
        )
        return
      }

      if (
        initialDraft.title.trim().length ===
        0
      ) {
        setSaveError(
          '제목이 없습니다. 상세 정보 단계에서 제목을 입력해 주세요.',
        )
        return
      }

      if (
        initialDraft.summary.trim().length ===
        0
      ) {
        setSaveError(
          '한 줄 요약이 없습니다. 상세 정보 단계에서 요약을 입력해 주세요.',
        )
        return
      }

      if (
        initialDraft.categories.length ===
        0
      ) {
        setSaveError(
          '카테고리가 없습니다. 상세 정보 단계에서 카테고리를 선택해 주세요.',
        )
        return
      }

      const nodes =
        navigationState.nodes ??
        []

      if (
        nodes.length ===
        0
      ) {
        setSaveError(
          '저장할 블록 흐름이 없습니다.',
        )
        return
      }

      const accessToken =
        localStorage.getItem(
          'accessToken',
        ) ??
        sessionStorage.getItem(
          'accessToken',
        ) ??
        undefined

      setIsSaving(
        true,
      )

      setSaveError(
        null,
      )

      try {
        /*
         * FE 문자열 block id를 숫자로 임의 생성하지 않고
         * 서버의 실제 blockId를 GET /blocks로 조회합니다.
         */
        const blockResponse =
          await getStudioBlocks(
            {
              ...(navigationState.tutorialId
                ? {
                  tutorialId:
                    navigationState.tutorialId,
                }
                : {}),
            },
            accessToken,
          )

        if (
          !blockResponse.success ||
          !blockResponse.result
        ) {
          throw new Error(
            blockResponse.message ||
            '블록 정보를 불러오지 못했습니다.',
          )
        }

        const saveDraft =
          buildSaveDraft()

        const payload =
          buildStudioFlowUpdateRequest(
            {
              nodes,

              saveDraft,

              blockPalette:
                blockResponse.result,
            },
          )

        const response =
          await saveFlow(
            flowId,
            payload,
            accessToken,
          )
          

        if (
          !response.success
        ) {
          throw new Error(
            response.message ||
            '워크플로우 저장에 실패했습니다.',
          )
        }

        setSavedAt(
          response.result.updatedAt,
        )

        setIsSaveModalOpen(
          true,
        )
      } catch (error) {
        console.error(
          'Flow 최종 저장 실패:',
          error,
        )

        setSaveError(
          error instanceof Error
            ? error.message
            : '워크플로우 저장 중 오류가 발생했습니다.',
        )
      } finally {
        setIsSaving(
          false,
        )
      }
      
    }

  return (
    <>
      <Header />

      {/* =========================
          상단 저장 진행 단계
      ========================= */}
      <div className="flex h-[62px] items-center justify-between border-b-[1.5px] border-[#E4E4E7] bg-white pl-[27px] pr-[9.4px] text-[#27272A]">
        <p className="text-[17.5px] font-bold">
          워크플로우 저장
        </p>

        <div className="ml-[27px] flex flex-1 items-center gap-[22px]">
          <div className="flex items-center gap-[9px]">
            <div className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#2F7D52] text-[12px] font-bold text-white">
              ✓
            </div>

            <p className="text-[15.5px] font-bold text-[#2F7D52]">
              검토
            </p>
          </div>

          <div className="h-[3px] w-[16px] bg-[#E4E4E7]" />

          <div className="flex items-center gap-[9px]">
            <div className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#2F7D52] text-[12px] font-bold text-white">
              ✓
            </div>

            <p className="text-[15.5px] font-bold text-[#2F7D52]">
              상세정보
            </p>
          </div>

          <div className="h-[3px] w-[16px] bg-[#E4E4E7]" />

          <div className="flex items-center gap-[9px]">
            <p className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#6366F1] text-[12px] font-bold text-white">
              3
            </p>

            <p className="text-[15.5px] font-bold text-[#6366F1]">
              공개 설정
            </p>
          </div>
        </div>

        <p className="text-[14.5px] text-[#9A9AA3]">
          자유 제작 흐름 · 저장 전 마지막 단계
        </p>
      </div>

      {/* =========================
          본문
      ========================= */}
      <main className="flex min-h-screen justify-center bg-[#F5F5F7] pb-[60px]">
        <div className="flex min-h-screen w-[1158px] flex-col text-[#27272A]">
          <p className="mt-[34px] text-[14px] font-bold text-[#9A9AA3]">
            3 / 3 · 공개 설정
          </p>

          <p className="text-[38px] font-bold">
            공개 범위를 정하고 저장하세요
          </p>

          {/* =========================
              공개 범위
          ========================= */}
          <div className="mt-[24px] w-[1158px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[26px] pb-[25px] pt-[25px]">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-[#9A9AA3]">
                공개 범위
              </p>

              <p className="flex h-[28px] min-w-[116px] items-center justify-center rounded-[8px] bg-[#F0F0F3] px-[12px] text-[14px] font-bold text-[#52525B]">
                현재: {currentVisibilityLabel}
              </p>
            </div>

            <button
              type="button"
              aria-pressed={
                visibility ===
                'PRIVATE'
              }
              onClick={() => {
                setVisibility(
                  'PRIVATE',
                )

                setSaveError(
                  null,
                )
              }}
              className={[
                'mt-[21.5px] flex h-[92px] w-full gap-[18px] rounded-[12px] border-[1.5px] pl-[24px] pt-[18px] text-left transition',

                visibility ===
                  'PRIVATE'
                  ? 'border-[#6366F1] bg-[#F8F8FF]'
                  : 'border-[#E4E4E7] bg-white hover:border-[#B8BAFF]',
              ].join(
                ' ',
              )}
            >
              <div
                className={[
                  'h-[22px] w-[22px] shrink-0 rounded-[50px]',

                  visibility ===
                    'PRIVATE'
                    ? 'border-[6px] border-[#6366F1] bg-white'
                    : 'border-[3px] border-[#C4C4CC]',
                ].join(
                  ' ',
                )}
              />

              <div className="mt-[-4px] flex flex-col gap-[7px]">
                <p className="text-[17.5px] font-bold">
                  🔒 비공개
                </p>

                <p className="text-[15.5px] font-semibold text-[#9A9AA3]">
                  나만 볼 수 있어요. 내 저장소에서 언제든 공개로 전환할 수 있습니다.
                </p>
              </div>
            </button>

            <button
              type="button"
              aria-pressed={
                visibility ===
                'PUBLIC'
              }
              onClick={() => {
                setVisibility(
                  'PUBLIC',
                )

                setSaveError(
                  null,
                )
              }}
              className={[
                'mt-[18px] flex h-[92px] w-full gap-[18px] rounded-[12px] border-[1.5px] pl-[24px] pt-[18px] text-left transition',

                visibility ===
                  'PUBLIC'
                  ? 'border-[#6366F1] bg-[#F8F8FF]'
                  : 'border-[#E4E4E7] bg-white hover:border-[#B8BAFF]',
              ].join(
                ' ',
              )}
            >
              <div
                className={[
                  'h-[22px] w-[22px] shrink-0 rounded-[50px]',

                  visibility ===
                    'PUBLIC'
                    ? 'border-[6px] border-[#6366F1] bg-white'
                    : 'border-[3px] border-[#C4C4CC]',
                ].join(
                  ' ',
                )}
              />

              <div className="mt-[-4px] flex flex-col gap-[7px]">
                <p className="text-[17.5px] font-bold">
                  🌐 공개
                </p>

                <p className="text-[15.5px] font-semibold text-[#9A9AA3]">
                  공개 라이브러리에 올라가 다른 사용자가 보고 복사할 수 있어요.
                </p>
              </div>
            </button>
          </div>

          {/* =========================
              공개 준비 조건
          ========================= */}
          <div className="mt-[20px] w-full rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[26px] pb-[24px] pt-[24px]">
            <div className="flex items-center justify-between font-bold">
              <p className="text-[14.5px] text-[#9A9AA3]">
                공개 준비 조건
              </p>

              <p className="flex h-[24px] min-w-[54px] items-center justify-center rounded-[8px] bg-[#FBF6EC] px-[8px] text-[14px] text-[#9A6A1E]">
                권장
                {hasExample
                  ? '0'
                  : '1'}
              </p>
            </div>

            <div className="mt-[19px] w-full rounded-[12px] border-[1.5px] border-[#E4E4E7]">
              <div className="flex h-[56px] items-center">
                <div className="ml-[21.75px] h-[23px] w-[23px] rounded-[50%] bg-[#2F8A5B]" />

                <div className="ml-[14px] flex-1">
                  <p className="text-[16.5px] font-bold">
                    제목 · 한 줄 요약 작성됨
                  </p>
                </div>

                <p className="mr-[30px] flex h-[24px] w-[44px] items-center justify-center rounded-[8px] bg-[#EEF4EE] text-[14px] font-bold text-[#2F7D52]">
                  완료
                </p>
              </div>

              <div className="border-b-[1.5px] border-[#EEEEF1]" />

              <div className="flex h-[56px] items-center">
                <div
                  className={[
                    'ml-[21.75px] h-[23px] w-[23px] rounded-[50%]',

                    nodeCount >
                      0
                      ? 'bg-[#2F8A5B]'
                      : 'bg-[#B4453A]',
                  ].join(
                    ' ',
                  )}
                />

                <div className="ml-[15px] flex-1">
                  <p className="text-[16.5px] font-bold">
                    블록 흐름 1개 이상
                  </p>
                </div>

                <p
                  className={[
                    'mr-[30px] flex h-[24px] min-w-[44px] items-center justify-center rounded-[8px] px-[8px] text-[14px] font-bold',

                    nodeCount >
                      0
                      ? 'bg-[#EEF4EE] text-[#2F7D52]'
                      : 'bg-[#FBF1F0] text-[#B4453A]',
                  ].join(
                    ' ',
                  )}
                >
                  {nodeCount >
                    0
                    ? '완료'
                    : '필수'}
                </p>
              </div>

              <div className="border-b-[1.5px] border-[#EEEEF1]" />

              <div className="flex min-h-[72px] items-center py-[8px]">
                <div
                  className={[
                    'ml-[21.75px] h-[23px] w-[23px] rounded-[50%]',

                    hasExample
                      ? 'bg-[#2F8A5B]'
                      : 'bg-[#B88A3C]',
                  ].join(
                    ' ',
                  )}
                />

                <div className="ml-[15px] flex-1">
                  <p className="text-[16.5px] font-bold">
                    예시 입력 · 결과 작성
                  </p>

                  <p className="text-[13.5px] text-[#9A9AA3]">
                    권장 — 없어도 공개할 수 있어요
                  </p>
                </div>

                <p
                  className={[
                    'mr-[30px] flex h-[24px] min-w-[44px] items-center justify-center rounded-[8px] px-[8px] text-[14px] font-bold',

                    hasExample
                      ? 'bg-[#EEF4EE] text-[#2F7D52]'
                      : 'bg-[#FBF6EC] text-[#9A6A1E]',
                  ].join(
                    ' ',
                  )}
                >
                  {hasExample
                    ? '완료'
                    : '권장'}
                </p>
              </div>
            </div>

            {visibility ===
              'PUBLIC' && (
                <div className="mt-[20px] flex min-h-[60px] items-center gap-[15px] rounded-[12px] border-[1.5px] border-[#ECD6B8] bg-[#FBF6EC] pl-[21.8px] pr-[20px]">
                  <p className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[50px] bg-[#B88A3C] text-[15px] font-bold text-white">
                    !
                  </p>

                  <p className="text-[16.5px] font-semibold text-[#52525B]">
                    공개하면 다른 사용자가 흐름을{' '}

                    <span className="font-bold">
                      보고 복사
                    </span>

                    할 수 있습니다.
                  </p>
                </div>
              )}
          </div>

          {/* =========================
              저장 요약
          ========================= */}
          <div className="mt-[20px] min-h-[190px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[26px] pb-[20px] pt-[25px]">
            <p className="text-[14.5px] font-bold text-[#9A9AA3]">
              저장 요약
            </p>

            <div className="mt-[22px] flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-[12px] text-[15px]">
                <p className="flex h-[30px] min-w-[56px] items-center justify-center rounded-[6px] bg-[#EEF1F7] px-[10px] font-bold text-[#4A5E8A]">
                  {
                    difficultyLabel
                  }
                </p>

                <p className="font-bold text-[#6366F1]">
                  {
                    primaryCategory
                  }
                </p>

                {visibleTags.map(
                  (
                    tag,
                  ) => (
                    <p
                      key={
                        tag
                      }
                      className="flex h-[30px] items-center justify-center rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-[#F0F0F3] px-[10px] font-bold text-[#4A5E8A]"
                    >
                      {
                        tag
                      }
                    </p>
                  ),
                )}
              </div>

              <p className="text-[14px] text-[#9A9AA3]">
                노드{' '}
                {
                  nodeCount
                }{' '}
                · 예시{' '}
                {hasExample
                  ? 1
                  : 0}
              </p>
            </div>

            <div className="mt-[18px] border-[0.5px] border-[#E4E4E7]" />

            <div className="flex items-center justify-between">
              <div className="mt-[13px] min-w-0">
                <p className="truncate text-[17px] font-bold">
                  {
                    initialDraft.title ||
                    '제목 없음'
                  }
                </p>

                <p className="mt-[4px] max-w-[850px] truncate text-[14px] text-[#9A9AA3]">
                  {
                    initialDraft.summary ||
                    '한 줄 요약 없음'
                  }
                </p>
              </div>

              <p className="mt-[13px] flex h-[24px] min-w-[90px] items-center justify-center rounded-[4px] bg-[#EEF4EE] px-[10px] text-[12px] font-bold text-[#2F7D52]">
                저장 조건 통과
              </p>
            </div>
          </div>

          {saveError && (
            <div className="mt-[18px] rounded-[10px] border border-[#F1C7C2] bg-[#FFF5F4] px-[18px] py-[14px] text-[15px] font-bold text-[#B4453A]">
              {
                saveError
              }
            </div>
          )}
        </div>
      </main>

      {/* =========================
          하단
      ========================= */}
      <footer className="flex h-[80px] items-center bg-white pl-[52px] pr-[28px]">
        <button
          type="button"
          onClick={
            handleBack
          }
          className="cursor-pointer text-[18.5px] font-bold text-[#52525B]"
        >
          ← 상세 정보
        </button>

        <p className="flex-1 pl-[38px] text-[16px] text-[#9A9AA3]">
          3 / 3 · 공개 설정 — 범위 선택 후 저장
        </p>

        <div className="flex items-center">
          <button
            type="button"
            onClick={
              handlePreview
            }
            className="flex h-[48px] w-[100px] cursor-pointer items-center justify-center rounded-[12px] border-[1.5px] border-[#E4E4E7] text-[17.5px] font-bold hover:border-[#666666]"
          >
            미리보기
          </button>

          <button
            type="button"
            disabled={
              isSaving
            }
            onClick={() => {
              void handleSaveClick()
            }}
            className={[
              'ml-[16px] flex h-[50px] w-[186px] items-center justify-center rounded-[12px] text-[17.5px] font-bold text-white',

              isSaving
                ? 'cursor-not-allowed bg-[#A5A6F6]'
                : 'cursor-pointer bg-[#6366F1] hover:bg-[#3A3DC2]',
            ].join(
              ' ',
            )}
          >
            {isSaving
              ? '저장 중...'
              : '저장 · 내 저장소에'}
          </button>
        </div>
      </footer>

      {/* =========================
          저장 완료 모달
      ========================= */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            aria-label="저장 완료 모달 닫기"
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setIsSaveModalOpen(
                false,
              )
            }
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="studio-save-complete-title"
            className="relative z-10 min-h-[334px] w-[660px] rounded-2xl bg-white px-[26px] pb-[28px] pt-[27px] shadow-xl"
          >
            <div className="flex items-center">
              <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[50px] bg-[#3C7A52] text-[14px] font-bold text-white">
                ✓
              </div>

              <p
                id="studio-save-complete-title"
                className="ml-[15px] text-[22px] font-bold"
              >
                저장 완료
              </p>
            </div>

            <div className="mt-[18px] flex min-h-[86px] w-full gap-[15px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-[#F5F5F7] px-[22.5px] py-[17px]">
              <div className="flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-[50px] bg-[#3C7A52] text-[12px] font-bold text-white">
                ✓
              </div>

              <p className="mt-[-4px] text-[16px] leading-[26px] text-[#52525B]">
                <span className="font-bold">
                  &quot;
                  {
                    initialDraft.title
                  }
                  &quot;
                </span>

                을(를) 내 저장소에 저장했습니다.
                <br />

                공개 범위는{' '}

                <span className="font-bold">
                  {visibility ===
                    'PUBLIC'
                    ? '공개'
                    : '비공개'}
                </span>

                로 선택되어 있습니다.
              </p>
            </div>

            <p className="mt-[16px] text-[14px] leading-[22px] text-[#9A9AA3]">
              서버 저장이 완료되었습니다.
              {savedAt
                ? ` · ${savedAt}`
                : ''}
            </p>

            <div className="mt-[24px] flex items-center justify-end gap-[12px]">
              <button
                type="button"
                onClick={
                  handleContinueEditing
                }
                className="flex h-[46px] min-w-[128px] items-center justify-center rounded-[10px] border-[1.5px] border-[#E4E4E7] px-[18px] text-[15.5px] font-bold text-[#52525B] hover:border-[#6366F1] hover:text-[#6366F1]"
              >
                계속 편집
              </button>

              <button
                type="button"
                onClick={
                  handleOpenStorage
                }
                className="flex h-[46px] min-w-[150px] items-center justify-center rounded-[10px] bg-[#6366F1] px-[18px] text-[15.5px] font-bold text-white hover:bg-[#3A3DC2]"
              >
                내 저장소 보기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}