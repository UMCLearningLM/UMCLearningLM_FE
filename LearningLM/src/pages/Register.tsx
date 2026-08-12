import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//.\gradlew bootRun 스프링부트 서버 키는 방법

export function Register() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    //이메일 인증
    const [email, setEmail] = useState("");
    //이메일 인증 확인
    const [emailCheck, setEmailCheck] = useState<"basic" | "false" | "true">("basic");
    //이메일 형식 검사
    const [emailFormErr, setEmailFormErr] = useState(false);
    // const [emailState, setEmailState] = useState<"basic" | "formErr" | "NoSame" | "formErr&NoSame" | "pass">("basic");
    //비밀번호 인증
    const [pw, setPw] = useState("");
    const [pwCheck, setPwCheck] = useState("");
    //비밀번호 통과 여부
    const [pwOk, setPwOk] = useState<"basic" | "notSame" | "same">("basic");
    //비밀번호 비었는지
    const [pwNull, setPwNull] = useState<"basic" | "null" | "notNull" | "lengNo">("basic");
    //비밀번호 형식 올바른지
    const [pwForm, setPwForm] = useState<"basic" | "formErr" | "formOk">("basic");
    //인증번호
    const [code, setCode] = useState("");

    // 이메일 인증 완료 후 받은 임시 토큰
    const [temporaryAccessToken, setTemporaryAccessToken] = useState("");

    //인증번호 보낸 여부
    const [isSendCode, setIsSendCode] = useState(false);
    //인증 남은 시간
    const [count, setCount] = useState(180);
    //닉네임 작성 여부
    const [name, setName] = useState("");
    //닉네임 비었는지
    const [nameNull, setNameNull] = useState(false);

    //----------------동의 확인-----------------
    const [ckBox, setCkBox] = useState(false);
    const [noAgree, setNoAgree] = useState(false);
    const [mem, setMem] = useState(false);

    //회원가입 버튼 클릭시
    const [verifiedStatus, setVerifiedStatus] = useState<
        "none" | "sendCode" | "fail" | "succ" | "emailError" | "emailcertificationNo">("none");

    //이메일 형식 검사
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    //인증번호


    //이메일 형식 유효한지
    useEffect(() => {
        if (0 < email.length) {
            if (!validateEmail(email)) {
                setEmailFormErr(true);
            } else {
                setEmailFormErr(false);
            }
        }
    }, [email]);
    //인증번호 전송 버튼 클릭 시
    useEffect(() => {
        if (!emailFormErr && emailCheck == "true") {
            setIsSendCode(true);
            setVerifiedStatus("sendCode");
        } else {
            // setVerifiedStatus("fail");
        }
    }, [emailFormErr, emailCheck]);


    const sendEmail = async () => {
        // console.log("인증번호 전송 버튼 클릭");

        //이메일 형식이 유효하지 않을 때
        if (!validateEmail(email)) {
            setEmailFormErr(true);
            return;
        }
        setEmailFormErr(false);

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
                        {(emailFormErr || emailCheck == "false") && (
                            <>
                                <p className="mt-[11px] font-bold text-[#EF8888]">유효한 이메일이 아닙니다. 다시 작성해 주세요.</p>
                            </>
                        )}

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
    const validatePw = (value: string) => {
        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

        return pwRegex.test(value);
    };
    useEffect(() => {
        if (pw.length === 0) {
            setPwForm("basic");
            return;
        }

        setPwForm(
            validatePw(pw)
                ? "formOk"
                : "formErr",
        );
    }, [pw]);
    //비밀번호 확인

    useEffect(() => {
        console.log("pw:", pw);
        console.log("pwCheck: ", pwCheck);
        console.log("validatePw: ", validatePw(pw));
        if (pw != "") {
            if (pw == pwCheck) {
                setPwOk("same");
            } else {
                setPwOk("notSame");
            }
            console.log("pwOk: ", pwOk);
        } else {
            setPwOk("basic");
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
        } else {
            setNoAgree(false);
            setMem(true);
        }
    }, [ckBox]);

    //----------------회원가입 확인-----------------
    const memberOk = async () => {
        console.log("pwOk: ", pwOk);
        console.log("pwNull: ", pwNull);
        console.log("pwForm: ", pwForm);

        if (verifiedStatus !== "succ") {
            setVerifiedStatus("emailcertificationNo");
            setEmailCheck("false");
        }

        if (
            pw.length > 0 &&
            !validatePw(pw)
        ) {
            setPwNull("lengNo");
        } else {
            setPwNull("basic");
        }

        if (pwOk === "basic") {
            setPwNull("lengNo");
        }

        if (!name) {
            setNameNull(true);
        }

        if (!ckBox) {
            setMem(true);
            setNoAgree(true);
        }
        // 모든 조건 통과
        if (verifiedStatus === "succ" &&
            pwOk === "same" &&
            name &&
            ckBox
        ) {
            console.log("pw =", pw);
            console.log("길이 =", pw.length);
            console.log("프론트 검증 =", validatePw(pw));
            try {
                const res = await axios.post(
                    "http://3.35.22.232:8080/api/auth/signup",
                    {
                        email: email,
                        password: pw,
                        nickname: name,
                        termsAgreed: ckBox,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${temporaryAccessToken}`,
                        },
                    }
                );

                console.log("회원가입 성공");
                console.log(res.data);

                // 회원가입 성공 후 받은 토큰
                const accessToken = res.data.result.accessToken;
                const refreshToken = res.data.result.refreshToken;

                // 토큰 저장
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                navigate("/home");

            } catch (error) {
                console.log("회원가입 실패");
                console.log(error);
            }
        }
    };
    useEffect(() => {
        if ((pw == "" || pwCheck == "") && pwNull != "lengNo")
            setPwNull("null");
    }, [pwNull]);
    // console.log("pwNull", pwNull);

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
                    <div className="flex flex-col gap-[20px]">
                        <div className="flex flex-col mt-[47px] w-[519px]">
                            <p className="font-bold text-[#52525B]">이메일</p>
                            <input type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com" className={`hover:border-[#666666] h-[54px] flex items-center pl-[20px] mt-[11px] rounded-[8px] border-2 ${verifiedStatus != "emailcertificationNo" ? "border-[#E4E4E7]" : "border-[#F8A3A3]"}`} />

                            {renderVerifyCode()}
                        </div>
                        <div className="flex flex-col w-[519px]">
                            <p className="flex text-[#52525B] font-bold">비밀번호</p>
                            <input type="password"
                                onChange={(e) => {
                                    setPw(e.target.value)
                                }}
                                placeholder="********"
                                className={`hover:border-[#666666] h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 ${pwNull == "basic" || pwNull == "null" || pwOk == "same" ? "border-[#E4E4E7]" : "border-[#F8A3A3]"}`} />
                            <p className="text-[#9A9AA3]">영문 숫자 포함 8자 이상</p>
                            {(pwNull == "lengNo") && (
                                <p className="text-[#EF8888] font-bold mt-[11px]">
                                    비밀번호는 영문·숫자 포함 8자 이상 작성해주세요.
                                </p>
                            )}
                            {(pwForm == "formErr") && (
                                <p className="text-[#EF8888] font-bold mt-[11px]">
                                    비밀번호는 영문·숫자만 포함할 수 있습니다
                                </p>
                            )}

                        </div>
                        <div className="w-[519px] flex flex-col">
                            <p className="text-[#52525B] font-bold">비밀번호 확인</p>
                            <input type="password"
                                onChange={(e) => {
                                    setPwCheck(e.target.value)
                                }}
                                placeholder="********"
                                className={`hover:border-[#666666] h-[54px] flex items-center rounded-[8px] my-[11px] pl-[20px] border-2 ${pwNull == "basic" || pwNull == "null" || pwOk == "same" ? "border-[#E4E4E7]" : "border-[#F8A3A3]"}`} />
                            {pwNull == "null" ? (<>{pwOk == "same" ? (
                                <>
                                    <p className="font-bold text-[#5FAA81] mt-[11px]">입력한 비밀번호가 맞습니다.</p>
                                </>
                            ) : (
                                <>
                                </>
                            )}</>) : (<>{pwOk == "same" ? (
                                <>
                                    <p className="font-bold text-[#5FAA81] mt-[11px]">입력한 비밀번호가 맞습니다.</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-bold text-[#EF8888] mt-[11px]">입력한 비밀번호가 같지 않습니다.</p>
                                </>
                            )}</>)}

                        </div>

                        <div className="flex flex-col w-[519px]">
                            <p className="text-[#52525B] font-bold">닉네임</p>
                            <input type="text"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                placeholder="학습자 닉네임을 입력하세요." className={`hover:border-[#666666] h-[54px] items-center pl-[20px] mt-[11px] text-[20px] text-[#9A9AA3] border-[2px] rounded-[8px] ${nameNull ? "border-[#F8A3A3]" : "border-[#E4E4E7]"}`} />
                            {nameNull &&
                                (
                                    <p className="font-bold text-[#EF8888] mt-[11px]">닉네임이 입력되지 않았습니다.</p>
                                )
                            }
                        </div>
                    </div>
                    <div className="w-[519px] mt-[47px]">
                        <label className="cursor-pointer agreement flex items-center">
                            <input
                                type="checkbox"
                                checked={checked}
                                className="hidden"
                                onChange={(e) => setChecked(e.target.checked)}
                                onClick={() => {
                                    setCkBox(!ckBox);
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
                            <p className="font-bold text-[#EF8888] mt-[20px]">이용약관 및 개인정보 처리에 체크해주세요.</p>
                        )}
                    </div>
                    <button className="hover:bg-[#6366F1] hover:text-white text-[#9D9ED0] cursor-pointer w-[519px] h-[57px] mt-[20px] items-center justify-center rounded-[8px] border-1 border-[#6366F1]"
                        onClick={() => {
                            memberOk();
                        }}><span className="cursor-pointer text-[24px] font-bold ">회원가입</span></button>

                    <p className="text-[#52525B] mt-[71px]">이미 계정이 있으신가요? {" "}
                        <button onClick={() => {
                            navigate("/login")
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