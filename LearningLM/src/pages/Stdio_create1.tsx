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
  saveFlow,
  verifyFlow,
  previewFlow,
  type FlowUpdateRequest,
  type PreviewFlowRequest,
} from "../pages/api/StudioApi";


const inPut = [
    { id: 1, title: "텍스트 입력", content: "문서·원문 요청을 입력받습니다", state: "필수" },
    { id: 2, title: "필요한 문서 확인하기", content: "어떤 자료가 필요한지 고릅니다", state: "필수" },
    { id: 3, title: "필요한 스킬 확인하기", content: "요약·분류·작성 등 작업 유형", state: "필수" }
];

const conText = [
    { id: 1, title: "프로젝트 문서 불러오기", content: "저장된 문서를 참고합니다.", state: "필수" },
    { id: 2, title: "역할 부여하기", content: "기획자·리뷰어 등 역할 지정", state: "필수" },
]

const proCess = [
    { id: 1, title: "핵심 내용 추출하기", content: "중요한 내용을 뽑습니다", state: "필수" },
    { id: 2, title: "요약 생성", content: "짧게/자세히 요약합니다", state: "필수" },
    { id: 3, title: "표로 재구성하기", content: "내용을 표 구조로 변환", state: "필수" },
    { id: 3, title: "프롬프트 조립하기", content: "역할·작업·출력을 구성", state: "필수" },
];

const review = [
    { id: 1, title: "품질 검토", content: "출력 형식·기준을 점검합니다", state: "필수" },
    { id: 2, title: "조건 충족 확인하기", content: "지정 조건 만족 여부 확인", state: "필수" },
    { id: 3, title: "오류 위치 표시하기", content: "검증 실패 위치를 표시", state: "필수" },
];

const result = [
    { id: 1, title: "텍스트로 출력하기", content: "일반 답변 형태로 출력", state: "필수" },
    { id: 2, title: "표로 출력하기", content: "표 형식으로 출력", state: "필수" },
    { id: 3, title: "프롬포트로 출력하기", content: "재사용 프롬프트로 출력", state: "필수" },
    { id: 3, title: "내 저장소에 저장하기", content: "결과·흐름을 저장", state: "필수" },
];

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

    const response = await saveFlow(
      Number(flowId),
      saveData,
      accessToken
    );

    console.log("Flow 저장 성공:", response);
    console.log("저장된 flowId:", response.result.flowId);
    console.log("저장 상태:", response.result.status);

  } catch (error) {
    console.error("Flow 저장 실패:", error);
  }
};

