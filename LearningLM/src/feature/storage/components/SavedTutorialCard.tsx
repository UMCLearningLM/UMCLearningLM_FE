import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import type { Tutorial } from '../../tutorial/data/tutorials'

interface StorageTutorialCardProps {
  tutorial: Tutorial
  currentStep: number
  totalSteps: number
  onContinue: (tutorialId: number) => void
  onRemove: (tutorialId: number) => void
}

const levelClassMap: Record<Tutorial['level'], string> = {
  입문: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  기초: 'border-blue-200 bg-blue-50 text-blue-600',
  응용: 'border-rose-200 bg-rose-50 text-rose-600',
}

function WireframeThumbnail() {
  return (
    <div className="relative h-28 overflow-hidden border-b border-slate-300 bg-white">
      <div className="absolute left-0 top-0 h-px w-[120%] origin-left rotate-[14deg] border-t border-dashed border-slate-300" />

      <div className="absolute bottom-0 left-0 h-px w-[120%] origin-left -rotate-[14deg] border-t border-dashed border-slate-300" />
    </div>
  )
}

export function SavedTutorialCard({
  tutorial,
  currentStep,
  totalSteps,
  onContinue,
  onRemove,
}: StorageTutorialCardProps) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <WireframeThumbnail />

      <div className="px-5 py-4">
        <h3 className="text-lg font-black text-slate-950">
          {tutorial.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-slate-500">
          {tutorial.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={[
              'rounded-lg border px-2.5 py-1 text-xs font-bold',
              levelClassMap[tutorial.level],
            ].join(' ')}
          >
            {tutorial.level}
          </span>

          {tutorial.categories.slice(0, 2).map((category) => (
            <span
              key={category}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">
            {currentStep}/{totalSteps} 단계
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onContinue(tutorial.id)}
            >
              이어하기
            </Button>

            <Button
              variant="link"
              size="sm"
              onClick={() => onRemove(tutorial.id)}
            >
              저장 해제
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}