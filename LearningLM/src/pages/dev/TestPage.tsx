import {
  Bookmark,
  Clock,
  Copy,
  MessageCircle,
  Sparkles,
  Workflow,
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

export function ComponentShowcasePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <PageContainer className="space-y-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="text-sm font-bold text-slate-400">
                공통 컴포넌트 확인용 페이지
              </p>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950">
                LearningLM UI 조립대
              </h1>
              <p className="mt-4 max-w-xl text-slate-500">
                Button, Card, Badge, ThumbnailBox, Section, Header, Footer가
                정상적으로 보이는지 확인하는 더미 페이지입니다.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button leftIcon={<Sparkles size={17} />}>
                  튜토리얼 시작하기
                </Button>
                <Button variant="secondary">공개 활용 흐름 둘러보기</Button>
                <Button variant="ghost">가이드 보기</Button>
              </div>
            </div>

            <ThumbnailBox
              variant="hero"
              label="히어로 일러스트 / 블록 흐름 이미지"
            />
          </div>
        </section>

        <Section
          title="Button"
          description="CTA, 보조 버튼, 고스트 버튼, 링크형 버튼을 확인합니다."
          actionLabel="전체 보기"
        >
          <Card>
            <CardBody className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link Button</Button>
              <Button disabled>Disabled</Button>
            </CardBody>
          </Card>
        </Section>

        <Section
          title="Badge"
          description="난이도, 유형, 카테고리 표시용 배지입니다."
        >
          <Card>
            <CardBody className="flex flex-wrap gap-3">
              <Badge>기본</Badge>
              <Badge variant="green">입문</Badge>
              <Badge variant="blue">자료조사</Badge>
              <Badge variant="purple">튜토리얼</Badge>
              <Badge variant="pink">응용</Badge>
            </CardBody>
          </Card>
        </Section>

        <Section
          title="Card + ThumbnailBox"
          description="랜딩페이지의 추천 튜토리얼 카드 형태를 미리 봅니다."
          actionLabel="추천 더보기"
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Card>
              <CardHeader>
                <ThumbnailBox variant="tutorial" label="튜토리얼 썸네일" />
              </CardHeader>

              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-950">
                    AI로 자료조사 흐름 만들기
                  </h3>
                  <Badge variant="green">입문</Badge>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  검색, 요약, 정리 블록으로 리서치 흐름을 완성합니다.
                </p>

                <div className="mt-4 flex gap-2">
                  <Badge>자료조사</Badge>
                  <Badge>요약</Badge>
                </div>
              </CardBody>

              <CardFooter>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Bookmark size={14} /> 4
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} /> 15분
                  </span>
                </div>

                <Button size="sm">시작하기</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <ThumbnailBox variant="tutorial" label="튜토리얼 썸네일" />
              </CardHeader>

              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-950">
                    회의록 자동 요약 워크플로우
                  </h3>
                  <Badge variant="blue">기초</Badge>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  긴 회의록을 핵심 항목으로 정리하는 흐름입니다.
                </p>

                <div className="mt-4 flex gap-2">
                  <Badge>문서 요약</Badge>
                </div>
              </CardBody>

              <CardFooter>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Bookmark size={14} /> 5
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} /> 20분
                  </span>
                </div>

                <Button size="sm">시작하기</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <ThumbnailBox variant="tutorial" label="튜토리얼 썸네일" />
              </CardHeader>

              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-950">
                    블로그 초안 작성 흐름
                  </h3>
                  <Badge variant="blue">기초</Badge>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  주제 입력부터 초안 생성까지 이어지는 작성 흐름입니다.
                </p>

                <div className="mt-4 flex gap-2">
                  <Badge>글쓰기</Badge>
                </div>
              </CardBody>

              <CardFooter>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Bookmark size={14} /> 6
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} /> 25분
                  </span>
                </div>

                <Button size="sm">시작하기</Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        <Section
          title="공개 워크플로우 카드 예시"
          description="인기 공개 워크플로우 섹션에서 쓰일 카드의 임시 형태입니다."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                author: '김리서처',
                title: '경쟁사 리서치 정리표',
                category: '자료조사',
                level: '기초',
              },
              {
                author: '이정리',
                title: '제품 리뷰 요약기',
                category: '결과물 검토',
                level: '입문',
              },
              {
                author: '박워크',
                title: '주간 업무 정리 자동화',
                category: '반복 작업 정리',
                level: '응용',
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                        {item.author.slice(0, 1)}
                      </div>
                      <span className="text-sm font-semibold text-slate-500">
                        {item.author}
                      </span>
                    </div>

                    <Badge variant="blue">커뮤니티</Badge>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-950">{item.title}</h3>
                    <Badge variant={item.level === '응용' ? 'pink' : 'green'}>
                      {item.level}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    여러 출처를 표로 정리하는 공개 흐름입니다.
                  </p>

                  <button
                    type="button"
                    className="mt-5 text-sm font-bold text-indigo-500"
                  >
                    {item.category}
                  </button>
                </CardBody>

                <CardFooter>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Bookmark size={14} /> 128
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Copy size={14} /> 64
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle size={14} /> 14
                    </span>
                  </div>

                  <Button variant="link" rightIcon={<Workflow size={15} />}>
                    복사해서 시작
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>
      </PageContainer>

      <Footer />
    </div>
  )
}