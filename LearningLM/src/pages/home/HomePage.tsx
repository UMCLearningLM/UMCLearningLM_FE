import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bookmark,
  Clock,
  Copy,
  MessageCircle,
  Search,
} from 'lucide-react'

import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { PageContainer } from '../../components/layout/PageContainer'
import { Section } from '../../components/layout/Section'

import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '../../components/ui/Card'
import { ThumbnailBox } from '../../components/ui/ThumbnailBox'

const values = [
  {
    title: '튜토리얼 우선',
    description: '빈 화면이 아닌, 단계별 공식 튜토리얼로 시작합니다.',
  },
  {
    title: '흐름을 배움',
    description: '입력·정리·생성·검토 블록을 연결해 과정을 익힙니다.',
  },
  {
    title: '저장·공유',
    description: '만든 흐름을 저장하고 공개해 다른 사람과 나눕니다.',
  },
  {
    title: '이런 건 아니에요',
    description: '챗봇, 모델 놀이터, 개발자 도구, 자동화 도구가 아닙니다.',
  },
]

const categories = [
  {
    icon: '자',
    title: '자료조사',
    filterValue: '자료조사',
    description: '튜토리얼 · 공개 흐름',
  },
  {
    icon: '문',
    title: '문서 요약',
    filterValue: '문서요약',
    description: '튜토리얼 · 공개 흐름',
  },
  {
    icon: '글',
    title: '글쓰기',
    filterValue: '글쓰기',
    description: '튜토리얼 · 공개 흐름',
  },
  {
    icon: '반',
    title: '반복 작업 정리',
    filterValue: '반복 작업 정리',
    description: '튜토리얼 · 공개 흐름',
  },
  {
    icon: '검',
    title: '결과물 검토',
    filterValue: '결과물 검토',
    description: '튜토리얼 · 공개 흐름',
  },
  {
    icon: 'A',
    title: 'AI 툴 활용',
    filterValue: 'AI 툴 활용',
    description: '튜토리얼 · 공개 흐름',
  },
]

const tutorials = [
  {
    id: 1,
    title: 'AI로 자료조사 흐름 만들기',
    description: '검색, 요약, 정리 블록으로 리서치 흐름을 완성합니다.',
    level: '입문',
    levelVariant: 'green' as const,
    tags: ['자료조사', '요약'],
    bookmarks: 4,
    minutes: 15,
  },
  {
    id: 2,
    title: '회의록 자동 요약 워크플로우',
    description: '긴 회의록을 핵심 항목으로 정리하는 흐름.',
    level: '기초',
    levelVariant: 'blue' as const,
    tags: ['문서 요약'],
    bookmarks: 5,
    minutes: 20,
  },
  {
    id: 3,
    title: '블로그 초안 작성 흐름',
    description: '주제 입력부터 초안 생성까지.',
    level: '기초',
    levelVariant: 'blue' as const,
    tags: ['글쓰기'],
    bookmarks: 6,
    minutes: 25,
  },
]

const workflows = [
  {
    id: 1,
    author: '김리서처',
    title: '경쟁사 리서치 정리표',
    description: '여러 출처를 표로 정리하는 공개 흐름.',
    category: '자료조사',
    level: '기초',
    levelVariant: 'blue' as const,
    saves: 128,
    copies: 64,
    comments: 14,
  },
  {
    id: 2,
    author: '이정리',
    title: '제품 리뷰 요약기',
    description: '리뷰 더미에서 장단점을 추출.',
    category: '결과물 검토',
    level: '입문',
    levelVariant: 'green' as const,
    saves: 96,
    copies: 41,
    comments: 11,
  },
  {
    id: 3,
    author: '박워크',
    title: '주간 업무 정리 자동화',
    description: '반복 작업을 체크리스트로.',
    category: '반복 작업 정리',
    level: '응용',
    levelVariant: 'pink' as const,
    saves: 210,
    copies: 132,
    comments: 23,
  },
]

const savedItems = [
  {
    title: '회의록 자동 요약 워크플로우',
    meta: '2일 전 저장',
    badges: ['튜토리얼', '기초'],
    action: '이어가기',
    path: '/official-tutorials/2',
  },
  {
    title: '제품 리뷰 요약기',
    meta: '이정리 님의 흐름 복사본 · 4일 전 저장',
    badges: ['공개 흐름', '입문'],
    action: '열기',
    path: '/public-library/2',
  },
]

