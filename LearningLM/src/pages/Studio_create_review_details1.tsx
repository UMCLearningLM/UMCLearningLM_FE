import {
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  Header,
} from '../components/layout/Header'

import temp_dashed from '../assets/temp_dashed.png'

import {
  createDefaultStudioSaveDraft,
  type StudioSaveDifficulty,
  type StudioSaveDraft,
  type StudioSaveNavigationState,
} from '../features/studio/types/studioSave'

const CATEGORY_OPTIONS = [
  '자료조사',
  '문서 요약',
  '글쓰기',
  '반복 작업 정리',
  '결과물 검토',
  'AI 툴 활용',
] as const

const DIFFICULTY_OPTIONS: Array<{
  value: StudioSaveDifficulty
  label: string
}> = [
  {
    value: 'BEGINNER',
    label: '입문',
  },
  {
    value: 'BASIC',
    label: '기초',
  },
  {
    value: 'ADVANCED',
    label: '응용',
  },
]

export function Studio_create_review_details1() {
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
    title,
    setTitle,
  ] =
    useState(
      initialDraft.title,
    )

  const [
    summary,
    setSummary,
  ] =
    useState(
      initialDraft.summary,
    )

  const [
    purpose,
    setPurpose,
  ] =
    useState(
      initialDraft.purpose,
    )

  const [
    categories,
    setCategories,
  ] =
    useState<string[]>(
      initialDraft.categories,
    )

  const [
    difficulty,
    setDifficulty,
  ] =
    useState<StudioSaveDifficulty>(
      initialDraft.difficulty,
    )

  const [
    tags,
    setTags,
  ] =
    useState<string[]>(
      initialDraft.tags,
    )

  const [
    tagInput,
    setTagInput,
  ] =
    useState('')

  const [
    isTagInputOpen,
    setIsTagInputOpen,
  ] =
    useState(false)

  const [
    exampleInput,
    setExampleInput,
  ] =
    useState(
      initialDraft.exampleInput,
    )

  const [
    exampleResult,
    setExampleResult,
  ] =
    useState(
      initialDraft.exampleResult,
    )

  const [
    authorNote,
    setAuthorNote,
  ] =
    useState(
      initialDraft.authorNote,
    )

  const [
    formError,
    setFormError,
  ] =
    useState<string | null>(
      null,
    )

  const buildSaveDraft =
    (): StudioSaveDraft => ({
      title:
        title.trim(),

      summary:
        summary.trim(),

      purpose:
        purpose.trim(),

      categories,

      difficulty,

      tags,

      exampleInput:
        exampleInput.trim(),

      exampleResult:
        exampleResult.trim(),

      authorNote:
        authorNote.trim(),

      visibility:
        initialDraft.visibility,
    })

  const buildNavigationState =
    (): StudioSaveNavigationState => ({
      ...navigationState,

      saveDraft:
        buildSaveDraft(),
    })

  const handleBack =
    () => {
      navigate(
        '/studio/save/review',
        {
          state:
            buildNavigationState(),
        },
      )
    }

  const handleNext =
    () => {
      const normalizedTitle =
        title.trim()

      const normalizedSummary =
        summary.trim()

      if (
        normalizedTitle.length ===
        0
      ) {
        setFormError(
          '제목을 입력해 주세요.',
        )
        return
      }

      if (
        normalizedSummary.length ===
        0
      ) {
        setFormError(
          '한 줄 요약을 입력해 주세요.',
        )
        return
      }

      if (
        categories.length ===
        0
      ) {
        setFormError(
          '카테고리를 하나 이상 선택해 주세요.',
        )
        return
      }

      setFormError(
        null,
      )

      navigate(
        '/studio/save/publish',
        {
          state:
            buildNavigationState(),
        },
      )
    }

  const handleToggleCategory =
    (
      category:
        string,
    ) => {
      setCategories(
        (
          current,
        ) => {
          if (
            current.includes(
              category,
            )
          ) {
            return current.filter(
              (
                item,
              ) =>
                item !==
                category,
            )
          }

          return [
            ...current,
            category,
          ]
        },
      )

      setFormError(
        null,
      )
    }

  const handleAddTag =
    () => {
      const normalized =
        tagInput.trim()

      if (
        normalized.length ===
        0
      ) {
        return
      }

      if (
        tags.includes(
          normalized,
        )
      ) {
        setTagInput('')
        setIsTagInputOpen(
          false,
        )
        return
      }

      setTags(
        (
          current,
        ) => [
          ...current,
          normalized,
        ],
      )

      setTagInput('')

      setIsTagInputOpen(
        false,
      )
    }

  const handleRemoveTag =
    (
      tag:
        string,
    ) => {
      setTags(
        (
          current,
        ) =>
          current.filter(
            (
              item,
            ) =>
              item !==
              tag,
          ),
      )
    }

  return (
    <>
      <Header />

      {/* =========================
          상단 저장 진행 단계
      ========================= */}
      <div className="flex h-[62px] items-center justify-between bg-white pl-[27px] pr-[9.4px] text-[#27272A]">
        <p className="text-[17.5px] font-black">
          워크플로우 저장
        </p>

        <div className="ml-[27px] flex flex-1 items-center gap-[18px]">
          {/* 검토 완료 */}
          <div className="flex items-center gap-[9px]">
            <div className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#2F8A5B] text-white">
              ✓
            </div>

            <p className="text-[15.5px] font-bold text-[#2F7D52]">
              검토
            </p>
          </div>

          <div className="h-[3px] w-[16px] bg-[#E4E4E7]" />

          {/* 상세정보 현재 */}
          <div className="flex items-center gap-[9px]">
            <p className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#6366F1] text-[13px] font-bold text-white">
              2
            </p>

            <p className="text-[15.5px] font-bold text-[#6366F1]">
              상세정보
            </p>
          </div>

          <div className="h-[3px] w-[16px] bg-[#E4E4E7]" />

          {/* 공개 설정 대기 */}
          <div className="flex items-center gap-[9px]">
            <p className="flex h-[23px] w-[23px] items-center justify-center rounded-[50px] bg-[#E7E7EC] text-[13px] font-bold text-[#9A9AA3]">
              3
            </p>

            <p className="text-[15.5px] font-bold text-[#9A9AA3]">
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
      <main className="flex min-h-screen justify-center border-t-[1.5px] border-[#E4E4E7] bg-[#F5F5F7] pb-[60px]">
        <div className="flex min-h-screen w-[1158px] flex-col text-[#27272A]">
          <p className="mt-[30px] text-[15px] font-bold text-[#9A9AA3]">
            2 / 3 · 상세 정보
          </p>

          <p className="text-[38.5px] font-bold">
            워크플로우 정보를 입력하세요
          </p>

          <div className="mt-[38px] flex items-center gap-[15px]">
            <p className="flex h-[26px] w-[26px] items-center justify-center rounded-[50px] bg-[#6366F1] text-[16.5px] text-white">
              i
            </p>

            <p className="text-[17px] font-bold text-[#52525B]">
              블록 흐름에서 자동으로 채웠어요{' '}

              <span className="font-normal">
                제목·요약·예시는 자유롭게 수정할 수 있습니다.
              </span>
            </p>
          </div>

          {/* =========================
              기본 정보
          ========================= */}
          <div className="mt-[42px] w-[1158px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white pb-[24px] pl-[28px] pr-[28px] pt-[24px]">
            <p className="text-[15px] font-bold text-[#9A9AA3]">
              기본 정보
            </p>

            <div className="mt-[10px] flex items-center">
              {/* 썸네일 */}
              <div className="flex w-[216px] flex-col gap-[9px]">
                <button
                  type="button"
                  className="flex h-[140px] items-center justify-center rounded-[12px] border-[1.5px] border-[#E4E4E7] text-[15px] text-[#9A9AA3]"
                >
                  썸네일
                </button>

                <button
                  type="button"
                  className="cursor-pointer flex h-[44px] items-center justify-center rounded-[12px] border-[1.5px] border-[#E4E4E7] text-[16.5px] font-bold hover:bg-[#6366F1] hover:text-white"
                >
                  이미지 변경
                </button>
              </div>

              {/* 제목 / 요약 */}
              <div className="ml-[25.5px] w-[845px]">
                <p className="mt-[8px] text-[16.5px] font-bold text-[#52525B]">
                  제목

                  <span className="text-[#C0473C]">
                    {' '}*
                  </span>
                </p>

                <input
                  value={
                    title
                  }
                  onChange={(
                    event,
                  ) => {
                    setTitle(
                      event.target.value,
                    )

                    setFormError(
                      null,
                    )
                  }}
                  placeholder="워크플로우 제목"
                  className="mt-[13px] h-[56px] w-full rounded-[8px] border-[1.5px] border-[#E4E4E7] px-[16px] text-[16px] outline-none focus:border-[#6366F1]"
                />

                <p className="mt-[11px] text-[16.5px] font-bold text-[#52525B]">
                  한 줄 요약

                  <span className="text-[#C0473C]">
                    {' '}*
                  </span>
                </p>

                <input
                  value={
                    summary
                  }
                  onChange={(
                    event,
                  ) => {
                    setSummary(
                      event.target.value,
                    )

                    setFormError(
                      null,
                    )
                  }}
                  placeholder="워크플로우를 한 줄로 설명해 주세요"
                  className="mt-[12px] h-[55px] w-full rounded-[8px] border-[1.5px] border-[#E4E4E7] px-[16px] text-[16px] outline-none focus:border-[#6366F1]"
                />

                <p className="mt-[6px] text-[15px] text-[#9A9AA3]">
                  블록 흐름에서 자동 생성 · 수정 가능
                </p>
              </div>
            </div>
          </div>

          {/* =========================
              분류
          ========================= */}
          <div className="mt-[23px] w-full rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[28px] pb-[25px] pt-[24px]">
            <p className="text-[15px] font-bold text-[#9A9AA3]">
              분류
            </p>

            <p className="mt-[18px] text-[17px] font-bold text-[#52525B]">
              목적
            </p>

            <input
              value={
                purpose
              }
              onChange={(
                event,
              ) =>
                setPurpose(
                  event.target.value,
                )
              }
              placeholder="이 워크플로우를 어떤 상황에서 사용하는지 작성해 주세요"
              className="mt-[11px] h-[54.5px] w-full rounded-[8px] border-[1.5px] border-[#E4E4E7] px-[16px] text-[16px] outline-none focus:border-[#6366F1]"
            />

            <p className="mt-[14px] text-[18px] font-bold text-[#52525B]">
              카테고리

              <span className="text-[#C0473C]">
                {' '}*
              </span>
            </p>

            <div className="mt-[10px] flex flex-wrap items-center gap-[12px] text-[16px] font-bold">
              {CATEGORY_OPTIONS.map(
                (
                  category,
                ) => {
                  const selected =
                    categories.includes(
                      category,
                    )

                  return (
                    <button
                      key={
                        category
                      }
                      type="button"
                      aria-pressed={
                        selected
                      }
                      onClick={() =>
                        handleToggleCategory(
                          category,
                        )
                      }
                      className={[
                        'flex h-[37px] items-center justify-center rounded-[50px] border-[1.5px] px-[18px] transition',

                        selected
                          ? 'border-[#6366F1] bg-[#EEF0FF] text-[#6366F1]'
                          : 'border-[#E4E4E7] bg-[#F0F0F3] text-[#52525B] hover:border-[#B8BAFF]',
                      ].join(
                        ' ',
                      )}
                    >
                      {
                        category
                      }
                    </button>
                  )
                },
              )}
            </div>

            {/* 난이도 / 태그 */}
            <div className="mt-[17px] flex text-[#52525B]">
              <div className="w-[250px]">
                <p className="text-[16.5px] font-bold">
                  난이도
                </p>

                <div className="mt-[12px] flex h-[40px] overflow-hidden rounded-[10px] border-[1.5px] border-[#E4E4E7] text-[16.5px] font-bold">
                  {DIFFICULTY_OPTIONS.map(
                    (
                      option,
                      index,
                    ) => (
                      <div
                        key={
                          option.value
                        }
                        className="flex flex-1"
                      >
                        <button
                          type="button"
                          aria-pressed={
                            difficulty ===
                            option.value
                          }
                          onClick={() =>
                            setDifficulty(
                              option.value,
                            )
                          }
                          className={[
                            'flex flex-1 items-center justify-center',

                            difficulty ===
                            option.value
                              ? 'bg-[#EEF0FF] text-[#6366F1]'
                              : 'bg-white text-[#52525B]',
                          ].join(
                            ' ',
                          )}
                        >
                          {
                            option.label
                          }
                        </button>

                        {index <
                          DIFFICULTY_OPTIONS.length -
                            1 && (
                          <div className="h-full border-r-[1px] border-[#E4E4E7]" />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="ml-[24.8px] flex-1">
                <p className="text-[16.5px] font-bold">
                  태그
                </p>

                <div className="mt-[12px] flex min-h-[54px] w-full flex-wrap items-center gap-[12px] rounded-[10px] border-[1.5px] border-[#E4E4E7] px-[18px] py-[8px]">
                  {tags.map(
                    (
                      tag,
                    ) => (
                      <p
                        key={
                          tag
                        }
                        className="flex h-[30px] items-center gap-[8px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-[#F0F0F3] px-[10px] text-[15px] font-bold text-[#6366F1]"
                      >
                        {
                          tag
                        }

                        <button
                          type="button"
                          aria-label={`${tag} 태그 삭제`}
                          onClick={() =>
                            handleRemoveTag(
                              tag,
                            )
                          }
                          className="text-[#9A9AA3] hover:text-[#C0473C]"
                        >
                          ×
                        </button>
                      </p>
                    ),
                  )}

                  {isTagInputOpen ? (
                    <div className="flex items-center gap-[8px]">
                      <input
                        autoFocus
                        value={
                          tagInput
                        }
                        onChange={(
                          event,
                        ) =>
                          setTagInput(
                            event.target.value,
                          )
                        }
                        onKeyDown={(
                          event,
                        ) => {
                          if (
                            event.key ===
                            'Enter'
                          ) {
                            event.preventDefault()

                            handleAddTag()
                          }

                          if (
                            event.key ===
                            'Escape'
                          ) {
                            setTagInput(
                              '',
                            )

                            setIsTagInputOpen(
                              false,
                            )
                          }
                        }}
                        placeholder="태그 입력"
                        className="h-[32px] w-[130px] rounded-[8px] border border-[#D4D4D8] px-[10px] text-[14px] outline-none focus:border-[#6366F1]"
                      />

                      <button
                        type="button"
                        onClick={
                          handleAddTag
                        }
                        className="text-[14px] font-bold text-[#6366F1]"
                      >
                        추가
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setIsTagInputOpen(
                          true,
                        )
                      }
                      className="text-[16px] font-normal text-[#9A9AA3] hover:text-[#6366F1]"
                    >
                      + 태그 추가
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              예시 입력 / 결과
          ========================= */}
          <div className="mt-[20px] flex items-stretch justify-between">
            <div className="flex min-h-[190px] w-[567px] flex-col rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white p-[24px]">
              <p className="text-[15px] font-bold text-[#9A9AA3]">
                예시 입력
              </p>

              <textarea
                value={
                  exampleInput
                }
                onChange={(
                  event,
                ) =>
                  setExampleInput(
                    event.target.value,
                  )
                }
                placeholder="사용자가 입력할 수 있는 예시를 작성해 주세요"
                className="mt-[14px] min-h-[102px] w-full resize-none rounded-[8px] border-[1.5px] border-[#E4E4E7] p-[14px] text-[15px] outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="flex min-h-[190px] w-[567px] flex-col rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white p-[24px]">
              <div className="flex w-full items-center justify-between">
                <p className="text-[15px] font-bold text-[#9A9AA3]">
                  예시 결과
                </p>

                <div className="relative flex h-[32px] w-[117px] items-center justify-center">
                  <img
                    src={
                      temp_dashed
                    }
                    alt=""
                    className="absolute inset-0 h-full w-full"
                  />

                  <p className="relative text-[16px] font-bold text-[#52525B]">
                    Template
                  </p>
                </div>
              </div>

              <textarea
                value={
                  exampleResult
                }
                onChange={(
                  event,
                ) =>
                  setExampleResult(
                    event.target.value,
                  )
                }
                placeholder="예상되는 결과 예시를 작성해 주세요"
                className="mt-[14px] min-h-[102px] w-full resize-none rounded-[8px] border-[1.5px] border-[#E4E4E7] p-[14px] text-[15px] outline-none focus:border-[#6366F1]"
              />

              <p className="mt-[6px] text-[14.5px] text-[#9A9AA3]">
                예시 결과는 학습용 미리보기입니다.
              </p>
            </div>
          </div>

          {/* =========================
              작성자 노트
          ========================= */}
          <div className="mt-[21px] min-h-[176px] w-[1158px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white px-[31px] pb-[25px] pt-[25px]">
            <p className="text-[14px] font-bold text-[#9A9AA3]">
              작성자 노트
            </p>

            <textarea
              value={
                authorNote
              }
              onChange={(
                event,
              ) =>
                setAuthorNote(
                  event.target.value,
                )
              }
              placeholder="이 흐름을 사용하는 사람에게 도움이 될 내용을 작성해 주세요"
              className="mt-[14px] min-h-[88px] w-full resize-none rounded-[12px] border-[1.5px] border-[#E4E4E7] p-[14px] text-[15px] outline-none focus:border-[#6366F1]"
            />
          </div>

          {formError && (
            <div className="mt-[18px] rounded-[10px] border border-[#F1C7C2] bg-[#FFF5F4] px-[18px] py-[14px] text-[15px] font-bold text-[#B4453A]">
              {
                formError
              }
            </div>
          )}
        </div>
      </main>

      {/* =========================
          하단
      ========================= */}
      <footer className="flex h-[82px] items-center bg-white pl-[52px] pr-[28px]">
        <button
          type="button"
          onClick={
            handleBack
          }
          className="cursor-pointer text-[18.5px] font-bold text-[#52525B]"
        >
          ← 검토
        </button>

        <p className="flex-1 pl-[38px] text-[16px] text-[#9A9AA3]">
          2 / 3 · 상세 정보 — 이름 · 요약 · 분류 입력
        </p>

        <button
          type="button"
          onClick={
            handleNext
          }
          className="flex h-[50px] w-[186px] cursor-pointer items-center justify-center rounded-[12px] bg-[#6366F1] text-[17.5px] font-bold text-white hover:bg-[#3A3DC2]"
        >
          다음: 공개 설정 →
        </button>
      </footer>
    </>
  )
}