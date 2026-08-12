import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import searchRound from "../assets/searchRound.svg"
import searchStick from "../assets/searchStick.svg";
// ReactFlow은 현재 사용하지 않습니다.
// npx shadcn@latest add slider 설치
import { Slider } from "../components/ui/Slider";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from 'react'

import {
  MarkerType,
  ReactFlow,
  type Edge,
} from '@xyflow/react'

import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { Header } from '../components/layout/Header'
import searchRound from '../assets/searchRound.svg'
import searchStick from '../assets/searchStick.svg'
import dashed from '../assets/dashed.png'

import {
  StudioBlockInspector,
  type StudioInspectorConnectionInfo,
} from '../features/studio/components/inspector/StudioBlockInspector'

export function Stdio_create1() {
  const [value, setValue] = useState(0.7);
  const [openId, setOpenId] = useState<number | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Studio1에서 navigate의 state로 전달한 실제 flowId
  const flowId: number | null =
    location.state?.flowId ??
    location.state?.workflowId ??
    null;

  console.log("현재 Studio flowId:", flowId);

  // TODO: 실제 노드 상태 연결 필요
  const nodes: any[] = [];

    const toggleItem = (id: number) => {
        setOpenId((prev) => (prev === id ? null : id));
    }

  const handleStartSave = async () => {
  const accessToken =
    localStorage.getItem("accessToken") ?? undefined;

  if (!flowId) {
    console.error("flowId가 없습니다.");
    return;
  }

  const saveData: FlowUpdateRequest = {
    title: "제품 리뷰 요약기",
    summary: "리뷰 더미에서 장단점을 추출",
    purpose: "여러 리뷰를 비교해 핵심만 정리",
    difficulty: "BASIC",
    categoryIds: [1],
    visibility: "PRIVATE",
    status: "COMPLETED",
    authorNote: "검색 블록 기간을 좁히면 정확도가 올라갑니다.",
    exampleInput: "리뷰 100건을 항목별로 정리해줘",
    exampleResult: "비교 표 예시",
    blocks: [
      {
        blockId: 3,
        blockOrder: 1,
        options: {},
        promptTemplateId: 5,
      },
    ],
  };

  try {
    console.log("저장할 flowId:", flowId);
    console.log("저장할 데이터:", saveData);

export function Stdio_create1() {
  const navigate = useNavigate()
  const location = useLocation()
  const { workflowId } = useParams()

  const locationState =
    (location.state as StudioNavigationState | null) ?? null

  const [searchText, setSearchText] = useState('')
  const [openValidationId, setOpenValidationId] =
    useState<number | null>(null)
  const [validationResult, setValidationResult] =
    useState<StudioWorkflowValidationResult | null>(
      locationState?.validationResult ?? null,
    )

    console.log("Flow 저장 성공:", response);
    console.log("저장된 flowId:", response.result.flowId);
    console.log("저장 상태:", response.result.status);

  } catch (error) {
    console.error("Flow 저장 실패:", error);
  }
};

    const selectedNodeConnectionInfo =
  useMemo<StudioInspectorConnectionInfo>(
    () => {
      if (!selectedNode) {
        return {
          incomingNodes: [],
          outgoingNodes: [],
        }
      }

      const incomingNodeIds =
        new Set(
          studio.edges
            .filter(
              (edge) =>
                edge.target ===
                selectedNode.id,
            )
            .map(
              (edge) =>
                edge.source,
            ),
        )

      const outgoingNodeIds =
        new Set(
          studio.edges
            .filter(
              (edge) =>
                edge.source ===
                selectedNode.id,
            )
            .map(
              (edge) =>
                edge.target,
            ),
        )

      const toConnectedNode = (
        node: StudioFlowNodeInstance,
      ) => ({
        id:
          node.id,

        title:
          node.data.node.title,

        stage:
          node.data.node.stage,

        slots:
          node.data.node.slots,
      })

      return {
        incomingNodes:
          studio.nodes
            .filter(
              (node) =>
                incomingNodeIds.has(
                  node.id,
                ),
            )
            .map(
              toConnectedNode,
            ),

        outgoingNodes:
          studio.nodes
            .filter(
              (node) =>
                outgoingNodeIds.has(
                  node.id,
                ),
            )
            .map(
              toConnectedNode,
            ),
      }
    },
    [
      selectedNode,
      studio.edges,
      studio.nodes,
    ],
  )

  const filteredBlocks = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

  const accessToken = localStorage.getItem("accessToken");

    return studioBlockCatalog.filter(
      (block) =>
        block.title.toLowerCase().includes(keyword) ||
        block.description.toLowerCase().includes(keyword),
    )
  }, [searchText])

    const workflowStructureSignature =
  useMemo(() => {
    const nodeSignature =
      studio.nodes
        .map((node) => {
          const slots =
            node.data.node.slots
              .map((slot) =>
                [
                  slot.id,
                  slot.value ??
                    '',
                  slot.state ??
                    '',
                  slot.required
                    ? '1'
                    : '0',
                  JSON.stringify(
                    slot.config ??
                      {},
                  ),
                ].join(':'),
              )
              .sort()
              .join(',')

          return [
            node.id,
            node.data.node.stage,
            slots,
          ].join('|')
        })
        .sort()
        .join('||')

    const edgeSignature =
      studio.edges
        .map(
          (edge) =>
            [
              edge.source,
              edge.target,
              edge.sourceHandle ??
                '',
              edge.targetHandle ??
                '',
            ].join('>'),
        )
        .sort()
        .join('||')

    return [
      nodeSignature,
      edgeSignature,
    ].join('###')
  }, [
    studio.nodes,
    studio.edges,
  ])

  useEffect(() => {
    setValidationResult(null)
  }, [workflowStructureSignature])

  const validationChecks = useMemo<ValidationCheck[]>(() => {
    if (!validationResult) {
      return [
        {
          id: 1,
          title: '입력 노드 CORE 블록',
          status: 'pending',
          criterion:
            '입력 단계의 필수 블록이 모두 포함되어야 합니다.',
          result: '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: 2,
          title: '프로세스 노드 CORE 블록',
          status: 'pending',
          criterion:
            '프로세스 단계의 필수 블록이 모두 포함되어야 합니다.',
          result: '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: 3,
          title: '결과 노드 CORE 블록',
          status: 'pending',
          criterion:
            '결과 단계의 필수 블록이 모두 포함되어야 합니다.',
          result: '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: 4,
          title: '필수 슬롯 채움',
          status: 'pending',
          criterion:
            '각 노드의 required slot 설정이 모두 완료되어야 합니다.',
          result: '아직 검증을 실행하지 않았습니다.',
        },
        {
          id: 5,
          title: '저장 조건',
          status: 'pending',
          criterion:
            '필수 블록과 필수 슬롯 검증을 통과해야 합니다.',
          result: '검증을 실행하면 저장 가능 여부가 표시됩니다.',
        },
        resolvedContext: {},
      })),
    };

    console.log("검증 요청 flowId:", flowId);
    console.log("검증 요청 body:", verifyPayload);

    const response = await verifyFlow(
      Number(flowId),
      verifyPayload,
      accessToken ?? ""
    );

    console.log("검증 성공:", response);
    console.log("전체 검증 상태:", response.result.totalStatus);
    console.log("검증 결과:", response.result.results);

    return [
      {
        id: 1,
        title: '입력 노드 CORE 블록',
        status: inputIssues.length === 0 ? 'pass' : 'fail',
        criterion:
          '입력 단계의 필수 블록이 모두 포함되어야 합니다.',
        result: buildStageResult(inputIssues),
      },
      {
        id: 2,
        title: '프로세스 노드 CORE 블록',
        status: processIssues.length === 0 ? 'pass' : 'fail',
        criterion:
          '프로세스 단계의 필수 블록이 모두 포함되어야 합니다.',
        result: buildStageResult(processIssues),
      },
      {
        id: 3,
        title: '결과 노드 CORE 블록',
        status: outputIssues.length === 0 ? 'pass' : 'fail',
        criterion:
          '결과 단계의 필수 블록이 모두 포함되어야 합니다.',
        result: buildStageResult(outputIssues),
      },
      {
        id: 4,
        title: '필수 슬롯 채움',
        status: slotIssues.length === 0 ? 'pass' : 'warning',
        criterion:
          '각 노드의 required slot 설정이 모두 완료되어야 합니다.',
        result:
          slotIssues.length === 0
            ? '필수 슬롯 설정이 모두 완료되었습니다.'
            : slotIssues.map((issue) => issue.message).join(' '),
      },
      {
        id: 5,
        title: '저장 조건',
        status: validationResult.valid ? 'pass' : 'pending',
        criterion:
          '필수 블록과 필수 슬롯 검증을 통과해야 합니다.',
        result: validationResult.valid
          ? '저장 조건을 충족했습니다.'
          : `오류 ${validationResult.errorCount}개가 남아 있어 저장할 수 없습니다.${slotErrorIssues.length > 0
            ? ' 필수 슬롯 설정을 확인하세요.'
            : ''
          }`,
      },
    ]
  }, [validationResult])

  const validationSummary = useMemo(() => {
    const passCount = validationChecks.filter(
      (check) => check.status === 'pass',
    ).length

    const insufficientCount = validationChecks.filter(
      (check) =>
        check.status === 'warning' ||
        check.status === 'fail',
    ).length

    const pendingCount = validationChecks.filter(
      (check) => check.status === 'pending',
    ).length

    return {
      passCount,
      insufficientCount,
      pendingCount,
    }
  }, [validationChecks])

  const overallValidationStatus: ValidationCheckStatus =
    !validationResult
      ? 'pending'
      : validationResult.valid
        ? 'pass'
        : 'fail'

  const selectedRequiredSlots =
    selectedNode?.data.node.slots.filter(
      (slot) => slot.required,
    ) ?? []

  const selectedCompletedRequiredSlots =
    selectedRequiredSlots.filter(hasSlotValue).length

  const handleValidate = () => {
    const result = validateStudioWorkflow({
      nodes: studio.nodes,
      includeRecommended: true,
    })

    studio.validateWorkflow()
    setValidationResult(result)
  }
};


