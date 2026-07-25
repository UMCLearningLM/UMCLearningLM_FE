import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function Studio_create_review_publish1() {
    const [open, setOpen] = useState(true);
    const [saveBtn, setSaveBtn] = useState(false);
    return (
        <>
            <Header />
            <div className="h-[50px] pl-[27px] pr-[9.4px] bg-white flex items-center justify-between text-[#27272A]">
                <p className="text-[14px] font-black">워크플로우 저장</p>
                <div className="ml-[27px] flex flex-1 items-center gap-[22px]">
                    <div className="flex items-center gap-[9px]">
                        <div className="w-[18px] h-[18px] bg-[#2F8A5B] rounded-[50px] flex items-center justify-center text-white" />
                        <p className="text-[#2F7D52] text-[13px] font-bold">검토</p>
                    </div>
                    <div className="w-[16px] h-[2px] bg-[#E4E4E7]" />
                    <div className="flex items-center gap-[9px]">
                        <div className="w-[18px] h-[18px] bg-[#2F8A5B] rounded-[50px] flex items-center justify-center text-[#9A9AA3]" />
                        <p className="text-[#2F7D52] text-[13px] font-bold">상세정보</p>
                    </div>
                    <div className="w-[16px] h-[2px] bg-[#E4E4E7]" />
                    <div className="flex items-center gap-[9px]">
                        <p className="w-[18px] h-[18px] bg-[#6366F1] rounded-[50px] flex items-center justify-center text-white text-[10px] font-bold">3</p>
                        <p className="text-[#6366F1] text-[13px] font-bold">공개 설정</p>
                    </div>
                </div>
                <p className="text-[#9A9AA3] text-[13px]">자유 제작 흐름 · 저장 전 마지막 단계</p>
            </div>
            <main className="min-h-screen pb-[60px] flex justify-center  bg-[#F5F5F7]">
                <div className="w-[1158px]  flex flex-col min-h-screen text-[#27272A]">
                    <p className="mt-[26px] text-[#9A9AA3] text-[12px] font-bold">3 / 3 · 공개 설정</p>
                    <p className="text-[32px] font-bold">공개 범위를 정하고 저장하세요</p>
                    {/*기본 정보 컴포넌트 */}
                    <div className=" w-[1158px] h-[244px] mt-[18px] pt-[16px] pl-[32px] pr-[32px] bg-white gap-[23.8px] border-[1px] border-[#E4E4E7] rounded-[12px]">
                        <div className="flex items-center justify-between">
                            <p className="text-[#9A9AA3] text-[13px] font-bold">공개 범위</p>
                            <p className="w-[116px] h-[28px] bg-[#F0F0F3] flex items-center justify-center rounded-[8px]
                            text-[#52525B] text-[13px] font-bold">기본: 🔒 비공개</p>
                        </div>
                        <div className="w-full h-[76px] mt-[12px] pt-[18px] pl-[24px] flex gap-[18px] border-[1px] border-[#E4E4E7] rounded-[12px]">
                            {open ? (
                                <div className="w-[19px] h-[19px] border-[2px] border-[#C4C4CC] rounded-[50px]"
                                    onClick={() => setOpen(false)} />
                            ) :
                                (<div className="w-[19px] h-[19px] bg-[#6366F1] rounded-[50px]" />)}
                            <div className="mt-[-4px] flex flex-col gap-[4px]">
                                <p className="text-[15px] font-bold">🔒 비공개</p>
                                <p className="text-[#9A9AA3] text-[14px] font-[semibold]">나만 볼 수 있어요. 내 저장소에서 언제든 공개로 전환할 수 있습니다.</p>
                            </div>
                        </div>
                        <div className="w-full mt-[26px] pl-[24px] flex gap-[21px]">
                            {!open ? (
                                <div className="w-[19px] h-[19px] border-[2px] border-[#C4C4CC] rounded-[50px]"
                                    onClick={() => setOpen(true)} />
                            ) :
                                (<div className="w-[19px] h-[19px] bg-[#6366F1] rounded-[50px]" />)}
                            <div className="flex flex-col gap-[4px]">
                                <p className="mt-[-4px] text-[15px] font-bold">🌐 공개</p>
                                <p className="text-[#9A9AA3] text-[14px] font-[semibold]">공개 라이브러리에 올라가 다른 사용자가 보고 복사할 수 있어요.</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[300px] mt-[16px] px-[22px] pt-[17px] bg-white border-[1px] border-[#E4E4E7] rounded-[12px]">
                        <div className="flex items-center justify-between font-bold">
                            <p className="text-[#9A9AA3] text-[12px]">공개 준비 조건</p>
                            <p className="w-[52px] h-[24px] bg-[#FBF6EC] flex items-center justify-center rounded-[8px] text-[#9A6A1E] text-[13px]">권장1</p>
                        </div>
                        {/* 큰 박스 */}
                        <div className="w-[1094px] h-[160px] mt-[14px] border-[1px] border-[#E4E4E7] rounded-[12px]">
                            <div className="h-[46px] flex items-center">
                                <div className="ml-[21.75px] w-[19px] h-[19px] bg-[#2F8A5B] rounded-[50%]" />
                                <div className="flex-1">
                                    <p className="ml-[14px] text-[16px] font-bold">제목 · 한 줄 요약 작성됨</p>
                                </div>
                                <p className="mr-[30px] w-[42px] h-[24px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                                text-[#2F7D52] text-[13px] font-bold">완료</p>
                            </div>


                            <div className="border-b-[1px] border-[#EEEEF1]" />
                            <div className="h-[46px] flex items-center">
                                <div className="ml-[21.75px] w-[19px] h-[19px] bg-[#2F8A5B] rounded-[50%]" />
                                <div className="flex-1 ml-[15px]">
                                    <p className="text-[16px] font-bold">블록 흐름 1개 이상</p>
                                </div>
                                <p className="mr-[30px] w-[42px] h-[24px] bg-[#EEF4EE] rounded-[8px] flex items-center justify-center
                                text-[#2F7D52] text-[13px] font-bold">완료</p>
                            </div>
                            <div className="border-b-[1px] border-[#EEEEF1]" />
                            <div className="mt-[10.5px] h-[46px] flex items-center">
                                <div className=" ml-[21.75px] w-[19px] h-[19px] bg-[#B88A3C] rounded-[50%]" />
                                <div className="flex-1 ml-[15px]">
                                    <p className="text-[16px] font-bold">예시 입력 · 결과 작성</p>
                                    <p className="text-[#9A9AA3] text-[12px]">권장 — 없어도 공개할 수 있어요</p>
                                </div>
                                <p className="mr-[30px] w-[42px] h-[24px] bg-[#FBF6EC] rounded-[8px] flex items-center justify-center
                                text-[#9A6A1E] text-[13px] font-bold">권장</p>
                            </div>
                            <div className="flex items-center h-[50px] mt-[20px] pl-[21.8px] gap-[15px] border-[1px] bg-[#FBF6EC] border-[#ECD6B8] rounded-[12px]">
                                <p className="w-[22px] h-[22px] flex items-center justify-center bg-[#B88A3C] rounded-[50px] 
                                text-white text-[14px]">!</p>
                                <p className="text-[#52525B] text-[14px] font-[semibold]">공개하면 다른 사용자가 흐름을<span className=" font-bold"> 보고 복사 </span>할 수 있습니다.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[14px] h-[156px] px-[30px] pt-[20px] bg-white border-[1px] border-[#E4E4E7] rounded-[12px]">
                        <p className="text-[#9A9AA3] text-[13px] font-bold">저장 요약</p>
                        <div className="mt-[14px] flex items-center justify-between">
                            <div className="flex items-center text-bold text-[13px]">
                                <p className="w-[56px] h-[24px] bg-[#EEF1F7] flex items-center justify-center rounded-[6px]
                                text-[13px] text-[#4A5E8A] font-bold">기초</p>
                                <p className="px-[24.3px] text-[#6366F1] font-bold">결과물 검토</p>
                                <p className="w-[50px] h-[24px] bg-[#F0F0F3] flex items-center justify-center rounded-[12px] border-[1px] border-[#E4E4E7]
                                text-[14px] text-[#4A5E8A] font-bold">요약</p>
                                <p className="w-[50px] h-[24px] bg-[#F0F0F3] ml-[12.7px] flex items-center justify-center rounded-[12px] border-[1px] border-[#E4E4E7]
                                text-[14px] text-[#4A5E8A] font-bold">리뷰</p>
                            </div>
                            <p className="text-[#9A9AA3] text-[14px]">노드 5 · 예시 1</p>
                        </div>
                        <div className="mt-[17px] border-[0.5px] border-[#E4E4E7]" />
                        <div className="flex items-center justify-between">
                            <p className="mt-[10px] text-[14px] font-bold">제품 리뷰 요약기</p>
                            <p className="w-[90px] h-[20px] bg-[#EEF4EE] flex items-center justify-center rounded-[4px]
                            text-[#2F7D52] text-[12px] font-bold">저장 조건 통과</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="h-[80px] pl-[52px] pr-[28px]  flex items-center">
                <p className="cursor-pointer text-[#52525B] text-[16px] font-bold"
                    onClick={() => {

                    }}>← 상세 정보</p>
                <p className="flex-1 pl-[38px] text-[#9A9AA3] text-[13px] font-[semibold]">3 / 3 · 공개 설정 — 범위 선택 후 저장</p>
                <div className="flex items-center">
                    <p className="cursor-pointer hover:border-[#666666] w-[100px] h-[48px] flex items-center justify-center border-[1.5px] border-[#E4E4E7] rounded-[12px]
                    text-[15px] font-bold"
                        onClick={() => {

                        }}>미리보기</p>
                    <p className="cursor-pointer hover:bg-[#3A3DC2] w-[164px] h-[48px] ml-[20px] bg-[#6366F1] flex items-center justify-center rounded-[12px]
                text-white text-[15px] font-bold"
                        onClick={() => {
                            setSaveBtn(true)
                        }}>저장 · 내 저장소에</p>
                </div>
                {saveBtn && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* 반투명 배경 */}
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setSaveBtn(false)}
                        />

                        {/* 팝업 */}
                        <div className="relative z-10 w-[680px] h-[290px] rounded-2xl bg-white pt-[24px] px-[24px] shadow-xl">
                            <div className="flex items-center">
                                <div className="w-[30px] h-[30px] bg-[#3C7A52] flex items-center justify-center rounded-[50px]
                                text-white text-[14px] font-bold">✓</div>
                                <p className="ml-[15px] text-xl font-bold"> 저장 완료</p>
                            </div>

                            <div className="w-[628px] h-[78px] mt-[14px] pl-[22.5px] pt-[14px] bg-[#F5F5F7] flex gap-[15px] border-[1.5px] border-[#E4E4E7] rounded-[12px]">
                                <div className="w-[22px] h-[22px] bg-[#3C7A52] flex items-center justify-center rounded-[50px]
                                text-white text-[12px] font-bold">✓</div>
                                <p className="mt-[-4px] text-[15px]"><span className="font-bold">"제품 리뷰 요약기"</span>를 내 저장소에<span className="font-bold"> 비공개 </span>로 저장했어요. 언제든 편집하거나
                                    <br />공개로 전환할 수 있습니다.</p>
                            </div>

                            <div className="h-[33px] mt-[16px] flex items-center font-bold">
                                <p className="w-[90px] h-[30px] flex items-center justify-center bg-[#F0F0F3] rounded-[8px]
                                text-[#52525B] text-[14px]">🔒 비공개</p>
                                <p className="w-[66px] h-[30px] ml-[10.5px] bg-[#EEF1F7] flex items-center justify-center rounded-[8px] text-[#4A5E8A]">기초</p>
                                <p className="ml-[21px] text-[#6366F1] text-[16px] text-[#6366F1]">결과물 검토</p>
                            </div>

                            <div className="mt-[20px] flex items-center justify-end gap-[36px]">
                                <p
                                    onClick={() => setSaveBtn(false)}
                                    className="cursor-pointer text-[#52525B] text-[16px] font-bold"
                                >
                                    계속 편집
                                </p>

                                <p className="cursor-pointer w-[160px] h-[44px] flex items-center justify-center rounded-lg text-[16px] font-bold bg-[#6366F1] text-white">
                                    내 저장소 보기
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </footer>
        </>
    )
}