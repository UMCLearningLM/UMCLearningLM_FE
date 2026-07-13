import { Box, Check, CircleCheckBig } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Register() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    //이메일 인증
    const [email, setEmail] = useState("");
    const regex = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    const [emailCheck, setEmailCheck] = useState(false);
    //비밀번호 인증
    const [pw, setPw] = useState("");
    const [pwCheck, setPwCheck] = useState("");
    const [pwOk, setPwOk] = useState(false);
    //인증번호
    const [code, setCode] = useState("");
    //인증번호 보낸 여부
    const [isSendCode, setIsSendCode] = useState(false);
    //인증 남은 시간
    const [count, setCount] = useState(180);

    const [pwNull, setPwNull] = useState(false);

    const [name, setName] = useState("");
    const [nameNull, setNameNull] = useState(false);

    //----------------동의 확인-----------------
    const [ckBox, setCkBox] = useState(false);
    const [noAgree, setNoAgree] = useState(false);
    const [mem, setMem] = useState(false);


    const [verifiedStatus, setVerifiedStatus] = useState<
        "none" | "sendCode" | "fail" | "succ" | "emailError" | "emailcertificationNo">("none");

    const sendEmail = async () => {
        console.log(email);
        if (!regex.test(email.trim())) {
            console.log("이메일 검사 실패");
            setEmailCheck(false);
            setVerifiedStatus("emailError");
            return;
        }

        // console.log("sendEmail 실행");
        // console.log("180으로 초기화");
        setEmailCheck(true);
        setCount(180);
        try {
            const res = await axios.post("/auth/signup", {
                email: email,
                password: pw,
                nickname: name,
                termsAgreed: !noAgree,
            });
            console.log(res.data);

        } catch (error) {
            console.log(error);
        }

        if (res.status === 200) {
            console.log("180으로 초기화");
            setCount(180);
            // setIsSendCode(true);
            setVerifiedStatus("sendCode");

            alert("인증번호 발송 완료");
        } else if (res.status === 401) {
            alert("이미 존재하는 이메일입니다.");
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

    const verifyCode = async () => {
        //이메일&&인증번호 백엔드 전송
        if (code === "123456") {
            // setIsVerified(true);
            setIsSendCode(false);
            // setIsSuccessVerified(true);
            // setIsFailVerified(false);
            setVerifiedStatus("succ");
            // alert("인증 완료");
        } else {
            // setIsFailVerified(true);
            setVerifiedStatus("fail");
            // alert("인증번호 올바르지 않음");
        }

        const emailSec = (<>
            <>
                <p className="font-bold text-[#52525B]">이메일</p>
                <input type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />


                <button className="hover:bg-[#6366F1] hover:text-white cursor-pointer w-[145px] h-[54px] border-[#6366F1] mt-[15px] text-[#6366F1] text-[20px] font-bold rounded-[12px] border-[2px]"
                    onClick={() => {
                        console.log(email)
                        sendEmail()

                        //api 완성되면 제거 ((; 테스트용 생성))
                        if (emailCheck == true) {
                            setIsSendCode(true);
                            setVerifiedStatus("sendCode");
                        }
                        // setIsSendCode(true)
                        // setVerifiedStatus("sendCode");
                    }}
                >인증번호 전송</button>
            </>
        </>)

        // const res = await fetch("/api/email/verify", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         email,
        //         code,
        //     }),
        // });

        // if (res.ok) {
        //     setIsVerified(true);
        // }
    }

    const renderVerifyCode = () => {
        switch (verifiedStatus) {
            case "none":
                return (
                    <>
                        <p className="font-bold text-[#52525B]">이메일</p>
                        <input type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />


                        <button className="hover:bg-[#6366F1] hover:text-white cursor-pointer w-[145px] h-[54px] border-[#6366F1] mt-[15px] text-[#6366F1] text-[20px] font-bold rounded-[12px] border-[2px]"
                            onClick={() => {
                                console.log(email)
                                sendEmail()

                                //api 완성되면 제거 ((; 테스트용 생성))
                                if (emailCheck == true) {
                                    setIsSendCode(true);
                                    setVerifiedStatus("sendCode");
                                }
                                // setIsSendCode(true)
                                // setVerifiedStatus("sendCode");
                            }}
                        >인증번호 전송</button>
                    </>
                )
            case "sendCode":
                return (
                    <>
                        <p className="font-bold text-[#52525B]">이메일</p>
                        <input type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />

                        <input type="text"
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="인증번호 6자리를 입력해주세요." className="h-[54px] flex items-center pl-[20px] mt-[15px] rounded-[8px] border-2 border-[#E4E4E7]" />
                        <div className="flex justify-center items-center">
                            <p className="text-[#666] my-[15px]">인증번호를 받지 못하셨나요?
                                <span className="cursor-pointer text-[#6366F1] ml-[12px]"
                                    onClick={() => {
                                        console.log("이메일 재전송")
                                        sendEmail()
                                        setIsSendCode(true)
                                        setVerifiedStatus("sendCode");
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
                        <p className="font-bold text-[#52525B]">이메일</p>
                        <input type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />

                        <input type="text"
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="인증번호 6자리를 입력해주세요." className="h-[54px] flex items-center pl-[20px] mt-[15px] rounded-[8px] border-2 border-[#F8A3A3]" />
                        <p className="text-[#F8A3A3] font-bold mt-[15px]">인증번호가 유효하지 않습니다. 다시 입력해주세요.</p>
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
                    <>
                        <>
                            <p className="font-bold text-[#52525B]">이메일</p>
                            <input type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />

                            <p className="text-[#5FAA81] font-bold mt-[15px]">인증을 완료했습니다.</p>
                        </>
                    </>
                )
            case "emailError":
                return (
                    <>
                        <p className="font-bold text-[#52525B]">이메일</p>
                        <input type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#F8A3A3]" />
                        <p className="text-[#F8A3A3] my-[15px]">유요한 이메일이 아닙니다. 다시 작성해 주세요.</p>
                        <button className="hover:bg-[#6366F1] hover:text-white cursor-pointer w-[145px] h-[54px] border-[#] text-[#6366F1] text-[20px] font-bold rounded-[12px] border-[2px]"
                            onClick={() => {
                                sendEmail();
                                //api 완성되면 제거 ((; 테스트용 생성))
                                setIsSendCode(true)
                                setVerifiedStatus("sendCode");
                            }}
                        >
                            인증번호 전송</button>
                    </>
                )
            case "emailcertificationNo":
                return (
                    <>
                        <p className="font-bold text-[#52525B]">이메일</p>
                        <input type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#F8A3A3]" />
                        <button className="hover:bg-[#6366F1] hover:text-white cursor-pointer w-[145px] h-[54px] mt-[11px] border-[#] text-[#6366F1] text-[20px] font-bold rounded-[12px] border-[2px]"
                            onClick={() => {
                                sendEmail();
                                //api 완성되면 제거 ((; 테스트용 생성))
                                setIsSendCode(true)
                                setVerifiedStatus("sendCode");
                            }}
                        >
                            인증번호 전송.</button>
                        <p className="text-[#F8A3A3] my-[11px]">이메일 인증을 완료해주세요.</p>
                    </>
                )
        }

    }

    //----------------비밀번호 확인-----------------

    //비밀번호 확인
    useEffect(() => {
        if (pw != "") {
            if (pw === pwCheck) {
                setPwOk(pw === pwCheck);
                if (pwOk) {
                    setPwNull(false);
                }
            } else {
                setPwOk(false);
            }

        }
    }, [pw, pwCheck, pwOk]);

    //----------------닉네임 확인-----------------
    useEffect(() => {
        if (name != "") {
            setNameNull(false);
        }
    }, [name])

    //----------------동의 확인-----------------
    useEffect(() => {
        if (!ckBox) {
            setNoAgree(true);
            // setMem(true);
            // console.log("ckBox", ckBox);
            // console.log("noAgree", noAgree);
        } else {
            // console.log("ckBox", ckBox);
            // console.log("noAgree", noAgree);
            setNoAgree(false);
            setMem(true);
        }
    }, [ckBox]);

    //----------------회원가입 확인-----------------
    const memberOk = () => {
        if (verifiedStatus != "succ") {
            setVerifiedStatus("emailcertificationNo");
        }
        if (!pwOk) {
            setPwNull(true);
        }
        if (!name) {
            setNameNull(true);
        }
        if (!ckBox) {
            setMem(true);
            setNoAgree(true);
        }

        if (verifiedStatus == "succ" && pwOk && name && ckBox) {
            //api로 회원정보 등록 코드
            {/** 
                
                */ }
            //
            navigate("/home")
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
                        {/* <p className="font-bold text-[#52525B]">이메일</p>
                        <input type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" className="h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" /> */}

                        {renderVerifyCode()}


                    </div>
                    {pwNull ? (
                        <>
                            <div className="flex flex-col w-[519px] mt-[20px]">
                                <p className="flex text-[#52525B] font-bold">비밀번호</p>
                                <input type="password"
                                    onChange={(e) => {
                                        setPw(e.target.value)
                                        console.log(pw);
                                    }}
                                    placeholder="********" className="h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 border-[#F8A3A3]" />
                                <p className="text-[#9A9AA3]">영문 숫자 포함 8자 이상</p>
                            </div>
                            <div className="w-[519px] flex flex-col mt-[20px]">
                                <p className="text-[#52525B] font-bold">비밀번호 확인</p>
                                <input type="password"
                                    onChange={(e) => {
                                        setPwCheck(e.target.value)
                                        // console.log(pw);
                                        // console.log(pwCheck);
                                    }}
                                    placeholder="********" className="h-[54px] pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#F8A3A3]" />
                                {pwOk ? (
                                    <>
                                        <p className="font-bold text-[#5FAA81] mt-[11px]">입력한 비밀번호가 맞습니다.</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold text-[#F8A3A3] mt-[11px]">입력한 비밀번호가 같지 않습니다.</p>
                                    </>
                                )}
                            </div>
                        </>)
                        : (
                            <>
                                <div className="flex flex-col w-[519px] mt-[20px]">
                                    <p className="flex text-[#52525B] font-bold">비밀번호</p>
                                    <input type="password"
                                        onChange={(e) => {
                                            setPw(e.target.value)
                                            // console.log(pw);
                                        }}
                                        placeholder="********" className="h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 border-[#E4E4E7]" />
                                    <p className="text-[#9A9AA3]">영문 숫자 포함 8자 이상</p>
                                </div>
                                <div className="w-[519px] flex flex-col mt-[20px]">
                                    <p className="text-[#52525B] font-bold">비밀번호 확인</p>
                                    <input type="password"
                                        onChange={(e) => {
                                            setPwCheck(e.target.value)
                                            // console.log(pw);
                                            // console.log(pwCheck);
                                        }}
                                        placeholder="********" className="h-[54px] pl-[20px] mt-[11px] rounded-[8px] border-2 border-[#E4E4E7]" />
                                    {pwOk && (
                                        <>
                                            <p className="font-bold text-[#5FAA81] mt-[11px]">입력한 비밀번호가 맞습니다.</p>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                    <div className="flex flex-col w-[519px] mt-[20px]">
                        <p className="text-[#52525B] font-bold">닉네임</p>
                        {nameNull ? (
                            <>
                                <input type="text"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    placeholder="학습자 닉네임을 입력하세요." className="h-[54px] items-center pl-[20px] mt-[11px] text-[20px] text-[#9A9AA3] border-[2px] rounded-[8px] border-[#F8A3A3]" />
                                <p className="font-bold text-[#F8A3A3] mt-[11px]">닉네임이 입력되지 않았습니다.</p>
                            </>
                        ) : (
                            <>
                                <input type="text"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    placeholder="학습자 닉네임을 입력하세요." className="h-[54px] items-center pl-[20px] mt-[11px] text-[20px] text-[#9A9AA3] border-[2px] rounded-[8px] border-[#E4E4E7]" />
                            </>
                        )}
                    </div>

                    <div className="w-[519px] mt-[47px]">
                        <label className="cursor-pointer agreement flex items-center">


                            <input
                                type="checkbox"
                                checked={checked}
                                className="hidden"
                                onChange={(e) => setChecked(e.target.checked)}
                                onClick={() => {
                                    // console.log("체크 클릭");
                                    setCkBox(!ckBox);
                                    // console.log("ckBox", ckBox);
                                }}
                            />
                            <div className={`w-[24px] h-[24px] flex items-center justify-center text-center border-2 rounded border-[#6366F1] 
                            ${checked ? "bg-[#6366F1]" : "border-[#6366F1]"
                                }`}
                            >
                                {checked && <Check size={18} className="text-white stroke-[3]" />}
                            </div>
                            <span className="text-[#52525B]">
                                <span className="link pl-[7px] font-bold text-[#6366F1]">이용약관</span> 및{" "}
                                <span className="link font-bold text-[#6366F1]">개인정보 처리방침</span>에 동의합니다.
                            </span>
                        </label>
                        {noAgree && mem && (
                            <p className="font-bold text-[#F8A3A3] mt-[20px]">이용약관 및 개인정보 처리에 체크해주세요.</p>
                        )}

                        <button className="hover:bg-[#6366F1] hover:text-white text-[#9D9ED0] cursor-pointer w-[519px] h-[57px] mt-[20px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
                            onClick={() => {
                                // navigate("/home")
                                memberOk();
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