import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import searchRound from "../assets/searchRound.svg"
import searchStick from "../assets/searchStick.svg";
import dashed from "../assets/dashed.png";
import { ReactFlow, } from "@xyflow/react";
// npx shadcn@latest add slider 설치
import { Slider } from "../components/ui/Slider";
import { useState } from "react";

const inPut = [{ id: 1, title: "텍스트 입력", content: "문서·원문 요청을 입력받습니다", state: "필수" },
{ id: 2, title: "필요한 문서 확인하기", content: "어떤 자료가 필요한지 고릅니다", state: "필수" },
{ id: 3, title: "필요한 스킬 확인하기", content: "요약·분류·작성 등 작업 유형", state: "필수" }];

const conText = [{ id: 1, title: "프로젝트 문서 불러오기", content: "저장된 문서를 참고합니다.", state: "필수" },
{ id: 2, title: "역할 부여하기", content: "기획자·리뷰어 등 역할 지정", state: "필수" },
]

const proCess = [{ id: 1, title: "핵심 내용 추출하기", content: "중요한 내용을 뽑습니다", state: "필수" },
{ id: 2, title: "요약 생성", content: "짧게/자세히 요약합니다", state: "필수" },
{ id: 3, title: "표로 재구성하기", content: "내용을 표 구조로 변환", state: "필수" },
{ id: 3, title: "프롬프트 조립하기", content: "역할·작업·출력을 구성", state: "필수" },
];

const review = [{ id: 1, title: "품질 검토", content: "출력 형식·기준을 점검합니다", state: "필수" },
{ id: 2, title: "조건 충족 확인하기", content: "지정 조건 만족 여부 확인", state: "필수" },
{ id: 3, title: "오류 위치 표시하기", content: "검증 실패 위치를 표시", state: "필수" },
];

const result = [{ id: 1, title: "텍스트로 출력하기", content: "일반 답변 형태로 출력", state: "필수" },
{ id: 2, title: "표로 출력하기", content: "표 형식으로 출력", state: "필수" },
{ id: 3, title: "프롬포트로 출력하기", content: "재사용 프롬프트로 출력", state: "필수" },
{ id: 3, title: "내 저장소에 저장하기", content: "결과·흐름을 저장", state: "필수" },
];




