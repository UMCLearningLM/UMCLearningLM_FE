import { useEffect, useState } from "react";
{/* npm install react-icons */ }
import axios from "axios";
import { useNavigate } from "react-router-dom"

export function PwFind() {
    const navigate = useNavigate();
    //이메일 인증
    const [email, setEmail] = useState("");
    const [emailState, setEmailState] = useState<"basic" | "notEnroll" | "success">("basic");
    const [emailForm, setEmailForm] = useState(false);
    const [code, setCode] = useState("");
    //이메일 인증
    //이메일 인증 확인
    const [emailCheck, setEmailCheck] = useState<"basic" | "false" | "true">("basic");
    // 이메일 인증 완료 후 받은 임시 토큰
    const [temporaryAccessToken, setTemporaryAccessToken] = useState("");

    //인증번호 보낸 여부
    const [isSendCode, setIsSendCode] = useState(false);
    //인증 남은 시간
    const [count, setCount] = useState(180);

    //회원가입 버튼 클릭시
    const [verifiedStatus, setVerifiedStatus] = useState<
        "none" | "sendCode" | "fail" | "succ" | "emailError" | "emailcertificationNo">("none");



    const sendEmail = async () => {
        // console.log("인증번호 전송 버튼 클릭");


        try {
            const res = await axios.post(
                "http://3.35.22.232:8080/api/auth/email/request",
                {
                    verificationType: "NON_LOGIN",
                    purpose: "SIGNUP",
                    email: email,
                }
            );
            console.log("인증번호 전송 성공");
            console.log("응답 status:", res.status);
            console.log("응답 data:", JSON.stringify(res.data, null, 2));
            setEmailCheck("true");
            setIsSendCode(true);
            setVerifiedStatus("sendCode");
            setCount(180);
        }
        catch (error) {
            console.log("인증번호 전송 실패");
            console.log(error);
            setEmailCheck("false");
        }
    }
    useEffect(() => {
        if (!isSendCode) return;
        if (count <= 0) {
            alert("인증시간 만료");
            setIsSendCode(false);
            return;
        }
        //1초마다 카운트-1 표시
        const timer = setTimeout(() => {
            setCount((prev) => prev - 1);
        }, 1000);
        //이전 타이머 제거
        return () => clearTimeout(timer);
    }, [count, isSendCode]);


    //비밀번호 변경
    const [pw, setPw] = useState("");
    const [pwCheck, setPwCheck] = useState("");
    const [pwNull, setPwNull] = useState<"basic" | "false" | "true">("basic");

    //비밀번호 인증
    const [pwOk, setPwOk] = useState(false);

    const emailFind = async () => {
        try {
            const res = await axios.post(
                "http://3.35.22.232:8080/api/auth/email/request",
                {
                    verificationType: "NON_LOGIN",
                    purpose: "SIGNUP",
                    email: email,
                }
            );
            console.log("이메일 찾기 성공");
            setEmailState("success");
            console.log(emailState);
            console.log(emailForm);

            console.log("응답 status:", res.status);
            console.log("응답 data:", JSON.stringify(res.data, null, 2));
        }
        catch (error) {
            console.log("이메일 찾기 실패");
            setEmailState("notEnroll");
            console.log(emailState);
            console.log(emailForm);
        }

    }
    useEffect(() => {
        if (0 < email.length) {
            setEmailForm(true);
        } else {
            setEmailForm(false);
        }
    }, [email]);

    const verifyCode = async () => {
        //이메일&&인증번호 백엔드 전송
        try {
            const res = await axios.post(
                "http://3.35.22.232:8080/api/auth/email/verify",
                {
                    verificationType: "NON_LOGIN",
                    purpose: "SIGNUP",
                    email: email,
                    code: code,
                }
            )
            console.log("이메일 인증 성공");
            console.log("응답 data: ", res.data);
            const temporaryToken = res.data.result.temporaryAccessToken;
            setTemporaryAccessToken(temporaryToken);
            setIsSendCode(false);
            setVerifiedStatus("succ");
        } catch (error) {
            console.log("이메일 인증 성공");
            console.log(error);

            setVerifiedStatus("fail");
        }

    }
    //회원가입 클릭 시 이메일 인증 여부에 따른 상태값

    const renderVerifyCode = () => {

        switch (verifiedStatus) {
            case "none":
                return (
                    <>
                        <button className="hover:bg-[#3A3DC2] hover:border-[#3A3DC2] cursor-pointer w-[145px] h-[54px] border-[#6366F1] mt-[15px] bg-[#6366F1] text-white text-[20px] font-bold rounded-[12px] border-[2px]"
                            onClick={() => {
                                sendEmail()
                                //api 완성되면 제거 ((; 테스트용 생성))
                                if (emailCheck == "true") {
                                    setIsSendCode(true);
                                    setVerifiedStatus("sendCode");
                                }
                            }}
                        >인증번호 전송</button>

                    </>
                )
            case "sendCode":
                return (
                    <>
                        <input type="text"
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="인증번호 6자리를 입력해주세요." className="hover:border-[#666666] h-[54px] flex items-center pl-[20px] mt-[15px] rounded-[8px] border-2 border-[#E4E4E7]" />
                        <div className="flex justify-center items-center">
                            <p className="text-[#666] my-[15px]">인증번호를 받지 못하셨나요?
                                <span className="cursor-pointer text-[#6366F1] ml-[12px]"
                                    onClick={() => {
                                        console.log("이메일 재전송")
                                        sendEmail()
                                    }
                                    }
                                >인증번호 재전송</span>
                            </p>
                            <span className="font-bold text-[#EF8888] ml-[98px]"
                            >{Math.floor(count / 60)}:{String(count % 60).padStart(2, "0")}
                            </span>
                        </div>
                        <button className="hover:bg-[#6366F1] hover:text-white cursor-pointer w-[112px] h-[54px] border-[#6366F1] mt-[15px] text-[#6366F1] text-[20px] font-bold rounded-[12px] border-[2px]"
                            onClick={verifyCode}
                        >인증 완료</button>
                    </>
                )
            case "fail":
                return (
                    <>
                        <input type="text"
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="인증번호 6자리를 입력해주세요." className="h-[54px] flex items-center pl-[20px] mt-[15px] rounded-[8px] border-2 border-[#F8A3A3]" />
                        <p className="text-[#EF8888] font-bold mt-[15px]">인증번호가 유효하지 않습니다. 다시 입력해주세요.</p>
                        <div className="flex justify-center items-center">
                            <p className="text-[#666] my-[15px]">인증번호를 받지 못하셨나요?
                                <span className="cursor-pointer text-[#6366F1] ml-[12px]"
                                    onClick={sendEmail}
                                >인증번호 재전송</span>
                            </p>
                            <span className="font-bold text-[#EF8888] ml-[98px]"
                            >{Math.floor(count / 60)}:{String(count % 60).padStart(2, "0")}
                            </span>
                        </div>
                        <button className="hover:bg-[#6366F1] hover:text-white cursor-pointer w-[112px] h-[54px] border-[#6366F1] mt-[15px] text-[#6366F1] text-[20px] font-bold rounded-[12px] border-[2px]"
                            onClick={verifyCode}
                        >인증 완료</button>
                    </>
                )
            case "succ":
                return (
                    <p className="text-[#5FAA81] font-bold mt-[15px]">인증을 완료했습니다.</p>
                )
            case "emailError":
                return (
                    <>
                        <p className="text-[#EF8888] my-[15px]">유요한 이메일이 아닙니다. 다시 작성해 주세요.</p>
                        <button className="hover:bg-[#3A3DC2] hover:border-[#3A3DC2] cursor-pointer w-[145px] h-[54px] border-[#] bg-[#6366F1] text-white text-[20px] font-bold rounded-[12px] border-[2px]"
                            onClick={() => {
                                sendEmail();
                                //api 완성되면 제거 ((; 테스트용 생성))
                                // setIsSendCode(true)
                            }}
                        >
                            인증번호 전송</button>
                    </>
                )
            case "emailcertificationNo":
                return (
                    <>
                        <button className="hover:bg-[#3A3DC2] hover:border-[#3A3DC2] cursor-pointer w-[145px] h-[54px] mt-[11px] border-[#] bg-[#6366F1] text-white text-[20px] font-bold rounded-[12px] border-[2px]"
                            onClick={() => {
                                sendEmail();
                                //api 완성되면 제거 ((; 테스트용 생성))
                                setIsSendCode(true)
                            }}
                        >
                            인증번호 전송</button>
                        <p className="text-[#EF8888] font-bold my-[11px]">이메일 인증을 완료해주세요.</p>
                    </>
                )
        }

    }


    //----------------비밀번호 확인-----------------

    //비밀번호 확인
    //validatePw(pw) == false  -> 유효
    //               == true   -> 유효하지 않음
    const validatePw = (
        value: string,
    ) => {
        const pwRegex =
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

        return pwRegex.test(value);
    }

    useEffect(() => {
        const hasBothPasswords =
            pw.length > 0 &&
            pwCheck.length > 0;

        if (!hasBothPasswords) {
            setPwNull("true");
            setPwOk(false);
            return;
        }

        setPwNull("false");

        setPwOk(
            pw === pwCheck &&
            validatePw(pw),
        );
    }, [pw, pwCheck]);

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
            <div className="min-h-screen flex flex-col items-center bg-[#F5F5F7] text-[#52525B] text-[18px] py-[92px]">
                {/* branding */}
                <div className="px-[10px] flex flex-col items-center mb-[38px]">
                    <div className="flex flex-row gap-[8px]">
                        <div className="w-[39px] h-[39px] flex flex-col rounded-[8px] bg-[#6366F1] justify-center items-center
                        text-[24px] font-bold text-[#FFF]
                        ">L</div>
                        <p className="text-[#27272A] text-[25px] font-bold">LearningLM</p>
                    </div>
                    <p className="mt-[10px] tracking-tighter text-[15px] text-[#52525B]">AI활용 흐름을 블록형 튜토리얼로 배우는 플랫폼</p>
                </div>
                {/*white box */}
                <div className="bg-white w-[600px] min-h-[531px] flex flex-col items-center px-[10px] pt-[39px] pb-[50px] rounded-[12px]
                border-[1px] border-[#E4E4E7]">
                    {/* title */}
                    {emailState != "success" ?
                        (<>
                            <p className="w-[519px] text-[28px] font-bold text-[#27272A] tracking-tighter">비밀번호 찾기</p>
                            <p className="w-[519px] mt-[3px] text-[14px] text-[#52525B] tracking-tighter">이메일을 입력해주세요.</p>
                            {/*main content */}
                            {/*email */}
                            {/* <div className="flex flex-col mt-[38px] w-[519px]">
                                <p className="text-[15px] font-bold tracking-tighter">이메일</p>
                                <input type="email"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    value={email}
                                    placeholder="you@example.com"
                                    className={`hover:border-[#666666] h-[50px] flex items-center pl-[20px] mt-[8px] mb-[10px] rounded-[8px] border-2 ${emailState == "notEnroll" ? "border-[#F8A3A3]" : "border-[#E4E4E7]"}`} />
                                {emailState == "notEnroll" && (
                                    <p className="font-bold text-[#EF8888] mt-[15px]">등록되지 않은 이메일입니다. 다시 입력해주세요.</p>
                                )}
                                <input type="email"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    value={email}
                                    placeholder="you@example.com"
                                    className={`hover:border-[#666666] h-[50px] flex items-center pl-[20px] mt-[2px] mb-[10px] rounded-[8px] border-2 ${emailState == "notEnroll" ? "border-[#F8A3A3]" : "border-[#E4E4E7]"}`} />
                                {emailState == "notEnroll" && (
                                    <p className="font-bold text-[#EF8888] mt-[15px]">등록되지 않은 이메일입니다. 다시 입력해주세요.</p>
                                )}

                            </div> */}
                            <div className="flex flex-col mt-[47px] w-[519px]">
                                <p className="font-bold text-[#52525B]">이메일</p>
                                <input type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com" className={`hover:border-[#666666] h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 ${verifiedStatus != "emailcertificationNo" ? "border-[#E4E4E7]" : "border-[#F8A3A3]"}`} />

                                {renderVerifyCode()}
                            </div>
                            <button className="cursor-pointer 
                        hover:bg-[#3A3DC2] text-white w-[519px] h-[57px] bg-[#6366F1] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
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
                                        className={`hover:border-[#666666] h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 ${(pw != pwCheck) || (!validatePw(pw) && pwNull == "basic")
                                            ? "border-[#F8A3A3]"
                                            : "border-[#E4E4E7]"}`} />
                                    <p className="text-[#9A9AA3]">영문 숫자 포함 8자 이상</p>
                                    {((pw.length > 0 && pw.length < 8) && pwNull == "basic") && (
                                        <p className="text-[#EF8888] font-bold mt-[11px]">
                                            비밀번호는 영문·숫자 포함 8자 이상 작성해주세요.
                                        </p>
                                    )}
                                    {(!validatePw(pw) && (pw.length > 0 && pwCheck.length > 0)) && (
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
                                        className={`hover:border-[#666666] h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 ${pw == pwCheck ? "border-[#E4E4E7]" : "border-[#F8A3A3]"}`} />
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