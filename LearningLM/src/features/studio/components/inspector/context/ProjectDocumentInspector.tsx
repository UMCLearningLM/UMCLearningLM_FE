import {
  Check,
  FileText,
  FolderOpen,
} from 'lucide-react'

import {
  Button,
} from '../../../../../components/ui'

import {
  ConnectedSegmentedControl,
} from '../../../../Block/components/ui/ConnectedSegmentedControl'

import {
  ExpandableSettingBlock,
} from '../../../../Block/components/layouts/ExpandableSettingBlock'

import type {
  StudioBlockConfig,
  StudioSlotState,
} from '../../../types/studioNode'

import type {
  StudioBlockInspectorComponentProps,
} from '../StudioBlockInspector'

const studioInspectorClassName =
  '!w-full !rounded-[12px] !border-[#E4E4E7] !shadow-none [&_.setting-block-fields]:!w-full [&_.setting-block-fields]:max-w-full'

interface StaticProjectDocument {
  id: string
  label: string
  description: string
}

interface StaticProject {
  id: string
  label: string
  description: string
  documents: StaticProjectDocument[]
}

/*
 * 백엔드에 프로젝트/프로젝트 문서 조회 API가 없는 동안
 * Studio 시연과 FE 검증을 위해 사용하는 정적 데이터입니다.
 *
 * 이후 API가 추가되면 이 배열만 API 응답으로 교체하면
 * ProjectDocumentInspector의 config/validation 구조는 그대로 유지할 수 있습니다.
 */
const STATIC_PROJECTS: StaticProject[] = [
  {
    id: 'learninglm-main',
    label: 'LearningLM 프로젝트',
    description: 'LearningLM 서비스 기획·개발 문서',
    documents: [
      {
        id: 'learninglm-requirements',
        label: '요구사항 정의서.pdf',
        description: '서비스 기능 및 사용자 요구사항',
      },
      {
        id: 'learninglm-api-spec',
        label: 'API 명세서.pdf',
        description: 'FE-BE 연동 API 명세',
      },
      {
        id: 'learninglm-screen-spec',
        label: '화면 설계서.pdf',
        description: '주요 화면 및 인터랙션 정의',
      },
    ],
  },
  {
    id: 'legacy-payment-analysis',
    label: '레거시 결제 모듈 분석',
    description: '레거시 코드 분석 및 문서화 작업',
    documents: [
      {
        id: 'legacy-controller',
        label: 'legacy_controller.js',
        description: '분석 대상 레거시 컨트롤러',
      },
      {
        id: 'legacy-api-notes',
        label: '결제 API 정리.md',
        description: '기존 결제 API 참고 문서',
      },
      {
        id: 'legacy-qa-checklist',
        label: 'QA 체크리스트.md',
        description: '예외 케이스 및 QA 참고 자료',
      },
    ],
  },
  {
    id: 'team-documentation',
    label: '팀 협업 문서',
    description: '프로젝트 공통 협업 자료',
    documents: [
      {
        id: 'team-api-contract',
        label: 'FE-BE API 계약서.pdf',
        description: '프론트엔드와 백엔드 공통 API 계약',
      },
      {
        id: 'team-convention',
        label: '팀 컨벤션.md',
        description: 'Git 및 개발 공통 규칙',
      },
      {
        id: 'team-demo-flow',
        label: '발표 시나리오.md',
        description: '사용자 플로우 발표용 시나리오',
      },
    ],
  },
]

const projectUseRangeOptions = [
  {
    label: '전체',
    value: 'all',
  },
  {
    label: '핵심',
    value: 'core',
  },
  {
    label: '특정 섹션',
    value: 'section',
  },
]

function getString(
  config: StudioBlockConfig | undefined,
  key: string,
  fallback = '',
): string {
  const value =
    config?.[key]

  return typeof value ===
    'string'
    ? value
    : fallback
}

function getStringArray(
  config: StudioBlockConfig | undefined,
  key: string,
  fallback: string[] = [],
): string[] {
  const value =
    config?.[key]

  if (
    !Array.isArray(
      value,
    )
  ) {
    return fallback
  }

  return value.filter(
    (
      item,
    ): item is string =>
      typeof item ===
      'string',
  )
}

function resolveState(
  complete: boolean,
): StudioSlotState {
  return complete
    ? 'filled'
    : 'empty'
}

