import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { PageContainer } from '../../components/layout/PageContainer'
import {
  tutorialCategories,
  tutorialLevels,
  tutorials,
  type TutorialCategory,
  type TutorialLevel,
} from '../../features/tutorial/data/tutorials'
import { TutorialCard } from '../../features/tutorial/components/TutorialCard'

const MAX_LEVEL_FILTER_COUNT = 2
const MAX_CATEGORY_FILTER_COUNT = 3
const ITEMS_PER_PAGE = 6
const AUTO_SLIDE_INTERVAL_MS = 5000

const levelButtonClassMap: Record<TutorialLevel, string> = {
  입문: 'border-emerald-500 bg-emerald-50 text-emerald-600',
  기초: 'border-blue-500 bg-blue-50 text-blue-600',
  응용: 'border-rose-500 bg-rose-50 text-rose-600',
}

const selectedCategoryButtonClassName =
  'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm'

interface FilterButtonProps {
  label: string
  isSelected: boolean
  onClick: () => void
  selectedClassName?: string
}

function FilterButton({
  label,
  isSelected,
  onClick,
  selectedClassName,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-lg border px-3 py-1.5 text-sm font-black transition',
        isSelected
          ? selectedClassName ||
            'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm'
          : 'border-slate-700 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-500',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export function OfficialTutorialPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [selectedLevels, setSelectedLevels] = useState<TutorialLevel[]>([])
  const [selectedCategories, setSelectedCategories] = useState<
    TutorialCategory[]
  >([])
  const [currentPage, setCurrentPage] = useState(0)

  const normalizedKeyword = keyword.trim()

  const filteredTutorials = useMemo(() => {
    const loweredKeyword = normalizedKeyword.toLowerCase()

    return tutorials.filter((tutorial) => {
      const matchesKeyword =
        loweredKeyword.length === 0 ||
        tutorial.title.toLowerCase().includes(loweredKeyword) ||
        tutorial.description.toLowerCase().includes(loweredKeyword) ||
        tutorial.categories.some((category) =>
          category.toLowerCase().includes(loweredKeyword),
        )

      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(tutorial.level)

      const matchesCategory =
        selectedCategories.length === 0 ||
        tutorial.categories.some((category) =>
          selectedCategories.includes(category),
        )

      return matchesKeyword && matchesLevel && matchesCategory
    })
  }, [normalizedKeyword, selectedCategories, selectedLevels])

  const tutorialPages = useMemo(() => {
    const pages = []

    for (
      let index = 0;
      index < filteredTutorials.length;
      index += ITEMS_PER_PAGE
    ) {
      pages.push(filteredTutorials.slice(index, index + ITEMS_PER_PAGE))
    }

    return pages
  }, [filteredTutorials])

  const totalPages = tutorialPages.length
  const canGoPrev = totalPages > 1 && currentPage > 0
  const canGoNext = totalPages > 1 && currentPage < totalPages - 1

  const hasSearchCondition =
    normalizedKeyword.length > 0 ||
    selectedLevels.length > 0 ||
    selectedCategories.length > 0

  const resultTitle =
    normalizedKeyword.length > 0
      ? `“${normalizedKeyword}” 에 대한 검색결과`
      : '선택한 조건에 대한 검색결과'

  useEffect(() => {
    setCurrentPage(0)
  }, [keyword, selectedLevels, selectedCategories])

  useEffect(() => {
    if (currentPage <= totalPages - 1) {
      return
    }

    setCurrentPage(0)
  }, [currentPage, totalPages])

  useEffect(() => {
    if (totalPages <= 1) {
      return
    }

    const timerId = window.setInterval(() => {
      setCurrentPage((prev) => (prev + 1 >= totalPages ? 0 : prev + 1))
    }, AUTO_SLIDE_INTERVAL_MS)

    return () => {
      window.clearInterval(timerId)
    }
  }, [totalPages])

  const toggleLevel = (level: TutorialLevel) => {
    setSelectedLevels((prev) => {
      if (prev.includes(level)) {
        return prev.filter((item) => item !== level)
      }

      if (prev.length >= MAX_LEVEL_FILTER_COUNT) {
        return prev
      }

      return [...prev, level]
    })
  }

  const toggleCategory = (category: TutorialCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category)
      }

      if (prev.length >= MAX_CATEGORY_FILTER_COUNT) {
        return prev
      }

      return [...prev, category]
    })
  }

  const resetFilters = () => {
    setKeyword('')
    setSelectedLevels([])
    setSelectedCategories([])
    setCurrentPage(0)
  }

  const goPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  const goNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <PageContainer className="py-16">
        <section className="space-y-12">
          <div>
            <p className="text-sm font-bold text-slate-400">공식 튜토리얼</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              단계별로 AI 활용 흐름 배우기
            </h1>
          </div>

          <div className="w-full max-w-3xl rounded-lg border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <label className="relative block">
              <Search
                className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400"
                size={24}
              />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="튜토리얼 검색"
                className="h-10 w-full bg-transparent pl-9 pr-4 text-base font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>

            <div className="mt-5 border-t border-dashed border-slate-300 pt-7">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mr-1 text-sm font-black text-slate-700">
                    난이도{' '}
                    <span className="text-indigo-500">
                      {selectedLevels.length}/{MAX_LEVEL_FILTER_COUNT}
                    </span>
                  </span>

                  {tutorialLevels.map((level) => (
                    <FilterButton
                      key={level}
                      label={level}
                      isSelected={selectedLevels.includes(level)}
                      selectedClassName={levelButtonClassMap[level]}
                      onClick={() => toggleLevel(level)}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="mr-1 text-sm font-black text-slate-700">
                    카테고리{' '}
                    <span className="text-indigo-500">
                      {selectedCategories.length}/{MAX_CATEGORY_FILTER_COUNT}
                    </span>
                  </span>

                  {tutorialCategories.map((category) => (
                    <FilterButton
                      key={category}
                      label={category}
                      isSelected={selectedCategories.includes(category)}
                      selectedClassName={selectedCategoryButtonClassName}
                      onClick={() => toggleCategory(category)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {hasSearchCondition && (
            <h2 className="text-4xl font-black tracking-tight text-slate-700">
              {resultTitle}
            </h2>
          )}

          <div className="relative">
            {filteredTutorials.length > 0 ? (
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentPage * 100}%)`,
                  }}
                >
                  {tutorialPages.map((pageTutorials, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="w-full shrink-0"
                      aria-hidden={currentPage !== pageIndex}
                    >
                      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {pageTutorials.map((tutorial) => (
                          <TutorialCard
                            key={tutorial.id}
                            tutorial={tutorial}
                            onStart={(tutorialId) =>
                              navigate(`/official-tutorials/${tutorialId}`)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                <p className="text-xl font-black text-slate-700">
                  조건에 맞는 튜토리얼이 없습니다.
                </p>
                <p className="mt-2 text-sm font-medium text-slate-400">
                  검색어 또는 필터를 조정해 다시 찾아보세요.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  필터 초기화
                </button>
              </div>
            )}

            {canGoPrev && (
              <button
                type="button"
                aria-label="이전 튜토리얼 페이지"
                onClick={goPrevPage}
                className="absolute -left-12 top-1/2 hidden -translate-y-1/2 text-indigo-500 transition hover:-translate-x-1 xl:block"
              >
                <ArrowLeft size={42} strokeWidth={3} />
              </button>
            )}

            {canGoNext && (
              <button
                type="button"
                aria-label="다음 튜토리얼 페이지"
                onClick={goNextPage}
                className="absolute -right-12 top-1/2 hidden -translate-y-1/2 text-indigo-500 transition hover:translate-x-1 xl:block"
              >
                <ArrowRight size={42} strokeWidth={3} />
              </button>
            )}
          </div>

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