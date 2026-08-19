import {
  ArrowLeft,
} from 'lucide-react'
import {
  useNavigate,
} from 'react-router-dom'

import {
  Footer,
} from '../../components/layout/Footer'
import {
  Header,
} from '../../components/layout/Header'
import {
  PageContainer,
} from '../../components/layout/PageContainer'

type LegalDocumentType =
  | 'terms'
  | 'privacy'

interface LegalPageProps {
  type: LegalDocumentType
}

const legalDocumentMeta:
  Record<
    LegalDocumentType,
    {
      title: string
      description: string
    }
  > = {
    terms: {
      title:
        '이용약관',
      description:
        'LearningLM 서비스 이용약관',
    },
    privacy: {
      title:
        '개인정보처리방침',
      description:
        'LearningLM 개인정보처리방침',
    },
  }

export function LegalPage({
  type,
}: LegalPageProps) {
  const navigate =
    useNavigate()

  const document =
    legalDocumentMeta[
      type
    ]

  return (
    <div className="min-h-screen bg-[#F7F7F9]">
      <Header />

      <PageContainer className="py-[48px]">
        <button
          type="button"
          onClick={() => {
            navigate(
              -1,
            )
          }}
          className="flex items-center gap-[7px] text-[14px] font-bold text-[#6366F1] transition-colors hover:text-[#3A3DC2]"
        >
          <ArrowLeft
            size={16}
          />
          이전 화면
        </button>

        <main className="mx-auto mt-[24px] max-w-[860px] rounded-[16px] border border-[#E4E4E7] bg-white px-[48px] py-[46px]">
          <div className="border-b border-[#E4E4E7] pb-[26px]">
            <p className="text-[13px] font-bold text-[#6366F1]">
              LearningLM
            </p>

            <h1 className="mt-[6px] text-[30px] font-bold tracking-[-0.03em] text-[#27272A]">
              {
                document.title
              }
            </h1>

            <p className="mt-[10px] text-[15px] leading-[24px] text-[#666666]">
              {
                document.description
              }
            </p>
          </div>

          <section className="py-[42px] text-center">
            <h2 className="text-[20px] font-bold text-[#27272A]">
              문서 준비 중
            </h2>

            <p className="mx-auto mt-[12px] max-w-[560px] text-[14px] leading-[23px] text-[#777780]">
              현재 저장소에는 확정된{' '}
              {
                document.title
              }{' '}
              본문이 등록되어 있지 않아,
              서비스 정책 문구를 임의로
              작성하지 않았습니다.
              확정 문서가 전달되면 이
              페이지에 그대로 반영할 수
              있습니다.
            </p>

            <button
              type="button"
              onClick={() => {
                navigate(
                  '/',
                )
              }}
              className="mt-[26px] h-[42px] rounded-[9px] bg-[#6366F1] px-[22px] text-[14px] font-bold text-white transition-colors hover:bg-[#5558DB]"
            >
              홈으로 이동
            </button>
          </section>
        </main>
      </PageContainer>

      <Footer />
    </div>
  )
}