const handleReviewSave = async () => {
  if (!flowId) {
    console.error("flowId가 없습니다.");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");

  try {
    const previewPayload: PreviewFlowRequest = {
      blocks: nodes.map((node, index) => ({
        blockId: Number(node.data.blockId),
        blockOrder: index,
        input: {},
        options: {
          ...node.data,
        },
        resolvedContext: {},
      })),
    };

    console.log("미리보기 요청 flowId:", flowId);
    console.log("미리보기 요청 body:", previewPayload);

    const response = await previewFlow(
      Number(flowId),
      previewPayload,
      accessToken ?? ""
    );

    console.log("미리보기 생성 성공:", response);
    console.log("예시 결과:", response.result.resultText);
    console.log("결과 출처:", response.result.resultSource);
    console.log("사용 모델:", response.result.modelName);

        navigate("/studio/preview", {
            state: {
                flowId: Number(flowId),
                resultText: response.result.resultText,
                resultSource: response.result.resultSource,
                modelName: response.result.modelName,
            },
        });

  } catch (error) {
    console.error("미리보기 생성 실패:", error);
  }
};


    return (
        <>
            <Header />

            <div className=" flex min-h-screen text-[#27272A]">

                {/* w-[1920px] min-h-[2528px] */}

                {/*블록 팔레트 */}
                <div className="relative z-30 w-[360px] min-h-[2350px] bg-white flex flex-col border-r-[1.5px] border-slate-200 items-center">

                    {/*블록 팔레트 텍스트 section */}
                    <div className="h-[136px] flex items-center justify-center gap-[16.2px] border-b-[1.5px] border-slate-200">
                        <p className="text-[25.5px] font-bold">
                            블록 팔레트
                        </p>

                        <div className="flex items-center justify-center py-[12.6px] px-[14.25px] rounded-[8px] border-dashed border-[1.5px] border-slate-200 w-[176px] text-[16.5px] text-[#9A9AA3]">
                            📱모바일 미지원 -
                            <br />
                            블록 스튜디오는
                            <br />
                            데스크톱 전용
                        </div>
                    </div>

                    {/*블록 팔레트 텍스트 하단 section */}
                    <div className="w-full flex flex-col items-center">

                        {/*블록 검색 */}
                        <div className="pl-[24px] mt-[16.5px] flex items-center w-[321px] h-[52.5px] border-[1.5px] border-[#E4E4E7] rounded-[50px]
                        text-[21px] text-[#9A9AA3]">
                            <div>
                                <img
                                    src={searchRound}
                                    className="mr-[10px] mt-[6px] w-[21px] h-[21px]"
                                />
                                <img
                                    src={searchStick}
                                    className="ml-[18px] mt-[-5px] w-[8.4px] h-[8.4px]"
                                />
                            </div>

                            블록 검색
                        </div>

                        {/*입력 section */}
                        <div className="flex flex-col justify-center">
                            <div className="w-[316px] flex items-center mt-[31.2px] mb-[15.5px]">
                                <div className="w-[13.5px] h-[13.5px] bg-[#4A5E8A] rounded-[4px]" />
                                <p className="ml-[10.5px] flex-1 text-[16.5px] text-[#9A9AA3] font-bold">
                                    입력
                                </p>
                                <p className="text-[16.5px] text-[#9A9AA3] font-bold">
                                    INPUT
                                </p>
                            </div>

                            {inPut.map((box) => (
                                <div
                                    key={box.id}
                                    className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200"
                                >
                                    <div className="flex items-center">
                                        <div className="w-[13.5px] h-[13.5px] bg-[#4A5E8A] rounded-[4px]" />

                                        <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                            {box.title}
                                        </p>

                                        <p className="text-[14.25px] text-[#6366F1] font-bold">
                                            {box.state}
                                        </p>
                                    </div>

                                    <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                        {box.content}
                                    </p>
                                </div>
                            ))}

                            <div className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200">
                                <div className="flex items-center">
                                    <div className="w-[13.5px] h-[13.5px] bg-[#4A5E8A] rounded-[4px]" />

                                    <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                        파일 업로드 받기
                                    </p>

                                    <div>
                                        <p className="w-[43.21px] h-[24.38px] bg-[#EEF4EE] rounded-[8px] font-bold text-[14.25px] text-[#3C7A52] text-center">
                                            권장
                                        </p>
                                    </div>
                                </div>

                                <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                    문서·이미지를 업로드합니다
                                </p>
                            </div>
                        </div>

                        {/*컨텍스트 section */}
                        <div className="flex flex-col justify-center">
                            <div className="w-[316px] flex items-center mt-[32.7px] mb-[15.5px]">
                                <div className="w-[13.5px] h-[13.5px] bg-[#2F8190] rounded-[4px]" />

                                <p className="ml-[10.5px] flex-1 text-[16.5px] text-[#9A9AA3] font-bold">
                                    컨텍스트
                                </p>

                                <p className="text-[16.5px] text-[#9A9AA3] font-bold">
                                    CONTEXT
                                </p>
                            </div>

                            {conText.map((box) => (
                                <div
                                    key={box.id}
                                    className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200"
                                >
                                    <div className="flex items-center">
                                        <div className="w-[13.5px] h-[13.5px] bg-[#2F8190] rounded-[4px]" />

                                        <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                            {box.title}
                                        </p>

                                        <p className="text-[14.25px] text-[#6366F1] font-bold">
                                            {box.state}
                                        </p>
                                    </div>

                                    <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                        {box.content}
                                    </p>
                                </div>
                            ))}

                            <div className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200">
                                <div className="flex items-center">
                                    <div className="w-[13.5px] h-[13.5px] bg-[#2F8190] rounded-[4px]" />

                                    <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                        제약조건 입력하기
                                    </p>

                                    <div>
                                        <p className="w-[43.21px] h-[24.38px] bg-[#EEF4EE] rounded-[8px] font-bold text-[14.25px] text-[#3C7A52] text-center">
                                            권장
                                        </p>
                                    </div>
                                </div>

                                <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                    분량·톤·금지사항 설정
                                </p>
                            </div>

                            <div className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200">
                                <div className="flex items-center">
                                    <div className="w-[13.5px] h-[13.5px] bg-[#2F8190] rounded-[4px]" />

                                    <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                        용어 사전 제공하기
                                    </p>

                                    <div>
                                        <p className="w-[55.8px] h-[24.38px] bg-[#F0F0F3] rounded-[8px] font-bold text-[14.25px] text-[#9A9AA3] text-center">
                                            준비중
                                        </p>
                                    </div>
                                </div>

                                <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                    고유 용어·약어 정의
                                </p>
                            </div>
                        </div>

                        {/*프로세스 section */}
                        <div className="flex flex-col justify-center">
                            <div className="w-[316px] flex items-center mt-[32.7px] mb-[15.5px]">
                                <div className="w-[13.5px] h-[13.5px] bg-[#6366F1] rounded-[4px]" />

                                <p className="ml-[10.5px] flex-1 text-[16.5px] text-[#9A9AA3] font-bold">
                                    프로세스
                                </p>

                                <p className="text-[16.5px] text-[#9A9AA3] font-bold">
                                    PROCESS
                                </p>
                            </div>

                            {proCess.map((box) => (
                                <div
                                    key={box.id}
                                    className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200"
                                >
                                    <div className="flex items-center">
                                        <div className="w-[13.5px] h-[13.5px] bg-[#6366F1] rounded-[4px]" />

                                        <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                            {box.title}
                                        </p>

                                        <p className="text-[14.25px] text-[#6366F1] font-bold">
                                            {box.state}
                                        </p>
                                    </div>

                                    <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                        {box.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/*검토 section */}
                        <div className="flex flex-col justify-center">
                            <div className="w-[316px] flex items-center mt-[32.7px] mb-[15.5px]">
                                <div className="w-[13.5px] h-[13.5px] bg-[#B07A2E] rounded-[4px]" />

                                <p className="ml-[10.5px] flex-1 text-[16.5px] text-[#9A9AA3] font-bold">
                                    검토
                                </p>

                                <p className="text-[16.5px] text-[#9A9AA3] font-bold">
                                    REVIEW
                                </p>
                            </div>

                            {review.map((box) => (
                                <div
                                    key={box.id}
                                    className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200"
                                >
                                    <div className="flex items-center">
                                        <div className="w-[13.5px] h-[13.5px] bg-[#B07A2E] rounded-[4px]" />

                                        <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                            {box.title}
                                        </p>

                                        <p className="text-[14.25px] text-[#6366F1] font-bold">
                                            {box.state}
                                        </p>
                                    </div>

                                    <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                        {box.content}
                                    </p>
                                </div>
                            ))}

                            <div className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200">
                                <div className="flex items-center">
                                    <div className="w-[13.5px] h-[13.5px] bg-[#B07A2E] rounded-[4px]" />

                                    <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                        누락 확인하기
                                    </p>

                                    <div>
                                        <p className="w-[43.21px] h-[24.38px] bg-[#EEF4EE] rounded-[8px] font-bold text-[14.25px] text-[#3C7A52] text-center">
                                            권장
                                        </p>
                                    </div>
                                </div>

                                <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                    빠진 항목점검합니다
                                </p>
                            </div>
                        </div>

                        {/*결과 section */}
                        <div className="flex flex-col justify-center">
                            <div className="w-[316px] flex items-center mt-[32.7px] mb-[15.5px]">
                                <div className="w-[13.5px] h-[13.5px] bg-[#3C7A52] rounded-[4px]" />

                                <p className="ml-[10.5px] flex-1 text-[16.5px] text-[#9A9AA3] font-bold">
                                    결과
                                </p>

                                <p className="text-[16.5px] text-[#9A9AA3] font-bold">
                                    OUTPUT
                                </p>
                            </div>

                            {result.map((box) => (
                                <div
                                    key={box.id}
                                    className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px] w-[316.5px] h-[82px] rounded-[12px] border-[1.5px] border-slate-200"
                                >
                                    <div className="flex items-center">
                                        <div className="w-[13.5px] h-[13.5px] bg-[#3C7A52] rounded-[4px]" />

                                        <p className="ml-[12px] flex-1 text-[18.75px] font-bold">
                                            {box.title}
                                        </p>

                                        <p className="text-[14.25px] text-[#6366F1] font-bold">
                                            {box.state}
                                        </p>
                                    </div>

                                    <p className="ml-[26px] mt-[2px] text-[16.5px] text-[#9A9AA3]">
                                        {box.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/*메인 화면 */}
                <div className="flex-1 z-10">

                    {/* <ReactFlow nodes={nodes} edges={edges}
                        zoomOnScroll={false}
                        zoomOnPinch={false}
                        zoomOnDoubleClick={false}
                        panOnScroll={false}
                        panOnDrag={true}
                        nodesDraggable={true}
                        className="w-[54px] h-[105px] bg-pink-300 rounded-[12px]"
                    /> */}

                    <div className="flex flex-col mx-[20px] my-[20px] px-[19.5px] pt-[21.45px] w-[375px] h-[274.5px] bg-white border-[1.5px] border-slate-200 rounded-[20px]">
                        <div className="flex items-center">

                            <div className="w-[34.5px] h-[34.5px] bg-[#4A5E8A] rounded-[12px] flex items-center justify-center text-white font-bold text-[18px]">
                                1
                            </div>

                            <div className="flex flex-col flex-1 gap-[6px] ml-[13.5px]">
                                <p className="font-bold text-[20.25px]">
                                    입력
                                </p>

                                <p className="text-[#9A9AA3] text-[13.5px]">
                                    INPUT
                                </p>
                            </div>

                            <div className="w-[74.6px] h-[28.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center text-[#2F7D52] text-[15px] font-bold">
                                필수 2/2
                            </div>
                        </div>

                        <div className="mt-[33.58px] w-[342px] h-[48px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white flex items-center justify-center">
                            <div className="ml-[13.5px] w-[10.5px] h-[10.5px] bg-[#4A5E8A] rounded-[4px]" />

                            <p className="ml-[10.5px] flex-1 font-bold">
                                텍스트 입력
                            </p>

                            <p className="mr-[13.32px] text-[#9A9AA3] text-[16.5px]">
                                리뷰 100건
                            </p>
                        </div>

                        <div className="mt-[9.75px] w-[342px] h-[48px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white flex items-center justify-center">

                            <div className="ml-[13.5px] w-[10.5px] h-[10.5px] bg-[#4A5E8A] rounded-[4px]" />

                            <p className="ml-[10.5px] flex-1 font-bold">
                                필요한 스킬
                            </p>

                            <p className="mr-[13.32px] text-[#9A9AA3] text-[16.5px]">
                                요약
                            </p>
                        </div>

                        <div className="mt-[15px] ml-[-20px] border-dashed w-[372px] border-[1.5px] border-[#E4E4E7]" />

                        <div className="mt-[13.2px] mb-[17.8px] flex items-center justify-between text-[#4A5E8A] text-[16.5px] font-bold">
                            <p>다음 단계로 전달</p>
                            <p>→</p>
                        </div>
                    </div>

                    <div className="flex flex-col mx-[20px] my-[20px] px-[19.5px] pt-[21.45px] w-[375px] h-[274.5px] bg-white border-[1.5px] border-slate-200 rounded-[20px]">

                        <div className="flex items-center">

                            <div className="w-[34.5px] h-[34.5px] bg-[#2F8190] rounded-[12px] flex items-center justify-center text-white font-bold text-[18px]">
                                2
                            </div>

                            <div className="flex flex-col flex-1 gap-[6px] ml-[13.5px]">

                                <p className="font-bold text-[20.25px]">
                                    컨텍스트
                                </p>

                                <p className="text-[#9A9AA3] text-[13.5px]">
                                    CONTEXT
                                </p>
                            </div>

                            <div className="w-[74.6px] h-[28.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center text-[#2F7D52] text-[15px] font-bold">
                                필수 1/1
                            </div>
                        </div>

                        <div className="mt-[33.58px] w-[342px] h-[48px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white flex items-center justify-center">

                            <div className="ml-[13.5px] w-[10.5px] h-[10.5px] bg-[#2F8190] rounded-[4px]" />

                            <p className="ml-[10.5px] flex-1 font-bold">
                                역할 부여
                            </p>

                            <p className="mr-[13.32px] text-[#9A9AA3] text-[16.5px]">
                                리뷰 분석가
                            </p>
                        </div>

                        <div className="mt-[9.75px] w-[342px] h-[48px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white flex items-center justify-center">

                            <div className="ml-[13.5px] w-[10.5px] h-[10.5px] bg-[#2F8190] rounded-[4px]" />

                            <p className="ml-[10.5px] flex-1 font-bold">
                                제약 조건
                            </p>

                            <p className="mr-[13.32px] text-[#9A9AA3] text-[16.5px]">
                                짧게
                            </p>
                        </div>

                        <div className="mt-[15px] ml-[-20px] border-dashed w-[372px] border-[1.5px] border-[#E4E4E7]" />

                        <div className="mt-[13.2px] mb-[17.8px] flex items-center justify-between text-[#2F8190] text-[16.5px] font-bold">
                            <p>다음 단계로 전달</p>
                            <p>→</p>
                        </div>
                    </div>
                </div>

                {/*인스펙터 */}
                <div className="relative z-30 w-[450px] min-h-[2350px] bg-white flex flex-col border-l-[1.5px] border-slate-200">

                    <p className="text-[13px]">
                      {selectedNode.data.node.slots.length}개 · 노드에 부착된 블록
                    </p>
                  </div>

                                    <div className="mt-[14px] flex flex-col gap-[8px]">
                    {selectedNode.data.node.slots.map((slot) => (
                          <StudioBlockInspector
                            key={slot.id}
                            nodeId={selectedNode.id}
                            slot={slot}
                            connectionInfo={
                              selectedNodeConnectionInfo
                            }
                            onConfigChange={(patch, options) => {
                              studio.updateBlockConfig({
                                nodeId: selectedNode.id,
                                slotId: slot.id,
                                patch,
                                summaryValue:
                                  options?.summaryValue,
                                state:
                                  options?.state,
                              })
                            }}
                            onValueChange={(value) => {
                              studio.updateSlotValue({
                                nodeId: selectedNode.id,
                                slotId: slot.id,
                                value,
                              })
                            }}
                          />
                        ))}
                  </div>
                                  </div>

                        {openId === 3 && (
                            <div className="mt-[16px] mb-[24.5px] text-[16px] font-bold pl-[39px]">

                                <p>
                                    채점 기준
                                    <span className="text-[#52525B] font-normal">
                                        · 결과 단계에 필수 블록 1개 이상이
                                        <br />
                                        포함되어야 합니다.
                                    </span>
                                </p>

                                <p className="mt-[13px]">
                                    확인 결과
                                    <span className="text-[#52525B] font-normal">
                                        · "텍스트 출력” 블록이 연결되어
                                        <br />
                                        있습니다.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="min-h-[54px] px-[21px] pt-[14px] border-t-[1.5px] border-[#EEEEF1]">

                        <div className="flex items-center">

                <div className="flex items-center justify-center pb-[14px]">
                  <button
                    type="button"
                    className="flex h-[53px] w-[374px] items-center justify-center rounded-[12px] border-[1.5px] border-[#EEEEF1] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
                  >
                    설정 저장
                  </button>
                </div>
            </div>

            {/* footer */}
            <div className="w-[1920px] h-[94.5px] bg-white pl-[27px] flex items-center justify-between text-[20px] border-t-[1.5px] border-[#E4E4E7]">

                <p className="text-[#9A9AA3] text-[16.5px]">
                    자유 제작 · 노드 5 · 입력→컨텍스트→프로세스→검토→결과
                </p>

                <div className="flex items-center gap-[19px]">

                    <p 
                        onClick={() => {
                            void handleVertifySave()
                        }}
                        className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[86px] h-[57px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[8px] text-[20px] font-bold">
                        검증
                    </p>

                    <p onClick={() => {
                            void handleReviewSave();
                        }}className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[125px] h-[57px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[8px] text-[20px] font-bold">
                        예시 결과
                    </p>

                    <p 
                        onClick={() => {
                            void handleReviewSave();
                        }}
                        className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[119px] h-[57px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[8px] text-[20px] font-bold">
                        미리보기
                    </p>

                    <p
                        onClick={() => {
                            void handleStartSave()
                        }}
                        className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[86px] h-[57px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[8px] text-[20px] font-bold"
                    >
                        저장
                    </p>
                </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 하단 작업 바 */}
      <footer className="flex h-[85px] shrink-0 items-center justify-between border-t-[1.5px] border-[#E4E4E7] bg-white px-[27px] text-[20px]">
        <p className="text-[14px] text-[#9A9AA3]">
          자유 제작 · 노드 {studio.nodes.length} ·
          입력→컨텍스트→프로세스→검토→결과
        </p>

        <div className="flex items-center gap-[19px]">
          <button
            type="button"
            onClick={handleValidate}
            className="cursor-pointer flex h-[50px] w-[80px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
          >
            검증
          </button>

          <button
            type="button"
            onClick={handleOpenExample}
            className="cursor-pointer flex h-[50px] w-[110px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
          >
            예시 결과
          </button>

          <button
            type="button"
            onClick={handleOpenPreview}
            className="cursor-pointer flex h-[50px] w-[110px] items-center justify-center rounded-[8px] border-[1.5px] border-[#E4E4E7] text-[17px] font-bold hover:bg-[#6366F1] hover:text-white"
          >
            미리보기
          </button>

          <button
            type="button"
            disabled={!validationResult?.valid}
            onClick={handleStartSave}
            className={[
              'flex h-[50px] w-[80px] items-center justify-center rounded-[8px] border-[1.5px] text-[17px] font-bold',
              validationResult?.valid
                ? 'cursor-pointer border-[#6366F1] bg-[#6366F1] text-white hover:bg-[#5558DB]'
                : 'cursor-not-allowed border-[#E4E4E7] bg-[#F0F0F3] text-[#9A9AA3]',
            ].join(' ')}
          >
            저장
          </button>
        </div>
      </footer>
    </div>
  )
}