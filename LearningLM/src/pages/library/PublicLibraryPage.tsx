import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Search,
} from 'lucide-react'

import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { PageContainer } from '../../components/layout/PageContainer'

import { LibraryCard } from '../../feature/library/component/LibraryCard'

import {
  libraryCategories,
  libraryItems,
  libraryLevels,
} from '../../feature/library/data/libraryData'

import type {
  LibraryCategory,
  LibraryLevel,
} from '../../feature/library/data/libraryData'

const MAX_LEVEL_FILTER_COUNT = 2
const MAX_CATEGORY_FILTER_COUNT = 3
const ITEMS_PER_PAGE = 6
const AUTO_SLIDE_INTERVAL_MS = 5000

const levelButtonClassMap: Record<
  LibraryLevel,
  string
> = {
  입문:
    'border-emerald-500 bg-emerald-50 text-emerald-600',
  기초:
    'border-blue-500 bg-blue-50 text-blue-600',
  응용:
    'border-rose-500 bg-rose-50 text-rose-600',
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
            selectedCategoryButtonClassName
          : 'border-slate-700 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-500',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export function PublicLibraryPage() {
  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] =
    useState('')

  const [selectedLevels, setSelectedLevels] =
    useState<LibraryLevel[]>([])

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<LibraryCategory[]>([])

  const [currentPage, setCurrentPage] = useState(0)

  const handleLevelClick = (
    level: LibraryLevel,
  ) => {
    setSelectedLevels((previousLevels) => {
      if (previousLevels.includes(level)) {
        return previousLevels.filter(
          (item) => item !== level,
        )
      }

      if (
        previousLevels.length >=
        MAX_LEVEL_FILTER_COUNT
      ) {
        return previousLevels
      }

      return [...previousLevels, level]
    })
  }

  const handleCategoryClick = (
    category: LibraryCategory,
  ) => {
    setSelectedCategories(
      (previousCategories) => {
        if (
          previousCategories.includes(category)
        ) {
          return previousCategories.filter(
            (item) => item !== category,
          )
        }

        if (
          previousCategories.length >=
          MAX_CATEGORY_FILTER_COUNT
        ) {
          return previousCategories
        }

        return [
          ...previousCategories,
          category,
        ]
      },
    )
  }

  const filteredLibraryItems = useMemo(() => {
    const normalizedKeyword = searchKeyword
      .trim()
      .toLowerCase()

    return libraryItems.filter((item) => {
      const matchesSearch =
        normalizedKeyword === '' ||
        item.title
          .toLowerCase()
          .includes(normalizedKeyword) ||
        item.description
          .toLowerCase()
          .includes(normalizedKeyword) ||
        item.authorName
          .toLowerCase()
          .includes(normalizedKeyword)

      const matchesLevel =
        selectedLevels.length === 0 ||
        selectedLevels.includes(item.level)

      const matchesCategory =
        selectedCategories.length === 0 ||
        item.categories.some((category) =>
          selectedCategories.includes(category),
        )

      return (
        matchesSearch &&
        matchesLevel &&
        matchesCategory
      )
    })
  }, [
    searchKeyword,
    selectedLevels,
    selectedCategories,
  ])

  const totalPages = Math.ceil(
    filteredLibraryItems.length /
      ITEMS_PER_PAGE,
  )

  const startIndex =
    currentPage * ITEMS_PER_PAGE

  const endIndex =
    startIndex + ITEMS_PER_PAGE

  const visibleLibraryItems =
    filteredLibraryItems.slice(
      startIndex,
      endIndex,
    )

  useEffect(() => {
    setCurrentPage(0)
  }, [
    searchKeyword,
    selectedLevels,
    selectedCategories,
  ])

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(0)
      return
    }

    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    if (totalPages <= 1) {
      return
    }

    const intervalId = window.setInterval(
      () => {
        setCurrentPage((previousPage) =>
          previousPage >= totalPages - 1
            ? 0
            : previousPage + 1,
        )
      },
      AUTO_SLIDE_INTERVAL_MS,
    )

    return () => {
      window.clearInterval(intervalId)
    }
  }, [totalPages])

  const handleLibraryClick = (
    libraryId: number,
  ) => {
    navigate(`/public-library/${libraryId}`)
  }

  const handlePreviousPage = () => {
    setCurrentPage((previousPage) => {
      if (totalPages <= 1) {
        return 0
      }

      return previousPage === 0
        ? totalPages - 1
        : previousPage - 1
    })
  }

  const handleNextPage = () => {
    setCurrentPage((previousPage) => {
      if (totalPages <= 1) {
        return 0
      }

      return previousPage >= totalPages - 1
        ? 0
        : previousPage + 1
    })
  }

  const handleResetFilters = () => {
    setSearchKeyword('')
    setSelectedLevels([])
    setSelectedCategories([])
  }

  const hasActiveFilter =
    searchKeyword.length > 0 ||
    selectedLevels.length > 0 ||
    selectedCategories.length > 0

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <PageContainer className="py-14">
        <section>
          <div>
            <p className="text-sm font-bold text-slate-400">
              공개 라이브러리
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              다른 사람의 워크플로우를 복사해
              시작하기
            </h1>
          </div>

          <div className="mt-10 max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-dashed border-slate-300 pb-4">
              <Search
                size={17}
                className="shrink-0 text-slate-400"
              />

              <input
                type="text"
                value={searchKeyword}
                onChange={(event) =>
                  setSearchKeyword(
                    event.target.value,
                  )
                }
                placeholder="워크플로우 검색"
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm font-black text-slate-700">
                난이도
              </span>

              {libraryLevels.map((level) => (
                <FilterButton
                  key={level}
                  label={level}
                  isSelected={selectedLevels.includes(
                    level,
                  )}
                  onClick={() =>
                    handleLevelClick(level)
                  }
                  selectedClassName={
                    levelButtonClassMap[level]
                  }
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm font-black text-slate-700">
                카테고리
              </span>

              {libraryCategories.map(
                (category) => (
                  <FilterButton
                    key={category}
                    label={category}
                    isSelected={selectedCategories.includes(
                      category,
                    )}
                    onClick={() =>
                      handleCategoryClick(
                        category,
                      )
                    }
                    selectedClassName={
                      selectedCategoryButtonClassName
                    }
                  />
                ),
              )}
            </div>

            {hasActiveFilter && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-sm font-black text-slate-400 transition hover:text-indigo-500"
                >
                  검색 조건 초기화
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500">
              총{' '}
              <span className="text-indigo-600">
                {filteredLibraryItems.length}
              </span>
              개의 워크플로우
            </p>
          </div>

          <div className="relative mt-6">
            {visibleLibraryItems.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleLibraryItems.map(
                  (item) => (
                    <LibraryCard
                      key={item.id}
                      item={item}
                      onClick={
                        handleLibraryClick
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                <p className="text-lg font-black text-slate-700">
                  검색 결과가 없습니다.
                </p>

                <p className="mt-2 text-sm font-medium text-slate-400">
                  검색어나 선택한 필터를
                  변경해보세요.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <>
                <button
                  type="button"
                  aria-label="이전 페이지"
                  onClick={handlePreviousPage}
                  className="absolute -left-14 top-1/2 hidden -translate-y-1/2 text-indigo-500 transition hover:-translate-x-1 xl:block"
                >
                  <ArrowLeft
                    size={40}
                    strokeWidth={3}
                  />
                </button>

                <button
                  type="button"
                  aria-label="다음 페이지"
                  onClick={handleNextPage}
                  className="absolute -right-14 top-1/2 hidden -translate-y-1/2 text-indigo-500 transition hover:translate-x-1 xl:block"
                >
                  <ArrowRight
                    size={40}
                    strokeWidth={3}
                  />
                </button>
              </>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-3">
              {Array.from({
                length: totalPages,
              }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  type="button"
                  aria-label={`${pageIndex + 1}페이지`}
                  onClick={() =>
                    setCurrentPage(pageIndex)
                  }
                  className={[
                    'h-3 w-3 rounded-full border-2 border-indigo-500 transition',
                    currentPage === pageIndex
                      ? 'bg-indigo-500'
                      : 'bg-white',
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