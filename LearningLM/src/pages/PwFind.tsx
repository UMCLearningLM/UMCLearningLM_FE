import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
{/* npm install react-icons */ }
import { useNavigate } from "react-router-dom"

export function PwFind() {
    const navigate = useNavigate();
    //이메일 인증
    const [email, setEmail] = useState("");
    const [emailState, setEmailState] = useState<"basic" | "notEnroll" | "success">("basic");
    const [emailForm, setEmailForm] = useState(false);
    //비밀번호 변경
    const [pw, setPw] = useState("");
    const [pwCheck, setPwCheck] = useState("");
    const [pwNull, setPwNull] = useState<"basic" | "false" | "true">("basic");
    const [pwForm, setPwForm] = useState<"basic" | "err">("basic");

    //비밀번호 인증
    const [pwOk, setPwOk] = useState(false);

    const emailFind = () => {
        if (email == "ssemilife@gmail.com" && emailForm) {
            console.log("이메일 찾기 성공");
            setEmailState("success");
            console.log(emailState);
            console.log(emailForm);
        } else {
            console.log("이메일 찾기 실패");
            setEmailState("notEnroll");
            console.log(emailState);
            console.log(emailForm);
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

    //----------------비밀번호 확인-----------------

    //비밀번호 확인
    //validatePw(pw) == false  -> 유효
    //               == true   -> 유효하지 않음
    const validatePw = (pw: string) => {
        // const pwRegex = /^[A-Za-z0-9]+$/;
        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        return pwRegex.test(email);
    }
    useEffect(() => {
        if (pw != "" && pwCheck != "") {
            setPwNull("false");
            setPwOk(pw === pwCheck);
        } else {
            setPwNull("true");
        }
    }, [pw, pwCheck, pwOk]);
    useEffect(() => {
        if (0 < pw.length) {
            setPwForm("basic");
        } else {
            setPwForm("err");
        }
    }, [email]);
    useEffect(() => {
        if (!validatePw(pw) && (pw.length >= 8) && (pwCheck.length >= 8)) {
            setPwOk(true);
        } else {
            setPwOk(false);
        }
    }, [validatePw(pw), pw, pwCheck]);

    const pwChangeFun = () => {

        if (!validatePw(pw)) {
            setPwNull("basic");
        }

        if (pwOk) {
            navigate("/home");
        } else {
            // alert("비밀번호 변경 실패");
        }
    }



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
                    {emailState != "success" ?
                        (<>
                            <p className="w-[519px] text-[32px] font-bold text-[#27272A]">비밀번호 찾기</p>
                            <p className="w-[519px] mt-[7px]">이메일을 입력해주세요.</p>
                            {/*main content */}
                            {/*email */}
                            <div className="flex flex-col my-[47px] w-[519px]">
                                <p className="font-bold">이메일</p>
                                <input type="email"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    value={email}
                                    placeholder="you@example.com"
                                    className={`h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 ${emailState == "notEnroll" ? "border-[#F8A3A3]" : "border-[#E4E4E7]"}`} />
                                {emailState == "notEnroll" && (
                                    <p className="font-bold text-[#EF8888] mt-[15px]">등록되지 않은 이메일입니다. 다시 입력해주세요.</p>
                                )}

                            </div>
                            <button className="cursor-pointer hover:bg-[#6366F1]
                        hover:text-white text-[#9D9ED0] w-[519px] h-[57px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
                                onClick={() => {
                                    emailFind();
                                }}>
                                <span className=" text-[24px] font-bold ">다음</span>
                            </button>
                        </>) :
                        (
                            <>
                                <p className="w-[519px] text-[32px] font-bold text-[#27272A]">비밀번호 변경</p>
                                <p className="w-[519px] mt-[7px]">변경할 비밀번호를 입력해주세요.</p>
                                {/*main content */}
                                {/*password */}
                                <div className="flex flex-col w-[519px] mt-[20px]">
                                    <p className="flex text-[#52525B] font-bold">비밀번호</p>
                                    <input type="password"
                                        value={pw}
                                        onChange={(e) => {
                                            setPw(e.target.value)
                                        }}
                                        placeholder="********"
                                        className={`h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 ${(pw != pwCheck) || (validatePw(pw) && pwNull == "basic") ? "border-[#F8A3A3]" : "border-[#E4E4E7]"}`} />
                                    <p className="text-[#9A9AA3]">영문 숫자 포함 8자 이상</p>
                                    {((pw.length > 0 && pw.length < 8) && pwNull == "basic") && (
                                        <p className="text-[#EF8888] font-bold mt-[11px]">
                                            비밀번호는 영문·숫자 포함 8자 이상 작성해주세요.
                                        </p>
                                    )}
                                    {(validatePw(pw) && (pw.length > 0 && pwCheck.length > 0)) && (
                                        <p className="text-[#EF8888] font-bold mt-[11px]">
                                            비밀번호는 영문·숫자만 포함할 수 있습니다
                                        </p>
                                    )}

                                </div>
                                <div className="w-[519px] flex flex-col mt-[20px]">
                                    <p className="text-[#52525B] font-bold">비밀번호 확인</p>
                                    <input type="password"
                                        onChange={(e) => {
                                            setPwCheck(e.target.value)
                                        }}
                                        placeholder="********"
                                        className={`h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 ${pw == pwCheck ? "border-[#E4E4E7]" : "border-[#F8A3A3]"}`} />
                                    {pw.length == 0 ? (<></>) : (<>{pw == pwCheck ? (
                                        <>
                                            <p className="font-bold text-[#5FAA81] mt-[11px]">입력한 비밀번호가 맞습니다.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-[#EF8888] mt-[11px]">입력한 비밀번호가 같지 않습니다.</p>
                                        </>
                                    )}</>)}

                                </div>
                                <button className="cursor-pointer hover:bg-[#6366F1]
                        hover:text-white text-[#9D9ED0] mt-[47px] w-[519px] h-[57px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
                                    onClick={() => {
                                        pwChangeFun()
                                    }}>
                                    <span className=" text-[24px] font-bold ">변경하기</span>
                                </button>
                            </>
                        )}

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
            </div >

        </>
    )
}