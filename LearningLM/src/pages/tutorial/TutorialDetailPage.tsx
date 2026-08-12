import { useState } from 'react'
import { ArrowLeft, Blocks, Clock } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import {
  getTutorialById,
  type TutorialBlock,
} from '../../features/tutorial/data/tutorials'
import { deleteFlow, getFlow, type GetFlowResult } from "../api/StudioApi"

const levelClassMap = {
  입문: 'bg-emerald-50 text-emerald-600',
  기초: 'bg-blue-50 text-blue-600',
  응용: 'bg-rose-50 text-rose-600',
}

const blockColorClassMap: Record<TutorialBlock['color'], string> = {
  blue: 'bg-blue-500',
  teal: 'bg-teal-600',
  green: 'bg-emerald-600',
}

const flowLabelClassMap: Record<TutorialBlock['color'], string> = {
  blue: 'border-blue-300 bg-slate-50 text-slate-700',
  teal: 'border-teal-300 bg-slate-50 text-slate-700',
  green: 'border-emerald-300 bg-slate-50 text-slate-700',
}

function FlowStep({
  label,
  color,
}: {
  label: string
  color: TutorialBlock['color']
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black shadow-sm',
        flowLabelClassMap[color],
      ].join(' ')}
    >
      <span
        className={[
          'h-2.5 w-2.5 rounded-sm',
          blockColorClassMap[color],
        ].join(' ')}
      />
      {label}
    </span>
  )
}

function BlockCard({ block }: { block: TutorialBlock }) {
  return (
    <Card className="px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={[
              'h-3 w-3 rounded-sm',
              blockColorClassMap[block.color],
            ].join(' ')}
          />
          <h3 className="text-xl font-black text-slate-950">
            {block.title}
          </h3>
        </div>

        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
          {block.type}
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-600">
        {block.description}
      </p>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400">
        <span className="mr-2 text-slate-300">
          왜 필요?
        </span>
        {block.why}
      </div>
    </Card>
  )
}

export function TutorialDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)

  const tutorialId = Number(params.tutorialId)
  console.log("현재 tutorialId:", tutorialId)
  const tutorial = getTutorialById(tutorialId)

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <PageContainer className="py-20">
          <Card className="px-6 py-16 text-center">
            <h1 className="text-2xl font-black text-slate-900">
              튜토리얼을 찾을 수 없습니다.
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-400">
              주소를 다시 확인하거나 목록으로 돌아가 주세요.
            </p>
            <Button
              className="mt-8"
              onClick={() => navigate('/official-tutorials')}
            >
              튜토리얼 목록으로
            </Button>
          </Card>
        </PageContainer>

        <Footer />
      </div>
    )
  }

  const handleStartTutorial = () => {
    navigate(
      `/studio/create?mode=guided&tutorialId=${tutorial.id}`,
      {
        state: {
          mode: 'guided',
          tutorialId: tutorial.id,
        },
      },
    )
  }

  const handleToggleSave = () => {
    /*
     * API 연동 전에는 화면 상태만 변경합니다.
     * 이후 저장 API가 연결되면 이 함수 내부를 mutation으로 교체하면 됩니다.
     */
    setIsSaved((previous) => !previous)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <PageContainer className="max-w-5xl py-12">
        <div className="space-y-9">
          <Link
            to="/official-tutorials"
            className="inline-flex items-center gap-2 text-sm font-black text-indigo-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={16} />
            튜토리얼 목록
          </Link>

          <section>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-400">
              <span
                className={[
                  'rounded-lg px-3 py-1.5 text-sm font-black',
                  levelClassMap[tutorial.level],
                ].join(' ')}
              >
                {tutorial.level}
              </span>

              <span className="inline-flex items-center gap-1">
                <Clock size={16} />
                {tutorial.estimatedMinutes}분
              </span>

              <span className="inline-flex items-center gap-1">
                <Blocks size={16} />
                블록 {tutorial.blockCount}개
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {tutorial.title}
            </h1>

            <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
              {tutorial.description.replace('합니다.', '해 봅니다.')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={handleStartTutorial}
              >
                튜토리얼 시작하기
              </Button>

              <Button
                variant="secondary"
                size="lg"
                aria-pressed={isSaved}
                onClick={handleToggleSave}
              >
                {isSaved
                  ? '튜토리얼 저장됨'
                  : '튜토리얼 저장'}
              </Button>
            </div>
          </section>

          <Card className="px-6 py-5">
            <p className="text-sm font-black text-slate-400">
              이럴 때 쓸 수 있어요 · 실제 활용 사례
            </p>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {tutorial.useCases.map((useCase) => (
                <div key={useCase.label}>
                  <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">
                    {useCase.label}
                  </span>
                  <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-400">
              <span className="mr-3">
                필요 개념
              </span>
              {tutorial.requiredConcepts.join(' · ')}
            </div>
          </Card>

          <Card className="px-6 py-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-slate-400">
                블록 흐름
              </p>
              <span className="rounded-lg border border-dashed border-slate-200 bg-white px-5 py-2 text-sm font-black text-slate-600">
                Preset
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {tutorial.flowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3"
                >
                  <FlowStep
                    label={step.label}
                    color={step.color}
                  />
                  {index < tutorial.flowSteps.length - 1 && (
                    <span className="text-xl font-black text-slate-300">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <section>
            <p className="mb-4 text-sm font-black text-slate-400">
              사용하는 블록
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {tutorial.blocks.map((block) => (
                <BlockCard
                  key={block.id}
                  block={block}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <Card className="px-6 py-5">
              <p className="text-sm font-black text-slate-400">
                예시 입력
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
                “{tutorial.exampleInput}”
              </div>
            </Card>

            <Card className="px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-400">
                  예시 결과
                </p>
                <span className="text-sm font-black text-slate-300">
                  예시 결과
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {tutorial.exampleResult.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className="h-3 rounded-full bg-slate-100"
                  >
                    <div className="h-3 w-4/5 rounded-full bg-slate-200" />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-black text-slate-400">
                  결과 출처
                </p>
                <span className="rounded-lg border border-dashed border-slate-200 bg-white px-5 py-2 text-sm font-black text-slate-600">
                  {tutorial.resultSource}
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-400">
                ※ 예시 결과이며 실제 실행 결과를 보장하지 않습니다.
              </p>
            </Card>
          </section>
        </div>
      </PageContainer>

      <Footer />
    </div>
  )
}
