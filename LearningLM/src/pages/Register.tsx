import { Box, Check, CircleCheckBig } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function Register() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    return (
        <>
            <div className="min-h-screen flex flex-col items-center bg-[#F5F5F7] text-[#52525B] text-[18px] py-[100px]">
                {/* branding */}
                <div className="px-[10px] flex flex-col items-center mb-[44px]">
                    <div className="flex flex-row gap-[8px]">
                        <div className="flex flex-col rounded-[8px] bg-[#6366F1] px-[15px] py-[4px] justify-center items-center
                        text-[24px] font-bold text-[#FFF]
                        ">L</div>
                        <p className="text-[#27272A] text-[28px] font-bold">LearningLM</p>
                    </div>
                    <p className="text-[#52525B] mt-[14px]">AI활용 흐름을 블록형 튜토리얼로 배우는 플랫폼</p>
                </div>
                {/*white box */}
                <div className="bg-white w-[580px] min-h-[858px] flex flex-col items-center px-[10px] py-[50px] rounded-[12px]">
                    {/* title */}
                    <div className="flex flex-col w-[529px]">
                        <p className="text-[32px] font-bold text-[#27272A]">회원가입</p>
                        <p className="text-[#52525B] mt-[7px]">무료로 시작하고 첫 튜토리얼을 진행해 보세요.</p>
                    </div>
                    {/*main content */}
                    {/*email */}
                    <div className="flex flex-col mt-[47px] w-[519px]">
                        <p className="font-bold text-[#52525B]">이메일</p>
                        <input type="email" placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />
                        <button className="hover:bg-[#6366F1] hover:text-white cursor-pointer w-[145px] h-[54px] border-[#6366F1] mt-[15px] text-[#6366F1] text-[20px] font-bold rounded-[12px] border-[2px]">인증번호 전송</button>
                    </div>
                    <div className="flex flex-col w-[519px] mt-[20px]">
                        <p className="flex text-[#52525B] font-bold">비밀번호</p>
                        <input type="password" placeholder="********" className="h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 border-[#E4E4E7]" />
                        <p className="text-[#9A9AA3]">영문 숫자 포함 8자 이상</p>
                    </div>
                    <div className="w-[519px] flex flex-col mt-[20px]">
                        <p className="text-[#52525B] font-bold">비밀번호 확인</p>
                        <input type="password" placeholder="********" className="h-[54px] pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />
                    </div>
                    <div className="flex flex-col w-[519px] mt-[20px]">
                        <p className="text-[#52525B] font-bold">닉네임</p>
                        <input type="text" placeholder="학습자 닉네임을 입력하세요." className="h-[54px] items-center pl-[20px] mt-[11px] text-[20px] text-[#9A9AA3] border-[2px] rounded-[8px] border-[#E4E4E7]" />
                    </div>

                    <div className="w-[519px] mt-[47px]">
                        <label className="agreement flex items-center">

                            <div className="cursor-pointer w-[24px] h-[24px] border-2 rounded border-[#6366F1]">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    className="hidden"
                                    onChange={(e) => setChecked(e.target.checked)}
                                />
                            </div>
                            <span className="text-[#52525B]">
                                <span className="link pl-[7px] font-bold text-[#6366F1]">이용약관</span> 및{" "}
                                <span className="link font-bold text-[#6366F1]">개인정보 처리방침</span>에 동의합니다.
                            </span>
                        </label>
                        <button className="hover:bg-[#6366F1] hover:text-white text-[#9D9ED0] cursor-pointer w-[519px] h-[57px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]
                        mt-[20px]"
                            onClick={() => {
                                navigate("/home")
                            }}><span className="text-[24px] font-bold ">회원가입</span></button>
                    </div>
                    <p className="text-[#52525B] mt-[71px]">이미 계정이 있으신가요? {" "}
                        <button onClick={() => {
                            navigate("/")
                        }}>
                            <span className="cursor-pointer text-[#6366F1] font-bold mt-[20px]">로그인</span>
                        </button>
                    </p>
                </div >
                {/*white box 끝 */}
                < p className="mt-[44px]" >©2026LearningLM</p >
            </div >
        </>
    )
}