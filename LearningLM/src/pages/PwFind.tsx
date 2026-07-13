import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
{/* npm install react-icons */ }
import { useNavigate } from "react-router-dom"

export function PwFind() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailState, setEmailState] = useState<"basic" | "notEnroll">("basic");
    const [emailForm, setEmailForm] = useState(false);
    const [pw, setPw] = useState("");
    const [pwChange, setPwChange] = useState("");
    const [pwState, setPwState] = useState(false);
    const emailFind = () => {
        if (email == "123" && emailForm) {
            console.log("이메일 찾기 성공");
            setPwState(true);
        } else {
            console.log("이메일 찾기 실패");
            setEmailState("notEnroll");
            // setPwState(false);
        }
    }
    useEffect(() => {
        if (0 < email.length) {
            setEmailForm(true);
        } else {
            setEmailForm(false);
        }
    }, [email]);

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
                    <p className="mt-[14px]">AI활용 흐름을 블록형 튜토리얼로 배우는 플랫폼</p>
                </div>
                {/*white box */}
                <div className="bg-white w-[600px] min-h-[531px] flex flex-col items-center px-[10px] py-[50px] rounded-[12px]">
                    {/* title */}
                    <p className="w-[519px] text-[32px] font-bold text-[#27272A]">비밀번호 찾기</p>
                    {pwState ?
                        (<>
                            <p className="w-[519px] mt-[7px]">이메일을 입력해주세요.</p>
                            {/*main content */}
                            {/*email */}
                            <div className="flex flex-col my-[47px] w-[519px]">
                                <p className="font-bold">이메일</p>
                                <input type="email"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />
                            </div>
                            <button className="cursor-pointer hover:bg-[#6366F1]
                        hover:text-white text-[#9D9ED0] w-[519px] h-[57px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
                                onClick={() => {
                                    emailFind();
                                }}>
                                <span className=" text-[24px] font-bold ">다음</span>
                            </button>
                        </>) :
                        (<>
                            <p className="w-[519px] mt-[7px]">변경할 비밀번호를 입력해주세요.</p>
                            {/*main content */}
                            {/*email */}
                            <div className="flex flex-col mt-[47px] w-[519px]">
                                <p className="font-bold">비밀번호</p>
                                <input type="password"
                                    onChange={(e) => {
                                        setPw(e.target.value);
                                    }}
                                    className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />
                                <p className="mt-[11px] text-[#9A9AA3]">영문,숫자 포함 8자 이상</p>
                            </div>
                            <div className="flex flex-col mt-[20px] w-[519px]">
                                <p className="font-bold">비밀번호 확인</p>
                                <input type="passwordCheck"
                                    onChange={(e) => {
                                        setPwChange(e.target.value);
                                    }}
                                    className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />
                            </div>
                            <button className="cursor-pointer hover:bg-[#6366F1]
                        hover:text-white text-[#9D9ED0] mt-[47px] w-[519px] h-[57px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
                                onClick={() => {
                                    // emailFind();
                                }}>
                                <span className=" text-[24px] font-bold ">변경하기</span>
                            </button>
                        </>)}

                    <div>
                        <p className=" mt-[71px]">계정이 없으신가요? {" "}
                            <button onClick={() => { navigate("/") }}>
                                <span className="cursor-pointer text-[#6366F1] font-bold mt-[20px]">회원가입</span>
                            </button>
                        </p>
                        <p className="mt-[14px]">이미 계정이 있으신가요? <span className="text-[#6366F1] font-bold mt-[20px]">로그인</span></p>
                    </div>
                </div>
                {/*white box 끝 */}
                <div className="flex flex-row mt-[44px] text-[#9A9AA3] gap-[36px]">
                    <p>©2026LearningLM</p>
                    <p>이용약관</p>
                    <p>개인정보처리방침</p>
                </div>
            </div>

        </>
    )
}