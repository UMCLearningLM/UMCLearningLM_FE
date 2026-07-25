import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function Studio_create_review1() {
    const [open, setOpen] = useState(true);
    return (
        <>
            <Header />
            <div className="h-[69px] pl-[27px] pr-[9.4px] flex items-center justify-between text-[#27272A]">
                <p className="text-[20px] font-bold">워크플로우 저장</p>
                <div className="ml-[27px] flex flex-1 items-center gap-[22px]">
                    <div className="flex items-center gap-[9px]">
                        <p className="w-[25.5px] h-[25.5px] bg-[#6366F1] rounded-[50px] flex items-center justify-center text-white
                        ">1</p>
                        <p className="text-[#6366F1] text-[17.2px] font-bold">검토</p>
                    </div>
                    <div className="w-[21px] h-[3px] bg-[#E4E4E7]" />
                    <div className="flex items-center gap-[9px]">
                        <p className="w-[25.5px] h-[25.5px] bg-[#E7E7EC] rounded-[50px] flex items-center justify-center text-[#9A9AA3]">2</p>
                        <p className="text-[#9A9AA3] text-[17.2px] font-bold">상세정보</p>
                    </div>
                    <div className="w-[21px] h-[3px] bg-[#E4E4E7]" />
                    <div className="flex items-center gap-[9px]">
                        <p className="w-[25.5px] h-[25.5px] bg-[#E7E7EC] rounded-[50px] flex items-center justify-center text-[#9A9AA3]">3</p>
                        <p className="text-[#9A9AA3] text-[17.2px] font-bold">공개 설정</p>
                    </div>
                </div>
                <p className="text-[#9A9AA3] text-[17.2px]">자유 제작 흐름 · 저장 전 마지막 단계</p>
            </div>
            <main className="min-h-screen pb-[60px] flex justify-center  bg-[#F5F5F7]">
                <div className="w-[1158px]  flex flex-col min-h-screen text-[#27272A]">
                    <p className="mt-[38px] text-[#9A9AA3] text-[16.5px] font-bold">2 / 3 · 상세 정보</p>
                    <p className="text-[45px] font-bold">워크플로우 정보를 입력하세요</p>
                    <div className="flex itesm-center mt-[48px] gap-[15px]">
                        <p className="w-[27px] h-[27px] flex items-center justify-center bg-[#6366F1] rounded-[50px] 
                                text-white text-[16.5px]">i</p>
                        <p className="text-[#52525B] text-[18.8px]">모든 조건이<span className=" font-bold"> 통과 </span>되어야 저장할 수 있어요. 제목·요약은 다음 단계에서 입력합니다.</p>
                    </div>
                    {/*기본 정보 컴포넌트 */}
                    <div className="w-[1158px] h-[364px] mt-[50px] pt-[30.4px] pl-[30.7px] bg-white gap-[23.8px] border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                        <p className="text-[#9A9AA3] text-[16.5px] font-bold">기본 정보</p>
                        <div className="mt-[27px] flex items-center">
                            <div className="w-[224px] flex flex-col gap-[12px]">
                                <button className="h-[155px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[12px]
                                text-[#9A9AA3] text-[16.5px]">썸네일</button>
                                <p className="cursor-pointer hover:text-white hover:bg-[#6366F1] h-[47px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[12px]
                                text-[18.8px] font-bold">이미지 변경</p>
                            </div>
                            <div className="w-[845px] h-[214px] ml-[25.5px]">
                                <p className="text-[#52525B] text-[18.8px] font-bold">제목<span className="text-[#C0473C]"> *</span></p>
                                <input className="w-full h-[56px] mt-[14.5px] border-[1.5px] border-[#E4E4E7] rounded-[12px]" />
                                <p className="mt-[18.4px] text-[#52525B] text-[18.8px] font-bold">한 줄 요약<span className="text-[#C0473C]"> *</span></p>
                                <input className="w-full h-[56px] mt-[14.5px] border-[1.5px] border-[#E4E4E7] rounded-[12px]" />
                                <p className="mt-[9.6px] text-[#9A9AA3] text-[17.2px]">블록 흐름에서 자동 생성 · 수정 가능</p>
                            </div>
                        </div>
                    </div>
                    {/* 분류 컴포넌트 */}
                    <div className="w-full h-[440px] mt-[24.8px] px-[32px] pt-[32px] bg-white border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                        <div className="flex items-center justify-between font-bold">
                            <p className="text-[#9A9AA3] text-[16.5px]">분류</p>
                        </div>
                        <p className="mt-[25.6px] text-[#52525B] text-[18.8px] font-bold">목적</p>
                        <input className="w-[1094px] h-[60px] mt-[14.5px] border-[1.5px] border-[#E4E4E7] rounded-[12px]" />
                        <p className="mt-[21px] text-[#52525B] text-[18.8px] font-bold">카테고리</p>
                        <div className="mt-[14.4px] flex items-center gap-[12px] text-[#52525B] text-[18px] font-bold">
                            <p className="w-[95.2px] h-[39px] flex items-center justify-center bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] rounded-[50px]
                            ">자료조사</p>
                            <p className="w-[99.5px] h-[39px] flex items-center justify-center bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] rounded-[50px]
                            ">문서 요약</p>
                            <p className="w-[78px] h-[39px] flex items-center justify-center bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] rounded-[50px]
                            ">글쓰기</p>
                            <p className="w-[133.4px] h-[39px] flex items-center justify-center bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] rounded-[50px]
                            ">반복 작업 정리</p>
                            <p className="w-[133.4px] flex items-center justify-center text-[#6366F1] text-[18px] font-bold">결과물 검토</p>
                            <p className="w-[105.4px] h-[39px] flex items-center justify-center bg-[#F0F0F3] border-[1.5px] border-[#E4E4E7] rounded-[50px]
                            ">AI 툴 활용</p>
                        </div>
                        <div className="flex items-center text-[#52525B] font-bold">
                            <div className="w-[196.8px] mt-[21px]">
                                <p className="">난이도</p>
                                <div className=" h-[44px] mt-[15.2px] flex items-center border-[1.5px] border-[#E4E4E7] rounded-[10px] text-[18px]">
                                    <p className="w-[65.6px] flex items-center justify-center">입문</p>
                                    <div className="h-[42px] border-[1.5px] border-[#E4E4E7]" />
                                    <p className="w-[65.6px] flex items-center justify-center text-[#6366F1]">기초</p>
                                    <div className="h-[42px] border-[1.5px] border-[#E4E4E7]" />
                                    <p className="w-[65.6px] flex items-center justify-center">응용</p>
                                </div>
                            </div>
                            <div className="w-[871px] mt-[21px] ml-[24.8px]">
                                <p>태그</p>
                                <div className="w-full h-[60px] mt-[15.2px] pl-[26.2px] flex items-center gap-[34.6px] border-[1.5px] border-[#E4E4E7] rounded-[10px]
                                text-[18px] text-[#6366F1]">
                                    <p>요약 <span className="cursor-pointer">X</span></p>
                                    <p>리뷰 <span className="cursor-pointer">X</span></p>
                                    <p>장단점 <span className="cursor-pointer">X</span></p>
                                    <p className="cursor-pointer text-[#9A9AA3] text-[19.5px] font-normal">태그 추가</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mt-[24.75px] flex items-center justify-between">
                        <div className="w-[567px] h-[210.8px] bg-white flex flex-col items-center justify-center gap-[18px] border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                            <p className="w-full ml-[60px] text-[#9A9AA3] text-[16.5px] font-bold">예시 입력</p>
                            <input className="w-[504px] h-[111px] border-[1.5px] border-[#E4E4E7] rounded-[12px]" />
                        </div>
                        <div className="w-[567px] h-[210.8px] px-[30px] bg-white flex flex-col items-center justify-center gap-[18px] border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                            <div className="w-full flex items-center justify-between ">
                                <p className="text-[#9A9AA3] text-[16.5px] font-bold">예시 결과</p>
                                <p className="w-[117.2px] h-[32px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] border-dashed rounded-[8px]
                                text-[#52525B] text-[16.5px] font-bold">Template</p>
                            </div>
                            <div className="w-full flex flex-col gap-[10px]">
                                <div className="w-[444px] h-[13.5px] bg-[#F0F0F3] rounded-[50px]" />
                                <div className="w-[362.8px] h-[13.5px] bg-[#F0F0F3] rounded-[50px]" />
                                <div className="w-[403.2px] h-[13.5px] bg-[#F0F0F3] rounded-[50px]" />
                                <p className="text-[#9A9AA3] text-[17.2px]">예시 결과는 학습용 미리보기입니다. </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-[1158px] h-[196px] mt-[24.8px] pt-[31.2px] pl-[31.2px] bg-white rounded-[12px]">
                        <p className="text-[#9A9AA3] text-[16.5px] font-bold">작성자 노트</p>
                        <input className="w-[1094px] h-[95px] mt-[18px] border-[1.5px] border-[#E4E4E7] rounded-[12px]" />
                    </div>
                </div>
            </main>
            <footer className="h-[94px] pl-[52px] pr-[28px]  flex items-center">
                <p className="text-[#52525B] text-[20.2px] font-bold"
                    onClick={() => {

                    }}>← 편집으로</p>
                <p className="flex-1 pl-[38px] text-[#9A9AA3] text-[16.5px]">1 / 3 · 검토 — 흐름과 저장 조건 확인</p>
                <p className="hover:bg-[#3A3DC2] w-[193px] h-[55.5px] bg-[#6366F1] flex items-center justify-center rounded-[12px]
                text-white text-[20px] font-bold"
                    onClick={() => {

                    }}>다음: 상세 정보 →</p>
            </footer>
        </>
    )
}