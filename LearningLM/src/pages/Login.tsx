import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
{/* npm install react-icons */ }
import { useNavigate } from "react-router-dom";
import axios from "axios";
{/*npm install axios */ }

export function Login() {



    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [emailState, setEmailState] = useState<"basic" | "incorrect" | "success">("basic");
    const [pwCheckState, setPwCheckState] = useState<"basic" | "incorrect" | "success">("basic");
    const [pwNumFail, setPwNumFail] = useState<"basic" | "incorrect" | "success">("basic");

    const login = async () => {
        // if (email == "sam" && pw == "12345678") {
        //     navigate("/home");
        // }
        // else {
        //     console.log("로그인 실패");
        //     if (email != "sam") {
        //         setEmailState("incorrect");
        //     } else {
        //         setEmailState("success");
        //     }
        //     if (pw != "12345678") {
        //         setPwCheckState("incorrect");
        //     } else {
        //         setPwCheckState("success");
        //     }

        //     if (0 < pw.length && pw.length < 8) {
        //         setPwNumFail("incorrect");
        //     } else {
        //         setPwNumFail("success");
        //     }
        //     // console.log("emailState", emailState);
        //     // console.log("pwCheckState", pwCheckState);
        //     // console.log("pwNumFail", pwNumFail);
        // }
        try {
            const response = await axios.post("/auth/login", {
                email,
                password: pw,
                rememberMe: true
            });

            console.log(response.data);

            navigate("/home");

        } catch (error) {
            console.log(error);
        }

    }





    return (
        <>
            <div className="min-h-screen flex flex-col items-center bg-[#F5F5F7] text-[#464646] text-[18px] py-[100px]">
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
                <div className="bg-white w-[600px] min-h-[791px] flex flex-col items-center px-[10px] py-[50px] rounded-[12px]">
                    {/* title */}
                    <div className="flex flex-col w-[529px]">
                        <p className="text-[32px] font-bold text-[#27272A]">로그인</p>
                        <p className="text-[#52525B] mt-[7px]">학습을 이어서 진행하려면 로그인하세요.</p>
                    </div>
                    {/*main content */}
                    {/*email */}
                    <div className="flex flex-col mt-[47px] w-[519px]">
                        <p className="text-[24px]">이메일</p>
                        <input type="email"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            value={email}
                            placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />
                        {emailState == "incorrect" && (
                            <>
                                <p className="mt-[11px] font-bold text-[#EF8888]">이메일이 맞지 않습니다. 다시 입력해주세요.</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col w-[519px] mt-[30px]">
                        <p className="text-[24px]">비밀번호</p>
                        <input type="password"
                            onChange={(e) => {
                                setPw(e.target.value);
                            }}
                            value={pw}
                            placeholder="********" className="h-[54px] flex items-center rounded-[8px] mt-[11px] pl-[20px] border-2 border-[#E4E4E7]" />
                        {pwCheckState == "incorrect" && (
                            <>
                                <p className="mt-[11px] font-bold text-[#EF8888]">비밀번호가 맞지 않습니다. 다시 입력해주세요.</p>
                            </>
                        )}
                        {pwNumFail == "incorrect" && (
                            <>
                                <p className="mt-[11px] font-bold text-[#EF8888]">비밀번호 8자리 이상 입력해주세요.</p>
                            </>
                        )}
                    </div>

                    {/*login state && login btn */}
                    <div className="w-[519px]">
                        <label className="agreement flex items-center my-[30px]">
                            <div className="cursor-pointer w-[24px] h-[24px] border-2 rounded border-[#6366F1]">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    className="hidden"
                                    onChange={(e) => setChecked(e.target.checked)}
                                />
                            </div>
                            <span className="ml-[10px]">
                                로그인 상태 유지
                            </span>
                        </label>
                        <button className="hover:bg-[#6366F1] hover:text-white text-[#9D9ED0] cursor-pointer w-[519px] h-[57px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
                            onClick={() => {
                                // navigate("/home")
                                login();
                            }}>
                            <span className="text-[24px] font-bold ">로그인</span>
                        </button>
                    </div>
                    {/*login state && login btn 끝*/}
                    <div className="flex items-center w-[519px] my-[34px]">
                        <div className="flex-1 h-px bg-[#E4E4E7]" />
                        <span className="mx-[16px] text-[#9A9AA3] text-[18px]">
                            또는
                        </span>
                        <div className="flex-1 h-px bg-[#E4E4E7]" />
                    </div>
                    <button className="w-[522px] h-[60px] flex items-center justify-center gap-[10px] rounded-[8px] border-2 border-[#E4E4E7]">
                        <FcGoogle size={32} />
                        <span className="cursor-pointer text-[20px] font-bold text-[#27272A]">
                            Google 계정으로 계속하기
                        </span>
                    </button>
                    <div>
                        <p className="text-[#52525B] mt-[26px]">아직 계정이 없으신가요? {" "}
                            <button onClick={() => { navigate("/") }}>
                                <span className="cursor-pointer text-[#6366F1] font-bold mt-[20px]">회원가입</span>
                            </button>
                        </p>
                        <p className="text-[#52525B] mt-[14px]">비밀번호를 잊으셨나요? <span className="text-[#6366F1] font-bold mt-[20px]">비밀번호 찾기</span></p>
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