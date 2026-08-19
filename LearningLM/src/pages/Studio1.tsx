import {useEffect,  useState } from 'react'
import { ArrowRight, Copy, Video } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { StudioSimulation } from '../features/studio/simulation/components/StudioSimulation'
import { createFlow, getFlow } from '../pages/api/StudioApi'
import {
  getSavedTutorials,
  getStorageFlows,
} from '../api/storage'

type StudioEntryState = {
  flowId?: number
  tutorialId?: number
  originFlowId?: number
}
type ContinueItem = {
  type: 'copied' | 'tutorial'
  flowId: number
  title: string
  authorNickname?: string | null
  updatedAt: string
}

export function Studio1() {
  const navigate = useNavigate()
  const location = useLocation()
  const [continueItem, setContinueItem] =
  useState<ContinueItem | null>(null)
  const [
  isSimulationOpen,
  setIsSimulationOpen,
] = useState(false)

  const locationState =
    (location.state as StudioEntryState | null) ?? null

  useEffect(() => {
  const loadContinueItem = async () => {
    try {
      const [
        savedTutorials,
        copiedFlows,
      ] = await Promise.all([
        getSavedTutorials(),
        getStorageFlows('copied'),
      ])

      console.log(
        '저장한 튜토리얼:',
        savedTutorials,
      )

      console.log(
        '복사한 흐름:',
        copiedFlows,
      )

      const tutorialItems: ContinueItem[] =
        savedTutorials.tutorials
          .filter(
            (tutorial) =>
              tutorial.flowId !== null &&
              tutorial.flowId !== undefined,
          )
          .map((tutorial) => ({
            type: 'tutorial',
            flowId: tutorial.flowId as number,
            title: tutorial.title,
            updatedAt: tutorial.updatedAt,
          }))

        const copiedItems: ContinueItem[] =
          copiedFlows.flows.map((flow) => ({
            type: 'copied',
            flowId: flow.flowId,
            title: flow.title,
            authorNickname:
              flow.originalAuthorNickname,
            updatedAt: flow.updatedAt,
          }))

        const allItems: ContinueItem[] = [
          ...tutorialItems,
          ...copiedItems,
        ]

        if (allItems.length === 0) {
          setContinueItem(null)
          return
        }

        allItems.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime(),
        )

        setContinueItem(allItems[0])
      } catch (error) {
        console.error(
          '저장소 조회 실패:',
          error,
        )

        setContinueItem(null)
      }
    }

    void loadContinueItem()
  }, [])
  const handleGuidedMode = () => {
    navigate('/official-tutorials')
  }

  /**
   * 자유 제작 모드
   *
   * 1. POST /flows
   * 2. 백엔드에서 flowId 발급
   * 3. Studio URL + state에 flowId 저장
   */
  const handleCreateMode = async () => {
    const accessToken =
      localStorage.getItem('accessToken') ?? undefined

    try {
      const response = await createFlow(
        {
          mode: 'CREATE',
        },
        accessToken,
      )

      const flowId = response.result.flowId

      console.log('POST /flows 전체 응답:', response)
      console.log('생성된 flowId:', flowId)

      navigate(`/studio/create?mode=create&flowId=${flowId}`, {
        state: {
          mode: 'create',
          flowId,
        },
      })
    } catch (error) {
      console.error('Flow 생성 실패:', error)
    }
  }

  /**
   * 복사된 Flow 이어 편집
   *
   * 다른 화면에서 이미 새 복사본 Flow를 만든 뒤
   * flowId를 전달했다고 가정합니다.
   */
  const handleContinueCopiedWorkflow = async () => {
  if (!continueItem) {
    console.error(
      '이어서 편집할 항목이 없습니다.',
    )
    return
  }

  try {
    const response = await getFlow(
      continueItem.flowId,
    )

    console.log(
      '가져온 Flow:',
      response,
    )

    console.log(
      '가져온 flowId:',
      response.result.flowId,
    )

    console.log(
      '가져온 title:',
      response.result.title,
    )

    console.log(
      '가져온 blockFlow:',
      response.result.blockFlow,
    )

    navigate(
      `/studio/create?mode=edit&flowId=${response.result.flowId}`,
      {
        state: {
          mode: 'edit',
          flowId:
            response.result.flowId,
          flowData: response.result,
        },
      },
    )
  } catch (error) {
    console.error(
      'Flow 가져오기 실패:',
      error,
    )
  }
}
  /**
   * 시뮬레이션 완료 후 Studio 시작
   *
   * tutorialId가 있으면 GUIDED Flow,
   * originFlowId가 있으면 원본 Flow 기반,
   * 둘 다 없으면 자유 제작 Flow를 생성합니다.
   */
  const handleStartStudioFromSimulation = async () => {
    const accessToken =
      localStorage.getItem('accessToken') ?? undefined

    const tutorialId = locationState?.tutorialId
    const originFlowId = locationState?.originFlowId

    try {
      const response = await createFlow(
        {
          mode: tutorialId ? 'GUIDED' : 'CREATE',
          tutorialId: tutorialId ?? null,
          originFlowId: originFlowId ?? null,
        },
        accessToken,
      )

      const flowId = response.result.flowId

      const mode = tutorialId
        ? 'guided'
        : originFlowId
          ? 'copied'
          : 'create'

      console.log('Flow 생성 응답:', response)
      console.log('생성된 flowId:', flowId)
      console.log('tutorialId:', tutorialId)
      console.log('originFlowId:', originFlowId)

      navigate(`/studio/create?mode=${mode}&flowId=${flowId}`, {
        state: {
          mode,
          flowId,
          tutorialId,
          originFlowId,
        },
      })
    } catch (error) {
      console.error('Flow 생성 실패:', error)
    }
  }
  return (
    <>
    
      <div className="flex min-h-screen flex-col bg-[#F6F6F8] text-[#27272A]">
        <Header />

        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1000px] px-6 pb-[64px] pt-[62px]">
            {/* =========================
                페이지 소개
            ========================= */}
            <section className="text-center">
              <p className="text-[13px] font-bold text-[#A1A1AA]">
                블록 스튜디오
              </p>

              <h1 className="mt-[12px] text-[38px] font-black tracking-[-0.04em] text-[#27272A]">
                어떻게 시작할까요?
              </h1>

              <p className="mx-auto mt-[18px] max-w-[520px] text-[14px] font-medium leading-[23px] text-[#71717A]">
                튜토리얼을 따라가거나, 빈 캔버스에서 직접 흐름을 만들
                수 있습니다.
                <br />
                모든 흐름은 입력 → 컨텍스트 → 프로세스 → 검토 → 결과
                5단계 노드를
                <br />
                좌→우로 연결해 조립합니다.
              </p>
            </section>

            {/* =========================
                가이드 / 자유 제작
            ========================= */}
            <section className="mt-[62px] grid grid-cols-1 gap-[26px] md:grid-cols-2">
              {/* 가이드 모드 */}
              <article className="rounded-[12px] border border-[#DEDEE3] bg-white p-[28px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="h-[130px] w-full rounded-[9px] border border-[#DEDEE3] bg-[#F4F4F5]" />

                <div className="mt-[15px] flex items-center gap-[12px]">
                  <h2 className="text-[20px] font-black tracking-[-0.025em] text-[#27272A]">
                    가이드 모드
                  </h2>

                  <span className="ml-auto shrink-0 rounded-[6px] border border-[#5FAA81] bg-[#DFF2DF] px-[8px] py-[4px] text-[11px] font-bold text-[#5FAA81]">
                    입문자 추천
                  </span>
                </div>

                <p className="mt-[14px] min-h-[42px] text-[13px] font-medium leading-[21px] text-[#71717A]">
                  팔레트에서 단계에 맞는 블록을 골라 노드를 채우며
                  흐름을 완성합니다.
                </p>

                <button
                  type="button"
                  onClick={handleGuidedMode}
                  className="mt-[20px] flex h-[40px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-[#6366F1] text-[14px] font-bold text-white transition hover:bg-[#5558E8]"
                >
                  가이드 모드 시작
                </button>
              </article>

              {/* 자유 제작 모드 */}
              <article className="rounded-[12px] border border-[#DEDEE3] bg-white p-[28px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="h-[130px] w-full rounded-[9px] border border-[#DEDEE3] bg-[#F4F4F5]" />

                <h2 className="mt-[15px] text-[20px] font-black tracking-[-0.025em] text-[#27272A]">
                  자유 제작 모드
                </h2>

                <p className="mt-[14px] min-h-[42px] text-[13px] font-medium leading-[21px] text-[#71717A]">
                  빈 캔버스에서 팔레트의 블록을 끌어다 노드를 직접
                  연결합니다.
                </p>

                <button
                  type="button"
                  onClick={handleCreateMode}
                  className="mt-[20px] flex h-[40px] w-full cursor-pointer items-center justify-center rounded-[6px] border border-[#D4D4D8] bg-white text-[14px] font-bold text-[#27272A] transition hover:border-[#6366F1] hover:text-[#6366F1]"
                >
                  빈 캔버스로 시작
                </button>
              </article>
            </section>

            {/* =========================
                시뮬레이션 모드
            ========================= */}
            <section className="mt-[10px]">
              <div className="flex min-h-[102px] items-center rounded-[9px] border border-[#DEDEE3] bg-white px-[36px] py-[20px]">
                <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-[#666666]">
                  <Video size={30} strokeWidth={2} />
                </div>

                <div className="ml-[18px] min-w-0 flex-1">
                  <h2 className="text-[18px] font-black tracking-[-0.025em] text-[#27272A]">
                    시뮬레이션 모드
                  </h2>

                  <p className="mt-[5px] text-[12px] font-medium text-[#A1A1AA]">
                    팔레트 선택 → 노드 부착 → 인스펙터 설정 →
                    실행까지 전 과정을 시뮬레이터로 확인합니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSimulationOpen(true)}
                  className="ml-[24px] inline-flex h-[42px] shrink-0 cursor-pointer items-center gap-[4px] rounded-[7px] border-[2px] border-[#6366F1] bg-white px-[14px] text-[13px] font-bold text-[#6366F1] transition hover:bg-[#F4F4FF]"
                >
                  시뮬레이션 보기
                  <ArrowRight size={15} strokeWidth={2} />
                </button>
              </div>
            </section>

            {/* =========================
                복사 워크플로우 (flowId 존재 시에만 렌더링)
            ========================= */}
            {continueItem && (
              <section className="mt-[12px]">
                <div className="flex min-h-[102px] items-center rounded-[9px] border border-[#DEDEE3] bg-white px-[36px] py-[20px]">
                  <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-[#666666]">
                    <Copy size={31} strokeWidth={2} />
                  </div>

                  <div className="ml-[18px] min-w-0 flex-1">
                    <h2 className="text-[18px] font-black tracking-[-0.025em] text-[#27272A]">
                      복사한 워크플로우 이어서 편집
                    </h2>

                    <p className="mt-[5px] truncate text-[12px] font-medium text-[#A1A1AA]">
                      &quot;{continueItem.title}&quot;
                      {continueItem.type === 'copied' &&
                        continueItem.authorNickname && (
                          <>
                            {' · '}
                            {continueItem.authorNickname}
                            님의 공개 흐름 복사본
                          </>
                        )}

                      {continueItem.type === 'tutorial' && (
                        <>
                          {' · '}
                          저장한 튜토리얼
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      void handleContinueCopiedWorkflow()
                    }}
                    className="ml-[24px] inline-flex h-[42px] shrink-0 cursor-pointer items-center justify-center rounded-[7px] border border-[#D4D4D8] bg-white px-[18px] text-[13px] font-bold text-[#27272A] transition hover:border-[#6366F1] hover:text-[#6366F1]"
                  >
                    편집 계속하기
                  </button>
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* =========================
          Studio Simulation Modal
      ========================= */}
      <StudioSimulation
        open={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onStartStudio={handleStartStudioFromSimulation}
      />
    </>
  )
}