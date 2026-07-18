import { useState } from 'react'
import {
  ArrowLeft,
  Eye,
  Globe2,
  Lock,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { PageContainer } from '../../components/layout/PageContainer'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

import {
  mockCreatedWorkflows,
} from '../../feature/storage/data/storage'

function WorkflowDetailPage() {
  const { workflowId } = useParams()
  const navigate = useNavigate()

  const workflow = mockCreatedWorkflows.find(
    (item) => item.id === Number(workflowId),
  )

  const [visibility, setVisibility] = useState<
    'public' | 'private'
  >(workflow?.visibility ?? 'private')

  if (!workflow) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <PageContainer className="py-20">
          <Card className="px-6 py-16 text-center">
            <h1 className="text-2xl font-black text-slate-900">
              워크플로우를 찾을 수 없습니다.
            </h1>

            <p className="mt-3 text-sm font-semibold text-slate-400">
              주소를 확인하거나 내 저장소로 돌아가 주세요.
            </p>

            <Button
              className="mt-8"
              onClick={() => navigate('/my-storage')}
            >
              내 저장소로
            </Button>
          </Card>
        </PageContainer>

        <Footer />
      </div>
    )
  }

  const handleEdit = () => {
    navigate(`/studio/${workflow.id}/edit`)
  }

  const handlePreview = () => {
    navigate(`/workflows/${workflow.id}/preview`)
  }

  const handleToggleVisibility = () => {
    setVisibility((previousVisibility) =>
      previousVisibility === 'public'
        ? 'private'
        : 'public',
    )
  }

  const handleDelete = () => {
    console.log('삭제할 워크플로우:', workflow.id)

    navigate('/my-storage')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <PageContainer className="max-w-5xl py-12">
        <div className="space-y-6">
          {/* 뒤로 가기 */}
          <Link
            to="/my-storage"
            className="inline-flex items-center gap-2 text-sm font-black text-indigo-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={16} />
            내 저장소
          </Link>

          {/* 상단 정보 */}
          <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
                  {visibility === 'public' ? (
                    <Globe2 size={14} />
                  ) : (
                    <Lock size={14} />
                  )}

                  {visibility === 'public'
                    ? '공개'
                    : '비공개'}
                </span>

                <span className="text-xs font-semibold text-slate-400">
                  마지막 편집 {workflow.updatedAt}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                {workflow.title}
              </h1>

              <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                {workflow.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                  {workflow.level}
                </span>

                {workflow.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-600"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={handlePreview}
              >
                <Eye size={16} />
                미리보기
              </Button>

              <Button onClick={handleEdit}>
                <Pencil size={16} />
                편집
              </Button>
            </div>
          </section>

          {/* 블록 흐름 */}
          <Card className="px-6 py-5">
            <p className="text-sm font-black text-slate-400">
              블록 흐름
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {workflow.flowSteps.map(
                (step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3"
                  >
                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
                      {step.label}
                    </span>

                    {index <
                      workflow.flowSteps.length - 1 && (
                      <span className="text-lg font-black text-slate-300">
                        →
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
          </Card>

          {/* 예시 입력 / 결과 */}
          <section className="grid gap-5 md:grid-cols-2">
            <Card className="px-6 py-5">
              <p className="text-sm font-black text-slate-400">
                예시 입력
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
                “{workflow.exampleInput}”
              </div>
            </Card>

            <Card className="px-6 py-5">
              <p className="text-sm font-black text-slate-400">
                예시 결과
              </p>

              <div className="mt-5 space-y-3">
                {workflow.exampleResult.map(
                  (result, index) => (
                    <div
                      key={`${result}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-600">
                        {index + 1}
                      </span>

                      <span className="text-sm font-semibold text-slate-600">
                        {result}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </Card>
          </section>

          {/* 작성자 노트 */}
          <Card className="px-6 py-5">
            <p className="text-sm font-black text-slate-400">
              작성자 노트
            </p>

            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              {workflow.creatorNote}
            </p>
          </Card>

          {/* 공개 설정 */}
          <Card className="px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-700">
                  공개 설정
                </p>

                <p className="mt-2 text-sm font-medium text-slate-400">
                  현재 이 워크플로우는{' '}
                  <span className="font-black text-slate-600">
                    {visibility === 'public'
                      ? '공개'
                      : '비공개'}
                  </span>
                  상태입니다.
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={handleToggleVisibility}
              >
                {visibility === 'public' ? (
                  <Lock size={16} />
                ) : (
                  <Globe2 size={16} />
                )}

                {visibility === 'public'
                  ? '비공개로 전환'
                  : '공개로 전환'}
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <Button onClick={handleEdit}>
                <Pencil size={16} />
                편집
              </Button>

              <Button
                variant="secondary"
                onClick={handlePreview}
              >
                <Eye size={16} />
                미리보기
              </Button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-black text-rose-500 transition hover:bg-rose-50"
              >
                <Trash2 size={16} />
                삭제
              </button>
            </div>
          </Card>
        </div>
      </PageContainer>

      <Footer />
    </div>
  )
}

export default WorkflowDetailPage