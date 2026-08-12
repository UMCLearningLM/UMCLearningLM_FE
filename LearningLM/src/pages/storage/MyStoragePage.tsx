import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Copy,
  FolderKanban,
} from 'lucide-react'

import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { PageContainer } from '../../components/layout/PageContainer'

import { tutorials } from '../../features/tutorial/data/tutorials'

import {
  mockCreatedWorkflows as initialCreatedWorkflows,
  mockSavedTutorialRecords as initialSavedTutorialRecords,
  mockCopiedWorkflows as initialCopiedWorkflows,
} from '../../features/storage/data/storage'

import { SavedTutorialCard } from '../../features/storage/components/SavedTutorialCard'
import { CreateWorkflowCard } from '../../features/storage/components/CreateWorkflowCard'
import { CopiedWorkflowCard, type CopiedWorkflow } from '../../features/storage/components/CopiedWorkflowCard'

type StorageTab = 'saved' | 'created' | 'copied'

const ITEMS_PER_PAGE = 6

function MyStoragePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')

  const [selectedTab, setSelectedTab] =
    useState<StorageTab>(
      requestedTab === 'created' || requestedTab === 'copied'
        ? requestedTab
        : 'saved',
    )

  const [currentPage, setCurrentPage] = useState(0)

  /*
   * mock 데이터를 state에 넣는 이유:
   * 저장 해제나 공개 상태 변경을 화면에 바로 반영하기 위해서입니다.
   */
  const [savedTutorialRecords, setSavedTutorialRecords] =
    useState(initialSavedTutorialRecords)

  const [createdWorkflows, setCreatedWorkflows] =
    useState(initialCreatedWorkflows)

  const [copiedWorkflows] = useState(initialCopiedWorkflows)

  /*
   * 저장 데이터에 대한 정보를 준비합니다.
   */
  const savedTutorials = useMemo(() => {
    return savedTutorialRecords
      .map((savedRecord) => {
        const tutorial = tutorials.find(
          (item) => item.id === savedRecord.tutorialId,
        )

        if (!tutorial) {
          return null
        }

        return {
          tutorial,
          currentStep: savedRecord.currentStep,
          totalSteps: savedRecord.totalSteps,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  }, [savedTutorialRecords])

  const tabs = [
    {
      id: 'saved' as const,
      label: '저장한 튜토리얼',
      icon: Bookmark,
      count: savedTutorials.length,
    },
    {
      id: 'created' as const,
      label: '내가 만든 흐름',
      icon: FolderKanban,
      count: createdWorkflows.length,
    },
    {
      id: 'copied' as const,
      label: '복사한 흐름',
      icon: Copy,
      count: copiedWorkflows.length,
    },
  ]

  /*
   * 현재 탭의 전체 데이터 개수
   */
  const selectedItemCount = useMemo(() => {
    if (selectedTab === 'saved') {
      return savedTutorials.length
    }

    if (selectedTab === 'created') {
      return createdWorkflows.length
    }

    return copiedWorkflows.length
  }, [
    selectedTab,
    savedTutorials.length,
    createdWorkflows.length,
    copiedWorkflows.length,
  ])

  const totalPages = Math.ceil(
    selectedItemCount / ITEMS_PER_PAGE,
  )

  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const visibleSavedTutorials = savedTutorials.slice(
    startIndex,
    endIndex,
  )

  const visibleCreatedWorkflows = createdWorkflows.slice(
    startIndex,
    endIndex,
  )

  const visibleCopiedWorkflows = copiedWorkflows.slice(
    startIndex,
    endIndex,
  )

  /*
   * 탭을 변경하면 첫 페이지로 돌아갑니다.
   */
  useEffect(() => {
    setCurrentPage(0)
  }, [selectedTab])

  /*
   * 저장 해제로 데이터가 줄었을 때
   * 존재하지 않는 페이지를 보고 있지 않도록 조정합니다.
   */
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(0)
      return
    }

    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1)
    }
  }, [currentPage, totalPages])

  /*
   * 저장한 튜토리얼 버튼 함수
   */
  const handleContinueTutorial = (tutorialId: number) => {
    navigate(`/official-tutorials/${tutorialId}`)
  }

  const handleRemoveTutorial = (tutorialId: number) => {
    setSavedTutorialRecords((previousRecords) =>
      previousRecords.filter(
        (record) => record.tutorialId !== tutorialId,
      ),
    )
  }

  /*
   * 내가 만든 흐름 버튼 함수
   */
  const handleEditWorkflow = (workflowId: number) => {
    navigate(`/my-storage/workflows/${workflowId}`)
  }

  const handlePreviewWorkflow = (workflowId: number) => {
    navigate(`/workflows/${workflowId}/preview`)
  }

  const handleToggleVisibility = (workflowId: number) => {
    setCreatedWorkflows((previousWorkflows) =>
      previousWorkflows.map((workflow) => {
        if (workflow.id !== workflowId) {
          return workflow
        }

        return {
          ...workflow,
          visibility:
            workflow.visibility === 'public'
              ? 'private'
              : 'public',
        }
      }),
    )
  }

  /*
   * 복사한 흐름 버튼 함수
   */
  const handleViewOriginal = (
    originalWorkflowId: number,
  ) => {
    navigate(`/public-library/${originalWorkflowId}`)
  }

  const handleEditCopy = (workflowId: number) => {
    navigate(`/studio/${workflowId}/edit`)
  }

  const handlePreviousPage = () => {
    setCurrentPage((previousPage) =>
      Math.max(previousPage - 1, 0),
    )
  }

  const handleNextPage = () => {
    setCurrentPage((previousPage) =>
      Math.min(previousPage + 1, totalPages - 1),
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <PageContainer className="py-14">
        <section>
          {/* 페이지 제목 */}
          <div>
            <p className="text-sm font-bold text-slate-400">
              내 저장소
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              저장한 학습과 워크플로우
            </h1>
          </div>

          {/* 탭 */}
          <div className="mt-10 flex flex-wrap border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isSelected = selectedTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={[
                    'cursor-pointer flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-black transition',
                    isSelected
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800',
                  ].join(' ')}
                >
                  <Icon size={16} />

                  <span>{tab.label}</span>

                  <span
                    className={
                      isSelected
                        ? 'text-indigo-400'
                        : 'text-slate-400'
                    }
                  >
                    ({tab.count})
                  </span>
                </button>
              )
            })}
          </div>

          {/* 카드 목록 */}
          <div className="relative mt-12">
            {selectedItemCount > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {/* 저장한 튜토리얼 */}
                {selectedTab === 'saved' &&
                  visibleSavedTutorials.map((item) => (
                    <SavedTutorialCard
                      key={item.tutorial.id}
                      tutorial={item.tutorial}
                      currentStep={item.currentStep}
                      totalSteps={item.totalSteps}
                      onContinue={handleContinueTutorial}
                      onRemove={handleRemoveTutorial}
                    />
                  ))}

                {/* 내가 만든 흐름 */}
                {selectedTab === 'created' &&
                  visibleCreatedWorkflows.map((workflow) => (
                    <CreateWorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      onEdit={handleEditWorkflow}
                      onPreview={handlePreviewWorkflow}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}

                {/* 복사한 흐름 */}
                {selectedTab === 'copied' &&
                  visibleCopiedWorkflows.map((workflow: CopiedWorkflow) => (
                    <CopiedWorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      onViewOriginal={handleViewOriginal}
                      onEditCopy={handleEditCopy}
                    />
                  ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                <p className="text-lg font-black text-slate-700">
                  표시할 항목이 없습니다.
                </p>

                <p className="mt-2 text-sm font-medium text-slate-400">
                  저장하거나 만든 흐름이 이곳에 표시됩니다.
                </p>
              </div>
            )}

            {/* 이전 버튼 */}
            {totalPages > 1 && currentPage > 0 && (
              <button
                type="button"
                aria-label="이전 페이지"
                onClick={handlePreviousPage}
                className="cursor-pointer absolute -left-14 top-1/2 hidden -translate-y-1/2 text-indigo-500 transition hover:-translate-x-1 xl:block"
              >
                <ArrowLeft size={40} strokeWidth={3} />
              </button>
            )}

            {/* 다음 버튼 */}
            {totalPages > 1 &&
              currentPage < totalPages - 1 && (
                <button
                  type="button"
                  aria-label="다음 페이지"
                  onClick={handleNextPage}
                  className="cursor-pointer absolute -right-14 top-1/2 hidden -translate-y-1/2 text-indigo-500 transition hover:translate-x-1 xl:block"
                >
                  <ArrowRight size={40} strokeWidth={3} />
                </button>
              )}
          </div>

          {/* 페이지 표시 점 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-10">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`${index + 1}번째 튜토리얼 페이지`}
                  onClick={() => setCurrentPage(index)}
                  className={[
                    'h-3 w-3 rounded-full border-2 border-indigo-500 transition',
                    currentPage === index ? 'bg-indigo-500' : 'bg-white',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </section>
      </PageContainer>

      <Footer />
    </div>
  )
}

export default MyStoragePage
