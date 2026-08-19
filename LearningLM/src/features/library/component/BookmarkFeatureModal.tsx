import { Bookmark } from 'lucide-react'

import { Button } from '../../../components/ui/Button'

interface BookmarkFeatureModalProps {
  open: boolean
  onClose: () => void
}

export function BookmarkFeatureModal({
  open,
  onClose,
}: BookmarkFeatureModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#181818]/[0.42] px-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookmark-feature-notice-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
            <Bookmark size={20} />
          </span>
          <h2
            id="bookmark-feature-notice-title"
            className="text-xl font-black text-slate-900"
          >
            북마크 기능 안내
          </h2>
        </div>

        <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
          북마크 기능을 구현 중입니다. 조금만 기다려 주세요.
        </p>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>확인</Button>
        </div>
      </div>
    </div>
  )
}