export function Stdio_create1() {
    const [value, setValue] = useState(0.7);
    const [openId, setOpenId] = useState<number | null>(null);
    const toggleItem = (id: number) => {
        setOpenId((prev) => (prev === id ? null : id));
    }

    return (
        <>
            <Header />
            <div className=" flex min-h-screen text-[#27272A]">

                {/* w-[1920px] min-h-[2528px] */}


                {/*블록 팔레트 */}
                <div className="relative z-30 w-[326px] min-h-[2350px] px-[16px] bg-white flex flex-col border-r-[1.5px] border-[#E4E4E7] items-center">
                    {/*블록 팔레트 텍스트 section */}

                    <div className="h-[122px] flex items-center justify-center gap-[14px]">
                        <p className="text-[22px] font-bold">블록 팔레트</p>
                        <img src={dashed} className="absolute w-[158px] h-[80px] left-[155px]" />
                        <div className="w-[150px] pl-[14px] py-[4px] text-[15px] text-[#9A9AA3]">
                            📱모바일 미지원 -
                            <br />블록 스튜디오는
                            <br />데스크톱 전용</div>
                    </div>
                    <div className="w-[356px] h-[1.5px] ml-[-32px] border-b-[1.5px] border-[#E4E4E7]" />
                    {/*블록 팔레트 텍스트 하단 section */}
                    <div className="w-full px-[16px] flex flex-col items-center">
                        {/*블록 검색 */}
                        <div className="mt-[13px] flex items-center
                        text-[19px] text-[#9A9AA3]">
                            <input placeholder="블록 검색" className="placeholder:text-[#9A9AA3] pl-[60px] w-[296px] h-[50px] border-[1.5px] border-[#E4E4E7] rounded-[50px] text-[#9A9AA3]" />
                            <img src={searchRound} className="absolute ml-[24px] w-[21px] h-[21px]" />
                            <img src={searchStick} className="absolute ml-[40px] top-[167px] w-[10px] h-[8.4px]" />
                        </div>
                        {/*입력 section */}
                        <div className="flex flex-col justify-center">
                            <div className="w-full flex items-center mt-[24px] mb-[15.5px]">
                                <div className="w-[13px] h-[13px] bg-[#4A5E8A] rounded-[4px]" />
                                <p className="ml-[10.5px] flex-1 text-[13.5px] text-[#9A9AA3] font-bold">입력</p>
                                <p className="text-[14px] text-[#9A9AA3] font-bold">INPUT</p>
                            </div>
                            {inPut.map((box) => (
                                <div key={box.id} className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mt-[-3px] mb-[12px]  w-[290px] h-[74px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                    <div className="flex items-center">
                                        <div className="w-[13px] h-[13px] bg-[#4A5E8A] rounded-[4px]" />
                                        <p className="ml-[12px] flex-1 text-[16px] font-bold">{box.title}</p>
                                        <p className="text-[12px] text-[#6366F1] font-bold">{box.state}</p>
                                    </div>
                                    <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">{box.content}</p>
                                </div>
                            )
                            )}

                            <div className="pt-[13.88px] pl-[16.5px] pr-[16px] mb-[12px]  w-[290px] h-[74px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                <div className="flex items-center">
                                    <div className="w-[13px] h-[13px] bg-[#4A5E8A] rounded-[4px]" />
                                    <p className="ml-[12px] flex-1 text-[16px] font-bold">파일 업로드 받기</p>
                                    <div><p className="w-[43.21px] h-[24.38px] bg-[#EEF4EE] rounded-[8px] font-bold flex items-center justify-center
                                    text-[12px] text-[#3C7A52] text-center">권장</p></div>
                                </div>
                                <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">문서·이미지를 업로드합니다</p>
                            </div>

                        </div>
                        {/*컨텍스트 section */}
                        <div className=" flex flex-col justify-center">
                            <div className="w-[290px] flex items-center mt-[18px] mb-[15.5px]">
                                <div className="w-[13px] h-[13px] bg-[#2F8190] rounded-[4px]" />
                                <p className="ml-[10.5px] flex-1 text-[13.5px] text-[#9A9AA3] font-bold">컨텍스트</p>
                                <p className="text-[13.5px] text-[#9A9AA3] font-bold">CONTEXT</p>
                            </div>
                            {conText.map((box) => (
                                <div key={box.id} className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mt-[-3px] mb-[12px]  w-[290px] h-[72px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                    <div className="flex items-center">
                                        <div className="w-[13px] h-[13px] bg-[#2F8190] rounded-[4px]" />
                                        <p className="ml-[12px] flex-1 text-[16px] font-bold">{box.title}</p>
                                        <p className="text-[12px] text-[#6366F1] font-bold">{box.state}</p>
                                    </div>
                                    <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">{box.content}</p>
                                </div>
                            )
                            )}
                            <div className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px]  w-[290px] h-[72px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                <div className="flex items-center">
                                    <div className="w-[13px] h-[13px] bg-[#2F8190] rounded-[4px]" />
                                    <p className="ml-[12px] flex-1 text-[16px] font-bold">제약조건 입력하기</p>
                                    <div><p className="w-[43.21px] h-[24.38px] bg-[#EEF4EE] rounded-[8px] font-bold flex items-center justify-center
                                    text-[12px] text-[#3C7A52] text-center">권장</p></div>
                                </div>
                                <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">분량·톤·금지사항 설정</p>
                            </div>
                            <div className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[12px]  w-[290px] h-[72px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                <div className="flex items-center">
                                    <div className="w-[13px] h-[13px] bg-[#2F8190] rounded-[4px]" />
                                    <p className="ml-[12px] flex-1 text-[16px] font-bold">용어 사전 제공하기</p>
                                    <div><p className="w-[55.8px] h-[24.38px] bg-[#F0F0F3] rounded-[8px] font-bold flex items-center justify-center
                                    text-[12px] text-[#9A9AA3] text-center">준비중</p></div>
                                </div>
                                <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">고유 용어·약어 정의</p>
                            </div>
                        </div>
                        {/*프로세스 section */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center mt-[14px] mb-[15.5px]">
                                <div className="w-[13px] h-[13px] bg-[#6366F1] rounded-[4px]" />
                                <p className="ml-[10.5px] flex-1 text-[13.5px] text-[#9A9AA3] font-bold">프로세스</p>
                                <p className="text-[13.5px] text-[#9A9AA3] font-bold">PROCESS</p>
                            </div>
                            {proCess.map((box) => (
                                <div key={box.id} className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[9px]  w-[290px] h-[72px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                    <div className="flex items-center">
                                        <div className="w-[13.5px] h-[13.5px] bg-[#6366F1] rounded-[4px]" />
                                        <p className="ml-[12px] flex-1 text-[16px] font-bold">{box.title}</p>
                                        <p className="text-[12px] text-[#6366F1] font-bold">{box.state}</p>
                                    </div>
                                    <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">{box.content}</p>
                                </div>
                            )
                            )}
                        </div>
                        {/*검토 section */}
                        <div className="flex flex-col justify-center">
                            <div className=" flex items-center mt-[20px] mb-[15.5px]">
                                <div className="w-[13px] h-[13px] bg-[#B07A2E] rounded-[4px]" />
                                <p className="ml-[10.5px] flex-1 text-[13.5px] text-[#9A9AA3] font-bold">검토</p>
                                <p className="text-[13.5px] text-[#9A9AA3] font-bold">REVIEW</p>
                            </div>
                            <div className="mt-[-4px]">
                                {review.map((box) => (
                                    <div key={box.id} className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[9px]  w-[290px] h-[74px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                        <div className="flex items-center">
                                            <div className="w-[13.5px] h-[13.5px] bg-[#B07A2E] rounded-[4px]" />
                                            <p className="ml-[12px] flex-1 text-[16px] font-bold">{box.title}</p>
                                            <p className="text-[12px] text-[#6366F1] font-bold">{box.state}</p>
                                        </div>
                                        <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">{box.content}</p>
                                    </div>
                                )
                                )}
                                <div className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mt-[0px]  w-[290px] h-[72px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                    <div className="flex items-center">
                                        <div className="w-[13.5px] h-[13.5px] bg-[#B07A2E] rounded-[4px]" />
                                        <p className="ml-[12px] flex-1 text-[16px] font-bold">누락 확인하기</p>
                                        <div><p className="w-[43.21px] h-[24.38px] bg-[#EEF4EE] rounded-[8px] font-bold
                                    text-[12px] text-[#3C7A52] text-center">권장</p></div>
                                    </div>
                                    <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">빠진 항목점검합니다</p>
                                </div>
                            </div>
                        </div>
                        {/*결과 section */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center mt-[28px] mb-[15.5px]">
                                <div className="w-[13px] h-[13px] bg-[#3C7A52] rounded-[4px]" />
                                <p className="ml-[10.5px] flex-1 text-[13.5px] text-[#9A9AA3] font-bold">결과</p>
                                <p className="text-[13.5px] text-[#9A9AA3] font-bold">OUTPUT</p>
                            </div>
                            <div className="mt-[-2px]">
                                {result.map((box) => (
                                    <div key={box.id} className="pt-[13.88px] pl-[16.5px] pr-[21.6px] mb-[9px]  w-[290px] h-[72px] rounded-[12px] border-[1.5px] border-[#E4E4E7]">
                                        <div className="flex items-center">
                                            <div className="w-[13px] h-[13px] bg-[#3C7A52] rounded-[4px]" />
                                            <p className="ml-[12px] flex-1 text-[16px] font-bold">{box.title}</p>
                                            <p className="text-[12px] text-[#6366F1] font-bold">{box.state}</p>
                                        </div>
                                        <p className="ml-[26px] mt-[2px] text-[14px] text-[#9A9AA3]">{box.content}</p>
                                    </div>
                                )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/*메인 화면 */}
                <div className="flex-1 z-10">
                    {/* <ReactFlow nodes={nodes} edges={edges}
                        zoomOnScroll={false}     // 마우스 휠 확대/축소
                        zoomOnPinch={false}      // 터치 확대/축소
                        zoomOnDoubleClick={false} // 더블클릭 확대
                        panOnScroll={false}
                        panOnDrag={true}      // 회색 배경 드래그 이동
                        nodesDraggable={true} // 노드 이동
                        className="w-[54px] h-[105px] bg-pink-300 rounded-[12px]"
                    /> */}
                    <div className="flex flex-col mx-[20px] my-[20px] px-[19.5px] pt-[21.45px] w-[375px] h-[274.5px] bg-white border-[1.5px] border-[#E4E4E7] rounded-[20px]">
                        <div className="flex items-center">
                            <div className="w-[34.5px] h-[34.5px] bg-[#4A5E8A] rounded-[12px] flex items-center justify-center
                            text-white font-bold text-[18px]">1</div>
                            <div className="flex flex-col flex-1 gap-[6px] ml-[13.5px]">
                                <p className="font-bold text-[20.25px] ">입력</p>
                                <p className="text-[#9A9AA3] text-[13.5px] ">INPUT</p>
                            </div>
                            <div className="w-[74.6px] h-[28.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                            text-[#2F7D52] text-[15px] font-bold">필수 2/2</div>
                        </div>
                        <div className="mt-[33.58px] w-[342px] h-[48px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white
                        flex items-center justify-center">
                            <div className="ml-[13.5px] w-[10.5px] h-[10.5px] bg-[#4A5E8A] rounded-[4px]" />
                            <p className="ml-[10.5px] flex-1 font-bold">텍스트 입력</p>
                            <p className="mr-[13.32px] text-[#9A9AA3] text-[16.5px]">리뷰 100건</p>
                        </div>
                        <div className="mt-[9.75px] w-[342px] h-[48px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white
                        flex items-center justify-center">
                            <div className="ml-[13.5px] w-[10.5px] h-[10.5px] bg-[#4A5E8A] rounded-[4px]" />
                            <p className="ml-[10.5px] flex-1 font-bold">필요한 스킬</p>
                            <p className="mr-[13.32px] text-[#9A9AA3] text-[16.5px]">요약</p>
                        </div>
                        <div className="mt-[15px] ml-[-20px] border-dashed w-[372px] border-[1.5px] border-[#E4E4E7]" />
                        <div className="mt-[13.2px] mb-[17.8px] flex items-center justify-between
                        text-[#4A5E8A] text-[16.5px] font-bold">
                            <p>다음 단계로 전달</p>
                            <p>→</p>
                        </div>
                    </div>
                    {/* <div className="flex flex-col mx-[20px] my-[20px] px-[19.5px] pt-[21.45px] w-[375px] h-[274.5px] bg-white border-[1.5px] border-[#E4E4E7] rounded-[20px]">
                        <div className="flex items-center">
                            <div className="w-[34.5px] h-[34.5px] bg-[#2F8190] rounded-[12px] flex items-center justify-center
                            text-white font-bold text-[18px]">2</div>
                            <div className="flex flex-col flex-1 gap-[6px] ml-[13.5px]">
                                <p className="font-bold text-[20.25px] ">컨텍스트</p>
                                <p className="text-[#9A9AA3] text-[13.5px] ">CONTEXT</p>
                            </div>
                            <div className="w-[74.6px] h-[28.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                            text-[#2F7D52] text-[15px] font-bold">필수 1/1</div>
                        </div>
                        <div className="mt-[33.58px] w-[342px] h-[48px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white
                        flex items-center justify-center">
                            <div className="ml-[13.5px] w-[10.5px] h-[10.5px] bg-[#2F8190] rounded-[4px]" />
                            <p className="ml-[10.5px] flex-1 font-bold">역할 부여</p>
                            <p className="mr-[13.32px] text-[#9A9AA3] text-[16.5px]">리뷰 분석가</p>
                        </div>
                        <div className="mt-[9.75px] w-[342px] h-[48px] rounded-[12px] border-[1.5px] border-[#E4E4E7] bg-white
                        flex items-center justify-center">
                            <div className="ml-[13.5px] w-[10.5px] h-[10.5px] bg-[#2F8190] rounded-[4px]" />
                            <p className="ml-[10.5px] flex-1 font-bold">제약 조건</p>
                            <p className="mr-[13.32px] text-[#9A9AA3] text-[16.5px]">짧게</p>
                        </div>
                        <div className="mt-[15px] ml-[-20px] border-dashed w-[372px] border-[1.5px] border-[#E4E4E7]" />
                        <div className="mt-[13.2px] mb-[17.8px] flex items-center justify-between
                        text-[#2F8190] text-[16.5px] font-bold">
                            <p>다음 단계로 전달</p>
                            <p>→</p>
                        </div>
                    </div> */}

                </div>
                {/*인스펙터 */}
                <div className="relative z-30 min-w-[406px] min-h-[2350px] flex flex-col border-l-[1.5px] border-[#E4E4E7]">
                    <div className="flex items-center pl-[20px] w-full h-[78px] border-b-[1.5px] border-[#E4E4E7] text-[22px] font-bold">인스펙터</div>
                    {/* 프로세스 노드 */}
                    <div className="h-[180px] px-[21px] py-[14px] border-b-[1.5px] border-[#E4E4E7]">
                        <div className="flex items-center">
                            <p className="w-[36px] h-[36px] flex items-center justify-center bg-[#6366F1] rounded-[12px]
                            text-white text-[18px] font-bold">3</p>
                            <div className="flex-1 ml-[14px]">
                                <p className="text-[19px] font-bold">프로세스 노드</p>
                                <p className="text-[#9A9AA3] text-[13px]">PROCESS · 요약 생성 </p>
                            </div>
                            <div className="w-[132px] h-[33px] flex items-center justify-center border-dashed border-[1.5px] border-[#E4E4E7] rounded-[8px]
                            text-[#52525B] text-[15px] font-bold">AI Optional</div>
                        </div>
                        <div className="mt-[14px] flex items-center gap-[10px] text-[#52525B] text-[13px] font-bold">
                            <div className="w-[78px] h-[29px] bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] flex items-center justify-center rounded-[8px]
                            ">필수 2/2</div>
                            <div className="w-[78px] h-[29px] bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] flex items-center justify-center rounded-[8px]
                            ">도구 1</div>
                            <div className="w-[78px] h-[29px] bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] flex items-center justify-center rounded-[8px]
                            ">슬롯 2</div>
                        </div>
                        <p className="w-full mt-[11px] text-[#9A9AA3] text-[14px]">이 노드는 컨테이너입니다. 아래 컴포넌트(블록)마다 도구·<br />프롬프트 강도·옵션을 따로 설정하세요.<br /></p>
                    </div>
                    <div className="w-full min-h-[518px] px-[18px] pt-[12px]">
                        <div className="flex items-center justify-between text-[#9A9AA3] font-bold">
                            <p className="text-[14px]">컴포넌트</p>
                            <p className="text-[13px]">3개 · 노드에 부착된 블록</p>
                        </div>
                        <div className="mt-[15px] pt-[13px] px-[18px] w-[full] h-[290px]">
                            <div className="flex items-center">
                                <div className="w-[22px] h-[22px] bg-[#6366F1] rounded-[8px]" />
                                <p className="flex-1 ml-[12px] text-[16.5px] font-bold">핵심 내용 추출</p>
                                <div className="flex items-center">
                                    <p className="text-[11.5px] text-[#6366F1] font-bold">필수</p>
                                    <p className="ml-[26px] mt-[-6px] text-[#9A9AA3] text-[18px]">⌄</p>
                                </div>
                            </div>

                            <p className="mt-[10px] text-[#52525B] text-[15.5px] font-bold">추출 강도</p>
                            <div className=" mt-[5.5px] flex w-[280px] items-center gap-4">
                                <Slider
                                    value={value}
                                    showValue={false}
                                    onChange={setValue}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    className="flex-1" />
                                <p className="text-[#9A9AA3] text-[15px]">{value} · 적극적</p>

                            </div>
                            <div className="mt-[12px] text-[#52525B] font-bold">
                                <p className="text-[15px]">추출 단위</p>
                                <div className="w-full h-[41px] mt-[9px] rounded-[8px] flex items-center border-[1.5px] border-[#E4E4E7]">
                                    <p className="w-[65px] h-full text-[15px] flex items-center justify-center border-r-[1.5px] border-[#E4E4E7]">문장</p>
                                    <p className="w-[65px] h-full text-[#6366F1] text-[15px] flex items-center justify-center border-r-[1.5px] border-[#E4E4E7]">요점</p>
                                    <p className="w-[65px] h-full ml-[17.2px] text-[15px] flex items-center ">주제</p>
                                </div>
                            </div>
                            <p className="mt-[12px] text-[15px] text-[#52525B] font-bold">필수 도구</p>
                            <div className="mt-[11.5px] ml-[15px] flex items-center text-[#6366F1] font-bold">
                                <div className="w-[10.5px] h-[10.5px] rounded-[50px] bg-[#6366F1] mr-[8px]" />
                                <p className="text-[14px]">핵심어 추출</p>
                                <div className="w-[10.5px] h-[10.5px] ml-[38px] mr-[8px] rounded-[50px] bg-[#6366F1]" />
                                <p className="text-[14px]">문서 파싱</p>
                            </div>
                        </div>
                        <div className="mt-[-4px] justify-between px-[18px] py-[15px] flex items-center">
                            <div className="flex items-center">
                                <div className="w-[21px] h-[21px] mr-[12px] bg-[#6366F1] rounded-[8px]" />
                                <p className="text-[16px] font-bold">요약 생성</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-[11.5px] text-[#6366F1] font-bold">필수</p>
                                <p className="ml-[28px] mt-[-6px] text-[#9A9AA3] text-[17px]">⌄</p>
                            </div>
                        </div>
                        <div className="justify-between h-[46px] mt-[15px] px-[14px] flex items-center border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                            <div className="flex items-center">
                                <div className="w-[22.5px] h-[22.5px] mr-[12px] border-[2px] border-[#D8A978] rounded-[8px]" />
                                <p className="text-[16.5px] font-bold">프롬포트 조립</p>
                            </div>
                            <div className="flex items-center">
                                <p className="w-[44px] h-[18px] flex items-center justify-center rounded-[6px] bg-[#F0F0F3]
                                text-[11.5px] text-[#9A9AA3] font-bold">선택</p>
                                <p className="ml-[22px] mt-[-12px] text-[#9A9AA3] text-[17px]">⌄</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[-54px] mb-[14px] border-[1px] border-[#EEEEF1]" />
                    <div className="w-full flex items-center justify-center">
                        <div className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[374px] h-[53px] border-[1.5px] border-[#EEEEF1] rounded-[12px]
                    text-[17px] font-bold flex items-center justify-center">설정 저장</div>
                    </div>
                    <div className="flex-4" />
                    <div className="w-full h-[96px] px-[21px] flex items-center justify-between border-t-[1.5px] border-[#E4E4E7]">
                        <div className="h-[106px] flex items-center">
                            <div className="w-[64px] h-[64px] bg-[#FBF1F0] flex items-center justify-center rounded-[12px] border-[1.5px] border-[#E9C9C9]
                            text-[#B4453A] text-[25px] font-bold">
                                3
                                <span className="mt-[10px] text-[#9A9AA3] text-[14px]">/5</span></div>
                            <div className="flex-1 flex flex-col ml-[16.5px]">
                                <p className="text-[18px] font-bold">검증 결과</p>
                                <p className="text-[#9A9AA3] text-[14px]">통과 3 · 미흡 1 · 대기 1</p>
                            </div>
                        </div>
                        <div className="w-[70px] h-[33px] flex items-center justify-center bg-[#FBF1F0] rounded-[8px] border-[1.5px] border-[#E9C9C9]
                            text-[#B4453A] text-[14px] font-bold ">미통과</div>
                    </div>

                    {/*------------- 입력 노드 CORE 블록--------------- */}
                    <div className="min-h-[54px] px-[21px] pt-[10px] border-t-[1.5px] border-[#EEEEF1]">
                        <div className="flex items-center ">
                            <div className="w-[23px] h-[23px] bg-[#2F8A5B] rounded-[50%]" />
                            <p className="flex-1 ml-[13.5px] text-[17px] font-bold">입력 노드 CORE 블록</p>
                            <div className="flex items-center">
                                <p className="w-[44px] h-[22.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                                text-[#2F7D52] text-[12.5px] font-bold">통과</p>
                                <p className="mt-[-4px] ml-[13.5px] cursor-pointer text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(1)}>⌄</p>
                            </div>
                        </div>
                        {openId === 1 && (
                            <div className="mt-[10px] mb-[19px] text-[15.5px] font-bold pl-[39px] leading-[24px]  tracking-tight ">
                                <p className="leading-[23px]">채점 기준<span className="text-[#52525B] font-normal">· 입력 단계에 필수 블록 1개 이상이<br />포함되어야 합니다.</span></p>
                                <p className="mt-[8px] leading-[23px]">확인 결과<span className="text-[#52525B] font-normal">· “텍스트 입력” 블록이 포함되어<br />있습니다.</span></p>
                            </div>
                        )}
                    </div>
                    {/*------------- 프로세스 노드 CORE 블록--------------- */}
                    <div className="min-h-[54px] px-[21px] pt-[8px] border-t-[1.5px] border-[#EEEEF1]">
                        <div className="flex items-center ">
                            <div className="w-[23px] h-[23px] bg-[#2F8A5B] rounded-[50%]" />
                            <p className="flex-1 ml-[13.5px] text-[17px] font-bold">프로세스 노드 CORE 블록</p>
                            <div className="flex items-center">
                                <p className="w-[44px] h-[22.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                                text-[#2F7D52] text-[12.5px] font-bold">통과</p>
                                <p className="mt-[-4px] ml-[13.5px] cursor-pointer text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(2)}>⌄</p>
                            </div>
                        </div>
                        {openId === 2 && (
                            <div className="mt-[12px] mb-[20px] text-[15px] font-bold pl-[39px] tracking-tight">
                                <p className="">채점 기준<span className="text-[#52525B] font-normal">· 프로세스 단계에 필수 블록 1개 이상이<br />포함되어야 합니다.</span></p>
                                <p className="mt-[9px]">확인 결과<span className="text-[#52525B] font-normal">· 요약 생성” 블록이 포함되어 있습니다.</span></p>
                            </div>
                        )}
                    </div>
                    {/*------------- 결과 노드 CORE 블록--------------- */}
                    <div className="min-h-[54px] px-[21px] pt-[8.5px] border-t-[1.5px] border-[#EEEEF1]">
                        <div className="flex items-center ">
                            <div className="w-[25.5px] h-[25.5px] bg-[#2F8A5B] rounded-[50%]" />
                            <p className="flex-1 ml-[13.5px] text-[17px] font-bold">결과 노드 CORE 블록</p>
                            <div className="flex items-center">
                                <p className="w-[44px] h-[22.5px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                                text-[#2F7D52] text-[12.5px] font-bold">통과</p>
                                <p className="mt-[-4px] ml-[13.5px] cursor-pointer text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(3)}>⌄</p>
                            </div>
                        </div>
                        {openId === 3 && (
                            <div className="mt-[11px] mb-[18px] text-[14.5px] font-bold pl-[39px]">
                                <p className="leading-[24px]">채점 기준<span className="text-[#52525B] font-normal">· 결과 단계에 필수 블록 1개 이상이<br />포함되어야 합니다.</span></p>
                                <p className="mt-[7px] leading-[24px]">확인 결과<span className="text-[#52525B] font-normal">· "텍스트 출력” 블록이 연결되어<br />있습니다.</span></p>
                            </div>
                        )}
                    </div>
                    <div className="min-h-[54px] px-[21px] pt-[8px] border-t-[1.5px] border-[#EEEEF1]">
                        <div className="flex items-center ">
                            <div className="w-[23px] h-[23px] bg-[#B88A3C] rounded-[50%]" />
                            <p className="flex-1 ml-[13.5px] text-[17px] font-bold">필수 슬롯 채움</p>
                            <div className="flex items-center">
                                <p className="w-[44px] h-[22.5px] bg-[#FBF6EC] rounded-[8px] flex items-center justify-center
                                text-[#9A6A1E] text-[12.5px] font-bold">미흡</p>
                                <p className="mt-[-4px] ml-[13.5px] cursor-pointer text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(4)}>⌄</p>
                            </div>
                        </div>
                        {openId === 4 && (<>
                            <div className="mt-[10px] text-[14.5px] font-bold pl-[39px] leading-[23px]">
                                <p className="leading-[24px]">채점 기준<span className="text-[#52525B] font-normal">· 각 노드의 required slot이 모두<br />채워져야 합니다.</span></p>
                                <p className="mt-[9px] leading-[24px]">확인 결과<span className="text-[#52525B] font-normal">· 검토 노드 “품질 검토”의 검토 기준이<br />비어 있습니다.</span></p>
                            </div>

                            <div className="w-[320px] h-[96px] ml-[39px] mt-[10px] mb-[18px] pt-[8px] pl-[14px] flex bg-[#F5F5F7] border-[1.5px] border-[#E4E4E7] rounded-[12px]
                            text-[15px] font-bold">
                                <p className="text-[#6366F1] mr-[10px]">→</p>
                                <p className="text-[#52525B] leading-[24px]">수정가이드<span className="font-normal">· 검토 노드를 선택하고<br />인스펙터에서 기준(정확성·간결성)을<br />선택하세요.</span></p>
                            </div>
                        </>
                        )}
                    </div>
                    <div className="min-h-[54px] px-[20px] pt-[9px] border-t-[1.5px] border-[#EEEEF1]">
                        <div className="flex items-center ">
                            <div className="w-[23px] h-[23px] bg-[#E7E7EC] rounded-[50%]" />
                            <p className="flex-1 ml-[13.5px] text-[17.5px] font-bold">저장 조건</p>
                            <div className="flex items-center">
                                <p className="w-[44px] h-[22.5px] bg-[#F0F0F3] rounded-[8px] flex items-center justify-center
                                text-[#9A9AA3] text-[12.5px] font-bold">대기</p>
                                <p className="cursor-pointer mt-[-4px] ml-[13.5px] text-[#9A9AA3] text-[19.5px]"
                                    onClick={() => toggleItem(5)}>⌄</p>
                            </div>
                        </div>
                        {openId === 5 && (
                            <div className="mt-[9px] mb-[20px] text-[14.5px] font-bold pl-[39px] leading-[23.5px]">
                                <p className="tracking-tight leading-[24px]">채점 기준<span className="text-[#52525B] font-normal">· 제목 · 입력→결과 최소 흐름 · 필수 슬롯<br />완료가 필요합니다.</span></p>
                                <p className="mt-[7px] leading-[24px]">확인 결과<span className="text-[#52525B] font-normal">· 필수 슬롯을 채우면 저장이<br />활성화됩니다.</span></p>
                            </div>
                        )}
                    </div>
                </div >

            </div >
            {/* footer */}
            < div className="h-[85px] bg-white px-[27px] flex items-center justify-between text-[20px] border-t-[1.5px] border-[#E4E4E7]" >
                <p className="text-[#9A9AA3] text-[14px]">자유 제작 · 노드 5 · 입력→컨텍스트→프로세스→검토→결과</p>
                <div className="flex items-center gap-[19px]">
                    <p className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[80px] h-[50px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[8px]
                    text-[17px] font-bold">검증</p>
                    <p className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[110px] h-[50px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[8px]
                    text-[17px] font-bold">예시 결과</p>
                    <p className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[110px] h-[50px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[8px]
                    text-[17px] font-bold">미리보기</p>
                    <p className="hover:text-white hover:bg-[#6366F1] cursor-pointer w-[80px] h-[50px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[8px]
                    text-[17px] font-bold">저장</p>
                </div>
            </div >
        </>
    )
}