export function ProjectDocumentInspector({
  slot,
  onConfigChange,
}: StudioBlockInspectorComponentProps) {
  const projectId =
    getString(
      slot.config,
      'projectId',
    )

  const projectLabel =
    getString(
      slot.config,
      'projectLabel',
    )

  const selectedDocuments =
    getStringArray(
      slot.config,
      'selectedDocuments',
    )

  const useRange =
    getString(
      slot.config,
      'useRange',
      'all',
    )

  const selectedProject =
    STATIC_PROJECTS.find(
      (
        project,
      ) =>
        project.id ===
        projectId,
    ) ?? null

  const complete =
    Boolean(
      projectId,
    ) &&
    selectedDocuments.length >
    0 &&
    Boolean(
      useRange,
    )

  const save = (
    patch: StudioBlockConfig,
  ) => {
    const nextProjectId =
      typeof patch.projectId ===
        'string'
        ? patch.projectId
        : projectId

    const nextProjectLabel =
      typeof patch.projectLabel ===
        'string'
        ? patch.projectLabel
        : projectLabel

    const nextDocuments =
      Array.isArray(
        patch.selectedDocuments,
      )
        ? patch.selectedDocuments.filter(
          (
            item,
          ): item is string =>
            typeof item ===
            'string',
        )
        : selectedDocuments

    const nextUseRange =
      typeof patch.useRange ===
        'string'
        ? patch.useRange
        : useRange

    const nextComplete =
      Boolean(
        nextProjectId,
      ) &&
      nextDocuments.length >
      0 &&
      Boolean(
        nextUseRange,
      )

    onConfigChange(
      {
        projectId:
          nextProjectId,

        projectLabel:
          nextProjectLabel,

        selectedDocuments:
          nextDocuments,

        useRange:
          nextUseRange,
      },
      {
        summaryValue:
          nextProjectLabel ||
          nextProjectId ||
          (
            nextDocuments.length >
              0
              ? `${nextDocuments.length}개 문서`
              : ''
          ),

        /*
         * FE 필수 슬롯 validator는 slot.config 내용을 직접 검사하지 않고
         * slot.state === 'filled' 또는 slot.value 존재 여부를 봅니다.
         * 따라서 프로젝트 + 문서 + 사용 범위가 갖춰지는 순간
         * 반드시 filled 상태까지 함께 저장합니다.
         */
        state:
          resolveState(
            nextComplete,
          ),
      },
    )
  }

  const handleProjectChange = (
    nextProjectId: string,
  ) => {
    const nextProject =
      STATIC_PROJECTS.find(
        (
          project,
        ) =>
          project.id ===
          nextProjectId,
      ) ?? null

    save({
      projectId:
        nextProject?.id ??
        '',

      projectLabel:
        nextProject?.label ??
        '',

      /*
       * 프로젝트가 바뀌면 이전 프로젝트에서 선택한 문서가
       * 남지 않도록 초기화합니다.
       */
      selectedDocuments:
        [],
    })
  }

  const toggleDocument = (
    documentLabel: string,
  ) => {
    const exists =
      selectedDocuments.includes(
        documentLabel,
      )

    const nextDocuments =
      exists
        ? selectedDocuments.filter(
          (
            item,
          ) =>
            item !==
            documentLabel,
        )
        : [
          ...selectedDocuments,
          documentLabel,
        ]

    save({
      selectedDocuments:
        nextDocuments,
    })
  }

  const moveDocument = (
    index: number,
    direction: -1 | 1,
  ) => {
    const nextIndex =
      index +
      direction

    if (
      nextIndex <
      0 ||
      nextIndex >=
      selectedDocuments.length
    ) {
      return
    }

    const next =
      [
        ...selectedDocuments,
      ]

    const current =
      next[index]

    next[index] =
      next[nextIndex]

    next[nextIndex] =
      current

    save({
      selectedDocuments:
        next,
    })
  }

  return (
    <ExpandableSettingBlock
      title="프로젝트 문서 불러오기"
      // code="CTX-001"
      // stage="CONTEXT"
      // description="프로젝트를 선택하고 참고할 문서를 지정합니다."
      // icon={
      //   <FileText
      //     size={18}
      //   />
      // }
      // category="CORE"
      // tagCounts={{
      //   required: 2,
      //   optional: 2,
      //   missing:
      //     Number(
      //       !projectId,
      //     ) +
      //     Number(
      //       selectedDocuments.length ===
      //         0,
      //     ),
      // }}
      required={
        slot.required
      }
      defaultOpen
      className={
        studioInspectorClassName
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <span
            className={[
              'text-xs',

              complete
                ? 'font-bold text-emerald-600'
                : 'text-slate-400',
            ].join(
              ' ',
            )}
          >
            {complete
              ? '프로젝트 문서 설정 완료'
              : '프로젝트 또는 참고 문서 미선택'}
          </span>

          <Button
            size="sm"
            onClick={() =>
              save({})
            }
          >
            적용
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-bold text-slate-700">
            프로젝트{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <div className="relative">
            <FolderOpen
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={
                projectId
              }
              onChange={(
                event,
              ) =>
                handleProjectChange(
                  event.target.value,
                )
              }
              className={[
                'h-[48px] w-full appearance-none rounded-xl border-2 bg-white pl-10 pr-10 text-sm font-semibold outline-none transition',

                projectId
                  ? 'border-indigo-500 text-slate-700'
                  : 'border-slate-200 text-slate-400 focus:border-indigo-500',
              ].join(
                ' ',
              )}
            >
              <option value="">
                프로젝트를 선택하세요
              </option>

              {STATIC_PROJECTS.map(
                (
                  project,
                ) => (
                  <option
                    key={
                      project.id
                    }
                    value={
                      project.id
                    }
                  >
                    {
                      project.label
                    }
                  </option>
                ),
              )}
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              ▼
            </span>
          </div>

          {selectedProject && (
            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              {
                selectedProject.description
              }
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-bold text-slate-700">
            참고 문서{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          {!selectedProject ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-5 text-center">
              <p className="text-sm font-bold text-slate-500">
                프로젝트를 먼저 선택하세요
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                프로젝트를 선택하면 정적 문서 목록이 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedProject.documents.map(
                (
                  document,
                ) => {
                  const checked =
                    selectedDocuments.includes(
                      document.label,
                    )

                  return (
                    <button
                      key={
                        document.id
                      }
                      type="button"
                      onClick={() =>
                        toggleDocument(
                          document.label,
                        )
                      }
                      className={[
                        'flex min-h-[68px] w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition',

                        checked
                          ? 'border-indigo-500 bg-indigo-50/30'
                          : 'border-slate-200 bg-white hover:border-indigo-300',
                      ].join(
                        ' ',
                      )}
                    >
                      <span
                        className={[
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-2',

                          checked
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : 'border-slate-300 bg-white text-transparent',
                        ].join(
                          ' ',
                        )}
                      >
                        <Check
                          size={13}
                          strokeWidth={3}
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-700">
                          {
                            document.label
                          }
                        </span>

                        <span className="mt-1 block truncate text-[11px] text-slate-400">
                          {
                            document.description
                          }
                        </span>
                      </span>
                    </button>
                  )
                },
              )}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              문서 우선순위
            </p>

            <span className="text-[11px] text-emerald-500">
              선택
            </span>
          </div>

          {selectedDocuments.length ===
            0 ? (
            <p className="rounded-lg bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-400">
              참고 문서를 선택하면 우선순위를 조정할 수 있습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedDocuments.map(
                (
                  document,
                  index,
                ) => (
                  <div
                    key={`${document}-${index}`}
                    className="flex min-h-[46px] items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-xs font-black text-indigo-600">
                      {index +
                        1}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-xs font-bold text-slate-600">
                      {
                        document
                      }
                    </span>

                    <button
                      type="button"
                      disabled={
                        index ===
                        0
                      }
                      onClick={() =>
                        moveDocument(
                          index,
                          -1,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-xs text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        selectedDocuments.length -
                        1
                      }
                      onClick={() =>
                        moveDocument(
                          index,
                          1,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-xs text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-bold text-slate-700">
            사용 범위{' '}
            <span className="text-rose-500">
              *
            </span>
          </p>

          <ConnectedSegmentedControl
            options={
              projectUseRangeOptions
            }
            value={
              useRange
            }
            onChange={(
              value,
            ) =>
              save({
                useRange:
                  value,
              })
            }
          />
        </div>
      </div>
    </ExpandableSettingBlock>
  )
}