export function HomePage() {
  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedKeyword = searchKeyword.trim()

    if (!normalizedKeyword) {
      navigate('/official-tutorials')
      return
    }

    navigate(
      `/official-tutorials?keyword=${encodeURIComponent(normalizedKeyword)}`,
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <PageContainer className="space-y-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_520px] lg:items-center">
            <div>
              <p className="text-sm font-bold text-slate-400">
                AI 활용 학습 플랫폼
              </p>

              <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
                블록을 쌓으며
                <br />
                AI 활용 흐름을 배웁니다
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-slate-500">
                공식 튜토리얼을 따라 하며 실제 업무에 사용하는 AI 활용
                과정을 직접 구성하고 저장할 수 있습니다.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => navigate('/official-tutorials')}
                >
                  튜토리얼 시작하기
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/public-library')}
                >
                  공개 활용 흐름 둘러보기
                </Button>
              </div>

              <form
                onSubmit={handleSearchSubmit}
                className="mt-6 flex h-12 max-w-md items-center gap-3 rounded-full border border-slate-200 bg-white px-4 text-slate-400 shadow-sm"
              >
                <Search size={18} />

                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="무엇을 배우고 싶으신가요? 예: 회의록 요약"
                  className="h-full flex-1 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  className="text-xs font-black text-indigo-500"
                >
                  검색
                </button>
              </form>
            </div>

            <ThumbnailBox
              variant="hero"
              label="히어로 일러스트 / 블록 흐름 이미지"
              className="min-h-64"
            />
          </div>
        </section>

        <Card className="overflow-hidden">
          <div className="grid divide-y divide-slate-200 md:grid-cols-4 md:divide-x md:divide-y-0">
            {values.map((item) => (
              <div key={item.title} className="p-6">
                <h3 className="font-bold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Section title="이어서 학습하기">
          <Card>
            <CardBody className="flex flex-col gap-5 md:flex-row md:items-center">
              <ThumbnailBox
                variant="compact"
                label="썸네일"
                className="h-24 w-full md:w-32"
              />

              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="green">입문</Badge>

                  <span className="text-xs font-semibold text-slate-400">
                    3 / 4 단계
                  </span>
                </div>

                <h3 className="font-bold text-slate-950">
                  AI로 자료조사 흐름 만들기
                </h3>

                <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-3/4 rounded-full bg-indigo-500" />
                </div>
              </div>

              <Button
                type="button"
                onClick={() => navigate('/official-tutorials/1')}
              >
                이어가기
              </Button>
            </CardBody>
          </Card>
        </Section>

        <Section title="목적별로 둘러보기">
          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.title}
                type="button"
                onClick={() =>
                  navigate(
                    `/official-tutorials?category=${encodeURIComponent(
                      category.filterValue,
                    )}`,
                  )
                }
                className="text-left"
              >
                <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardBody className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-500">
                      {category.icon}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-950">
                        {category.title}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {category.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </button>
            ))}
          </div>
        </Section>

        <Section
          title="추천 공식 튜토리얼"
          actionLabel="전체 보기"
          onActionClick={() => navigate('/official-tutorials')}
        >
          <div className="grid gap-5 md:grid-cols-3">
            {tutorials.map((tutorial) => (
              <Card
                key={tutorial.id}
                className="transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader>
                  <ThumbnailBox
                    variant="tutorial"
                    label="튜토리얼 썸네일"
                  />
                </CardHeader>

                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-950">
                      {tutorial.title}
                    </h3>

                    <Badge variant={tutorial.levelVariant}>
                      {tutorial.level}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {tutorial.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tutorial.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </CardBody>

                <CardFooter>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Bookmark size={14} />
                      {tutorial.bookmarks}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {tutorial.minutes}분
                    </span>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      navigate(`/official-tutorials/${tutorial.id}`)
                    }
                  >
                    시작하기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="인기 공개 워크플로우"
          actionLabel="라이브러리"
          onActionClick={() => navigate('/public-library')}
        >
          <div className="grid gap-5 md:grid-cols-3">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                        {workflow.author.slice(0, 1)}
                      </div>

                      <span className="text-sm font-semibold text-slate-500">
                        {workflow.author}
                      </span>
                    </div>

                    <Badge variant="blue">커뮤니티</Badge>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-950">
                      {workflow.title}
                    </h3>

                    <Badge variant={workflow.levelVariant}>
                      {workflow.level}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {workflow.description}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/public-library/${workflow.id}`)
                    }
                    className="mt-5 text-sm font-bold text-indigo-500"
                  >
                    {workflow.category}
                  </button>
                </CardBody>

                <CardFooter>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Bookmark size={14} />
                      {workflow.saves}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Copy size={14} />
                      복사 {workflow.copies}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <MessageCircle size={14} />
                      {workflow.comments}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    rightIcon={<ArrowRight size={15} />}
                    onClick={() =>
                      navigate(`/public-library/${workflow.id}`)
                    }
                  >
                    복사해서 시작
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="최근 저장한 항목"
          actionLabel="내 저장소"
          onActionClick={() => navigate('/my-storage')}
        >
          <div className="grid gap-5 md:grid-cols-2">
            {savedItems.map((item) => (
              <Card key={item.title}>
                <CardBody className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <ThumbnailBox
                    variant="compact"
                    label="썸네일"
                    className="h-24 w-full sm:w-24"
                  />

                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {item.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant={badge === '입문' ? 'green' : 'blue'}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="font-bold text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {item.meta}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    rightIcon={<ArrowRight size={15} />}
                    onClick={() => navigate(item.path)}
                  >
                    {item.action}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </Section>

        <Card>
          <CardBody className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-2xl font-black text-white">
                ?
              </div>

              <div>
                <h3 className="font-bold text-slate-950">
                  처음이신가요? 3분 안내 가이드
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  블록이 무엇인지, 흐름을 어떻게 만드는지 빠르게
                  살펴보세요.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/official-tutorials/1')}
            >
              안내 가이드 보기
            </Button>
          </CardBody>
        </Card>
      </PageContainer>

      <Footer />
    </div>
  )
}