import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function Studio_create_review_publish1() {
    const [open, setOpen] = useState(true);
    return (
        <>
            <Header />
            <div className="h-[69px] pl-[27px] pr-[9.4px] flex items-center justify-between text-[#27272A]">
                <p className="text-[20px] font-bold">워크플로우 저장</p>
                <div className="ml-[27px] flex flex-1 items-center gap-[22px]">
                    <div className="flex items-center gap-[9px]">
                        <div className="w-[25.5px] h-[25.5px] bg-[#2F8A5B] rounded-[50px] flex items-center justify-center text-white" />
                        <p className="text-[#2F7D52] text-[17.2px] font-bold">검토</p>
                    </div>
                    <div className="w-[21px] h-[3px] bg-[#E4E4E7]" />
                    <div className="flex items-center gap-[9px]">
                        <div className="w-[25.5px] h-[25.5px] bg-[#2F8A5B] rounded-[50px] flex items-center justify-center text-[#9A9AA3]" />
                        <p className="text-[#2F7D52] text-[17.2px] font-bold">상세정보</p>
                    </div>
                    <div className="w-[21px] h-[3px] bg-[#E4E4E7]" />
                    <div className="flex items-center gap-[9px]">
                        <p className="w-[25.5px] h-[25.5px] bg-[#6366F1] rounded-[50px] flex items-center justify-center text-white">3</p>
                        <p className="text-[#6366F1] text-[17.2px] font-bold">공개 설정</p>
                    </div>
                </div>
                <p className="text-[#9A9AA3] text-[17.2px]">자유 제작 흐름 · 저장 전 마지막 단계</p>
            </div>
            <main className="min-h-screen pb-[60px] flex justify-center  bg-[#F5F5F7]">
                <div className="w-[1158px]  flex flex-col min-h-screen text-[#27272A]">
                    <p className="mt-[38px] text-[#9A9AA3] text-[16.5px] font-bold">2 / 3 · 공개 설정</p>
                    <p className="text-[45px] font-bold">공개 범위를 정하고 저장하세요</p>
                    {/*기본 정보 컴포넌트 */}
                    <div className=" w-[1158px] h-[334px] mt-[29px] pt-[30.4px] pl-[32px] pr-[32px] bg-white gap-[23.8px] border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                        <div className="flex items-center justify-between">
                            <p className="text-[#9A9AA3] text-[16.5px] font-bold">공개 범위</p>
                            <p className="w-[132px] h-[33px] bg-[#F0F0F3] flex items-center justify-center rounded-[8px]
                            text-[#52525B] text-[16.5px] font-bold">기본: 🔒 비공개</p>
                        </div>
                        <div className="w-full h-[100.8px] mt-[27px] pt-[24.8px] pl-[24px] flex gap-[18px] border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                            {open ? (
                                <div className="w-[21px] h-[21px] border-[3px] border-[#C4C4CC] rounded-[50px]"
                                    onClick={() => setOpen(false)} />
                            ) :
                                (<div className="w-[21px] h-[21px] bg-[#6366F1] rounded-[50px]" />)}
                            <div className="flex flex-col gap-[8.4px]">
                                <p className="mt-[-6px] text-[20.2px] font-bold">🔒 비공개</p>
                                <p className="text-[#9A9AA3] text-[18px]">나만 볼 수 있어요. 내 저장소에서 언제든 공개로 전환할 수 있습니다.</p>
                            </div>
                        </div>
                        <div className="w-full mt-[36px] pl-[24px] flex gap-[18px]">
                            {!open ? (
                                <div className="w-[21px] h-[21px] border-[3px] border-[#C4C4CC] rounded-[50px]"
                                    onClick={() => setOpen(true)} />
                            ) :
                                (<div className="w-[21px] h-[21px] bg-[#6366F1] rounded-[50px]" />)}
                            <div className="flex flex-col gap-[8.4px]">
                                <p className="mt-[-6px] text-[20.2px] font-bold">🌐 공개</p>
                                <p className="text-[#9A9AA3] text-[18px]">공개 라이브러리에 올라가 다른 사용자가 보고 복사할 수 있어요.</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[418px] mt-[24.8px] px-[32px] pt-[32px] bg-white border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                        <div className="flex items-center justify-between font-bold">
                            <p className="text-[#9A9AA3] text-[16.5px]">공개 준비 조건</p>
                            <p className="w-[59px] h-[26.6px] bg-[#FBF6EC] flex items-center justify-center rounded-[8px] text-[#9A6A1E] text-[15.8px]">권장1</p>
                        </div>
                        {/* 큰 박스 */}
                        <div className="w-[1094px] h-[214px] mt-[24.8px] border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                            <div className="h-[62.6px] flex items-center">
                                <div className="ml-[21.75px] w-[25.5px] h-[25.5px] bg-[#2F8A5B] rounded-[50%]" />
                                <div className="flex-1 ml-[15px]">
                                    <p className="ml-[15px] text-[#28.8px] font-bold">제목 · 한 줄 요약 작성됨</p>
                                </div>
                                <p className="mr-[30px] w-[48.2px] h-[26.6px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                                text-[#2F7D52] font-bold">완료</p>
                            </div>


                            <div className="border-b-[1.5px] border-[#EEEEF1]" />
                            <div className="h-[62.6px] flex items-center">
                                <div className="ml-[21.75px] w-[25.5px] h-[25.5px] bg-[#2F8A5B] rounded-[50%]" />
                                <div className="flex-1 ml-[15px]">
                                    <p className="ml-[15px] text-[#28.8px] font-bold">블록 흐름 1개 이상</p>
                                </div>
                                <p className="mr-[30px] w-[48.2px] h-[26.6px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                                text-[#2F7D52] font-bold">완료</p>
                            </div>
                            <div className="border-b-[1.5px] border-[#EEEEF1]" />
                            <div className="mt-[10.5px] h-[62.6px] flex items-center">
                                <div className=" ml-[21.75px] w-[25.5px] h-[25.5px] bg-[#B88A3C] rounded-[50%]" />
                                <div className="flex-1 ml-[15px]">
                                    <p className="text-[#28.8px] font-bold">예시 입력 · 결과 작성</p>
                                    <p className="text-[#9A9AA3] text-[16.5px]">권장 — 없어도 공개할 수 있어요</p>
                                </div>
                                <p className="mr-[30px] w-[48.2px] h-[26.6px] bg-[#FBF6EC] rounded-[8px] flex items-center justify-center
                                text-[#9A6A1E] font-bold">권장</p>
                            </div>
                            <div className="flex items-center h-[67px] mt-[38px] pl-[21.8px] gap-[15px] border-[1.5px] bg-[#FBF6EC] border-[#ECD6B8] rounded-[12px]">
                                <p className="w-[27px] h-[27px] flex items-center justify-center bg-[#B88A3C] rounded-[50px] 
                                text-white text-[16.5px]">i</p>
                                <p className="text-[#52525B] text-[18.8px]">공개하면 다른 사용자가 흐름을<span className=" font-bold"> 보고 복사 </span>할 수 있습니다.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[24px] h-[210.4px] px-[30px] pt-[30px] bg-white border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                        <p className="text-[#9A9AA3] text-[16.5px] font-bold">저장 요약</p>
                        <div className="mt-[26.5px] flex items-center justify-between">
                            <div className="flex items-center h-[33px] text-bold text-[18px]">
                                <p className="w-[69.4px] bg-[#EEF1F7] flex items-center justify-center rounded-[6px]
                                text-[16.5px] text-[#4A5E8A] font-bold">기초</p>
                                <p className="px-[24.3px] text-[#6366F1] font-bold">결과물 검토</p>
                                <p className="w-[60px] bg-[#F0F0F3] flex items-center justify-center rounded-[12px] border-[1.5px] border-[#E4E4E7]
                                text-[16.5px] text-[#4A5E8A] font-bold">요약</p>
                                <p className="w-[60px] bg-[#F0F0F3] ml-[12.7px] flex items-center justify-center rounded-[12px] border-[1.5px] border-[#E4E4E7]
                                text-[16.5px] text-[#4A5E8A] font-bold">리뷰</p>
                            </div>
                            <p className="text-[#9A9AA3] text-[16.5px]">노드 5 · 예시 1</p>
                        </div>
                        <div className="mt-[21px] border-[1.5px] border-[#E4E4E7]" />
                        <div className="flex items-center justify-between">
                            <p className="mt-[17.6px] text-[18.8px] font-bold">제품 리뷰 요약기</p>
                            <p className="w-[120px] h-[26.6px] bg-[#EEF4EE] flex items-center justify-center rounded-[8px]
                            text-[#2F7D52] text-[15.8px] font-bold">저장 조건 통과</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="h-[94px] pl-[52px] pr-[28px]  flex items-center">
                <p className="cursor-pointer text-[#52525B] text-[20.2px] font-bold"
                    onClick={() => {

                    }}>← 상세 정보</p>
                <p className="flex-1 pl-[38px] text-[#9A9AA3] text-[16.5px]">3 / 3 · 공개 설정 — 범위 선택 후 저장</p>
                <div className="flex items-center">
                    <p className="cursor-pointer hover:border-[#666666] w-[121px] h-[57px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[12px]
                    text-[20.2px] font-bold"
                        onClick={() => {

                        }}>미리보기</p>
                    <p className="cursor-pointer hover:bg-[#3A3DC2] w-[193px] h-[55.5px] ml-[20px] bg-[#6366F1] flex items-center justify-center rounded-[12px]
                text-white text-[20px] font-bold"
                        onClick={() => {

                        }}>다음: 상세 정보 →</p>
                </div>
            </footer>
        </>
    )
}