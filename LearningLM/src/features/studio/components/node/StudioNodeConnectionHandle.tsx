import {
  Handle,
  Position,
} from '@xyflow/react'

import type {
  StudioStage,
} from '../../types/studioNode'

import {
  studioStageMeta,
} from './studioNodeStyles'

export interface StudioNodeConnectionHandleProps {
  /**
   * Handle 색상을 결정할 Studio 단계입니다.
   */
  stage: StudioStage

  /**
   * 노드에서 Handle이 표시될 방향입니다.
   *
   * left:
   * 다른 노드의 연결을 받는 target Handle
   *
   * right:
   * 다른 노드로 연결하는 source Handle
   */
  position: 'left' | 'right'

  /**
   * 비활성화된 Handle인지 표시합니다.
   */
  disabled?: boolean

  /**
   * 실제 React Flow Handle을 렌더링할지 결정합니다.
   *
   * false:
   * 일반 span을 렌더링합니다.
   * React Flow 외부의 카드 테스트 화면에서 사용합니다.
   *
   * true:
   * React Flow의 실제 Handle을 렌더링합니다.
   */
  interactive?: boolean

  /**
   * React Flow Edge가 참조할 Handle ID입니다.
   *
   * 지정하지 않으면 target 또는 source를 사용합니다.
   */
  handleId?: string

  /**
   * 외부 조건에 따라 연결을 허용하거나 차단합니다.
   */
  isConnectable?: boolean

  /**
   * 추가 스타일입니다.
   */
  className?: string
}

export function StudioNodeConnectionHandle({
  stage,
  position,
  disabled = false,
  interactive = false,
  handleId,
  isConnectable = true,
  className = '',
}: StudioNodeConnectionHandleProps) {
  const stageMeta =
    studioStageMeta[stage]

  const handleType =
    position === 'left'
      ? 'target'
      : 'source'

  const flowPosition =
    position === 'left'
      ? Position.Left
      : Position.Right

  const resolvedHandleId =
    handleId ?? handleType

  const canConnect =
    !disabled && isConnectable

  /**
   * React Flow 밖에서 StudioNodeCard를 직접 렌더링할 때는
   * 실제 Handle 대신 기존과 동일한 시각용 원을 표시합니다.
   */
  if (!interactive) {
    return (
      <span
        className={[
          'pointer-events-none absolute top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full border-[3px]',
          position === 'left'
            ? '-left-3'
            : '-right-3',
          disabled
            ? 'border-slate-300 bg-white'
            : stageMeta.handleClassName,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
    )
  }

  /**
   * React Flow Custom Node 내부에서 사용하는 실제 연결점입니다.
   */
  return (
    <Handle
      id={resolvedHandleId}
      type={handleType}
      position={flowPosition}
      isConnectable={canConnect}
      aria-label={
        handleType === 'target'
          ? `${stageMeta.label} 노드 입력 연결점`
          : `${stageMeta.label} 노드 출력 연결점`
      }
      aria-disabled={!canConnect}
      data-handle-id={resolvedHandleId}
      data-handle-stage={stage}
      data-handle-type={handleType}
      className={[
        'z-10 !h-5 !w-5 !min-h-5 !min-w-5 !rounded-full !border-[3px] !bg-white transition',
        disabled
          ? 'cursor-not-allowed !border-slate-300 opacity-70'
          : [
              'cursor-crosshair',
              stageMeta.stageTextClassName,
              '!border-current',
              'hover:scale-110',
            ].join(' '),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}