// 미리보기 버튼
const handleVertifySave = async () => {
  if (!flowId) {
    console.error("flowId가 없습니다.");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");

  try {
    const verifyPayload = {
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

  } catch (error) {
    console.error("검증 실패:", error);
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

                    <div className="flex items-center pl-[24px] w-full h-[81px] border-b-[1.5px] border-[#E4E4E7] text-[25.5px] font-bold">
                        인스펙터
                    </div>

                    {/* 프로세스 노드 */}
                    <div className="px-[21px] py-[27px] border-b-[1.5px] border-[#E4E4E7]">

                        <div className="flex items-center">
                            <p className="w-[40px] h-[40px] flex items-center justify-center bg-[#6366F1] rounded-[12px] text-white text-[20px] font-bold">
                                3
                            </p>

                            <div className="flex-1 ml-[14px]">
                                <p className="text-[21px] font-bold">
                                    프로세스 노드
                                </p>

                                <p className="text-[#9A9AA3] text-[15px]">
                                    PROCESS · 요약 생성
                                </p>
                            </div>

                            <div className="w-[132px] h-[33px] flex items-center justify-center border-dashed border-[1.5px] border-[#E4E4E7] text-[#52525B] text-[17px] font-bold">
                                AI Optional
                            </div>
                        </div>

                        <div className="mt-[18px] flex items-center gap-[11px] text-[#52525B] text-[15px] font-bold">

                            <div className="w-[78px] h-[30px] bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] flex items-center justify-center rounded-[8px]">
                                필수 2/2
                            </div>

                            <div className="w-[78px] h-[30px] bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] flex items-center justify-center rounded-[8px]">
                                도구 1
                            </div>

                            <div className="w-[78px] h-[30px] bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] flex items-center justify-center rounded-[8px]">
                                도구 2
                            </div>
                        </div>

                        <p className="w-full mt-[14px] text-[#9A9AA3] text-[14px]">
                            이 노드는 컨테이너입니다. 아래 컴포넌트(블록)마다 도구·
                            <br />
                            프롬프트 강도·옵션을 따로 설정하세요.
                            <br />
                        </p>
                    </div>

                    <div className="w-full min-h-[518px] px-[18px] pt-[17px]">

                        <div className="flex items-center justify-between text-[#9A9AA3] font-bold">

                            <p className="text-[16.5px]">
                                컴포넌트
                            </p>

                            <p className="text-[15px]">
                                3개 · 노드에 부착된 블록
                            </p>
                        </div>

                        <div className="mt-[21px] pt-[13px] px-[18px] w-[413px] h-[290px]">

                            <div className="flex items-center">

                                <div className="w-[22.5px] h-[22.5px] bg-[#6366F1] rounded-[8px]" />

                                <p className="flex-1 ml-[12px] text-[18px] font-bold">
                                    핵심 내용 추출
                                </p>

                                <p className="text-[14px] text-[#6366F1] font-bold">
                                    필수
                                </p>

                                <p className="ml-[28px] mt-[-6px] text-[#9A9AA3] text-[18px]">
                                    ⌄
                                </p>
                            </div>

                            <p className="mt-[14px] text-[#52525B] text-[17px] font-bold">
                                추출 강도
                            </p>

                            <div className="flex w-full items-center justify-between w-[280px] mt-[20px] gap-4">

                                <Slider
                                    value={value}
                                    showValue={false}
                                    onChange={setValue}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    className="flex-1"
                                />

                                <p className="text-[#9A9AA3] text-[16.5px]">
                                    {value} · 적극적
                                </p>
                            </div>

                            <div className="mt-[23.5px] text-[#52525B] font-bold">

                                <p className="text-[17px]">
                                    추출 단위
                                </p>

                                <div className="w-[375px] h-[43px] mt-[12.4px] rounded-[8px] flex items-center border-[1.5px] border-[#E4E4E7]">

                                    <p className="w-[65px] h-full text-[17.25px] flex items-center justify-center border-r-[1.5px] border-[#E4E4E7]">
                                        문장
                                    </p>

                                    <p className="w-[65px] h-full text-[#6366F1] text-[17.25px] flex items-center justify-center border-r-[1.5px] border-[#E4E4E7]">
                                        요점
                                    </p>

                                    <p className="w-[65px] h-full ml-[17.2px] text-[17.25px] flex items-center">
                                        주제
                                    </p>
                                </div>
                            </div>

                            <p className="mt-[16px] text-[17px] text-[#52525B] font-bold">
                                필수 도구
                            </p>

                            <div className="mt-[18px] ml-[15px] flex items-center text-[#6366F1] font-bold">

                                <div className="w-[10.5px] h-[10.5px] rounded-[50px] bg-[#6366F1] mr-[8px]" />
                                <p>핵심어 추출</p>

                                <div className="w-[10.5px] h-[10.5px] ml-[38px] rounded-[50px] bg-[#6366F1] mr-[8px]" />
                                <p>문서 파싱</p>
                            </div>
                        </div>

                        <div className="mt-[94px] justify-between px-[18px] py-[15px] flex items-center">

                            <div className="flex items-center">

                                <div className="w-[22.5px] h-[22.5px] mr-[12px] bg-[#6366F1] rounded-[8px]" />

                                <p className="text-[18px] font-bold">
                                    요약 생성
                                </p>
                            </div>

                            <div className="flex items-center">

                                <p className="text-[13.5px] text-[#6366F1] font-bold">
                                    필수
                                </p>

                                <p className="ml-[28px] mt-[-6px] text-[#9A9AA3] text-[18px]">
                                    ⌄
                                </p>
                            </div>
                        </div>

                        <div className="mt-[16.5px] justify-between px-[18px] py-[15px] flex items-center border-[1.5px] border-[#E4E4E7] rounded-[18px]">

                            <div className="flex items-center">

                                <div className="w-[22.5px] h-[22.5px] mr-[12px] border-[1.5px] border-[#D8A978] rounded-[8px]" />

                                <p className="text-[18px] font-bold">
                                    프롬포트 조립
                                </p>
                            </div>

                            <div className="flex items-center">

                                <p className="w-[44px] h-[18px] flex items-center justify-center rounded-[6px] bg-[#F0F0F3] text-[13.5px] text-[#9A9AA3] font-bold">
                                    선택
                                </p>

                                <p className="ml-[28px] mt-[-6px] text-[#9A9AA3] text-[18px]">
                                    ⌄
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="my-[18px] border-[1.5px] border-[#EEEEF1]" />

                    <div className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[413px] h-[57px] ml-[18px] border-[1.5px] border-[#EEEEF1] rounded-[12px] text-[20px] font-bold flex items-center justify-center">
                        설정 저장
                    </div>

                    <div className="flex-4" />

                    <div className="h-[106.5px] w-full">

                        <div className="h-[106px] px-[21px] flex items-center border-t-[1.5px] border-[#E4E4E7]">

                            <div className="w-[69px] h-[69px] bg-[#FBF1F0] flex items-center justify-center rounded-[12px] border-[1.5px] border-[#E9C9C9] text-[#B4453A] text-[27px] font-bold">
                                3
                                <span className="mt-[10px] text-[#9A9AA3] text-[15px]">
                                    /5
                                </span>
                            </div>

                            <div className="flex-1 flex flex-col ml-[16.5px]">

                                <p className="text-[20px] font-bold">
                                    검증 결과
                                </p>

                                <p className="text-[#9A9AA3] text-[16px]">
                                    통과 3 · 미흡 1 · 대기 1
                                </p>
                            </div>

                            <div className="w-[71px] h-[35px] flex items-center justify-center text-[#B4453A] text-[16.5px] font-bold bg-[#FBF1F0] rounded-[8px] border-[1.5px] border-[#E9C9C9]">
                                미통과
                            </div>
                        </div>
                    </div>

                    {/*------------- 입력 노드 CORE 블록--------------- */}
                    <div className="min-h-[54px] px-[21px] pt-[14px] border-t-[1.5px] border-[#EEEEF1]">

                        <div className="flex items-center">

                            <div className="w-[25.5px] h-[25.5px] bg-[#2F8A5B] rounded-[50%]" />

                            <p className="flex-1 ml-[13.5px] text-[18px] font-bold">
                                입력 노드 CORE 블록
                            </p>

                            <div className="flex items-center">

                                <p className="w-[48px] h-[22.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center text-[#2F7D52] text-[16px] font-bold">
                                    통과
                                </p>

                                <p
                                    className="mt-[-4px] ml-[13.5px] cursor-pointer text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(1)}
                                >
                                    ⌄
                                </p>
                            </div>
                        </div>

                        {openId === 1 && (
                            <div className="mt-[16px] mb-[24.5px] text-[17px] font-bold pl-[39px]">

                                <p>
                                    채점 기준
                                    <span className="text-[#52525B] font-normal">
                                        · 입력 단계에 필수 블록 1개 이상이
                                        <br />
                                        포함되어야 합니다.
                                    </span>
                                </p>

                                <p className="mt-[13px]">
                                    확인 결과
                                    <span className="text-[#52525B] font-normal">
                                        · “텍스트 입력” 블록이 포함되어
                                        <br />
                                        있습니다.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/*------------- 프로세스 노드 CORE 블록--------------- */}
                    <div className="min-h-[54px] px-[21px] pt-[14px] border-t-[1.5px] border-[#EEEEF1]">

                        <div className="flex items-center">

                            <div className="w-[25.5px] h-[25.5px] bg-[#2F8A5B] rounded-[50%]" />

                            <p className="flex-1 ml-[13.5px] text-[18px] font-bold">
                                프로세스 노드 CORE 블록
                            </p>

                            <div className="flex items-center">

                                <p className="w-[48px] h-[22.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center text-[#2F7D52] text-[16px] font-bold">
                                    통과
                                </p>

                                <p
                                    className="mt-[-4px] ml-[13.5px] cursor-pointer text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(2)}
                                >
                                    ⌄
                                </p>
                            </div>
                        </div>

                        {openId === 2 && (
                            <div className="mt-[16px] mb-[24.5px] text-[16px] font-bold pl-[39px]">

                                <p>
                                    채점 기준
                                    <span className="text-[#52525B] font-normal">
                                        · 프로세스 단계에 필수 블록 1개 이상이
                                        <br />
                                        포함되어야 합니다.
                                    </span>
                                </p>

                                <p className="mt-[13px]">
                                    확인 결과
                                    <span className="text-[#52525B] font-normal">
                                        · 요약 생성” 블록이 포함되어 있습니다.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/*------------- 결과 노드 CORE 블록--------------- */}
                    <div className="min-h-[54px] px-[21px] pt-[14px] border-t-[1.5px] border-[#EEEEF1]">

                        <div className="flex items-center">

                            <div className="w-[25.5px] h-[25.5px] bg-[#2F8A5B] rounded-[50%]" />

                            <p className="flex-1 ml-[13.5px] text-[18px] font-bold">
                                결과 노드 CORE 블록
                            </p>

                            <div className="flex items-center">

                                <p className="w-[48px] h-[22.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center text-[#2F7D52] text-[16px] font-bold">
                                    통과
                                </p>

                                <p
                                    className="mt-[-4px] ml-[13.5px] cursor-pointer text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(3)}
                                >
                                    ⌄
                                </p>
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

                            <div className="w-[25.5px] h-[25.5px] bg-[#B88A3C] rounded-[50%]" />

                            <p className="flex-1 ml-[13.5px] text-[18px] font-bold">
                                필수 슬롯 채움
                            </p>

                            <div className="flex items-center">

                                <p className="w-[48px] h-[22.5px] bg-[#FBF6EC] rounded-[8px] flex items-center justify-center text-[#9A6A1E] text-[16px] font-bold">
                                    미흡
                                </p>

                                <p
                                    className="mt-[-4px] ml-[13.5px] cursor-pointer text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(4)}
                                >
                                    ⌄
                                </p>
                            </div>
                        </div>

                        {openId === 4 && (
                            <>
                                <div className="mt-[16px] text-[16px] font-bold pl-[39px]">

                                    <p>
                                        채점 기준
                                        <span className="text-[#52525B] font-normal">
                                            · 각 노드의 required slot이 모두
                                            <br />
                                            채워져야 합니다.
                                        </span>
                                    </p>

                                    <p className="mt-[13px]">
                                        확인 결과
                                        <span className="text-[#52525B] font-normal">
                                            · 검토 노드 “품질 검토”의 검토 기준이
                                            <br />
                                            비어 있습니다.
                                        </span>
                                    </p>
                                </div>

                                <div className="w-[343px] h-[106px] ml-[39px] mt-[14px] mb-[24.5px] pt-[14px] pl-[16.5px] flex bg-[#F5F5F7] border-[1.5px] border-[#E4E4E7] rounded-[12px]">

                                    <p className="text-[#6366F1] text-[17px] font-bold mr-[10px]">
                                        →
                                    </p>

                                    <p className="text-[#52525B] text-[17px] font-bold">
                                        수정가이드
                                        <span className="font-normal">
                                            · 검토 노드를 선택하고
                                            <br />
                                            인스펙터에서 기준(정확성·간결성)을
                                            <br />
                                            선택하세요.
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="min-h-[54px] px-[21px] pt-[14px] border-t-[1.5px] border-[#EEEEF1]">

                        <div className="flex items-center">

                            <div className="w-[25.5px] h-[25.5px] bg-[#E7E7EC] rounded-[50%]" />

                            <p className="flex-1 ml-[13.5px] text-[18px] font-bold">
                                저장 조건
                            </p>

                            <div className="flex items-center">

                                <p className="w-[48px] h-[22.5px] bg-[#F0F0F3] rounded-[8px] flex items-center justify-center text-[#9A9AA3] text-[16px] font-bold">
                                    대기
                                </p>

                                <p
                                    className="cursor-pointer mt-[-4px] ml-[13.5px] text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(5)}
                                >
                                    ⌄
                                </p>
                            </div>
                        </div>

                        {openId === 5 && (
                            <div className="mt-[16px] mb-[24.5px] text-[16px] font-bold pl-[39px]">

                                <p>
                                    채점 기준
                                    <span className="text-[#52525B] font-normal">
                                        · 제목 · 입력→결과 최소 흐름 · 필수 슬롯
                                        <br />
                                        완료가 필요합니다.
                                    </span>
                                </p>

                                <p className="mt-[13px]">
                                    확인 결과
                                    <span className="text-[#52525B] font-normal">
                                        · 필수 슬롯을 채우면 저장이
                                        <br />
                                        활성화됩니다.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
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
        </>
    )
}