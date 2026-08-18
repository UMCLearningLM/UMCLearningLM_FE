import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export function Register() {
    const navigate = useNavigate();

    const [checked, setChecked] = useState(false);

    // =========================
    // 이메일
    // =========================
    const [email, setEmail] = useState("");

    const [emailCheck, setEmailCheck] = useState<
        "basic" | "false" | "true"
    >("basic");

    const [emailFormErr, setEmailFormErr] = useState(false);

    // 이미 가입된 이메일 여부
    const [emailAlreadyExists, setEmailAlreadyExists] =
        useState(false);

    // =========================
    // 비밀번호
    // =========================
    const [pw, setPw] = useState("");
    const [pwCheck, setPwCheck] = useState("");

    const [pwOk, setPwOk] = useState<
        "basic" | "notSame" | "same"
    >("basic");

    const [pwNull, setPwNull] = useState<
        "basic" | "null" | "notNull" | "lengNo"
    >("basic");

    const [pwForm, setPwForm] = useState<
        "basic" | "formErr" | "formOk"
    >("basic");

    // =========================
    // 이메일 인증번호
    // =========================
    const [code, setCode] = useState("");

    // 이메일 인증 완료 후 받은 임시 토큰
    const [temporaryAccessToken, setTemporaryAccessToken] =
        useState("");

    const [isSendCode, setIsSendCode] =
        useState(false);

    const [count, setCount] =
        useState(180);

    // =========================
    // 닉네임
    // =========================
    const [name, setName] = useState("");
    const [nameNull, setNameNull] =
        useState(false);

    // =========================
    // 약관
    // =========================
    const [ckBox, setCkBox] =
        useState(false);

    const [noAgree, setNoAgree] =
        useState(false);

    const [mem, setMem] =
        useState(false);

    // =========================
    // 이메일 인증 상태
    // =========================
    const [verifiedStatus, setVerifiedStatus] =
        useState<
            | "none"
            | "sendCode"
            | "fail"
            | "succ"
            | "emailError"
            | "emailcertificationNo"
        >("none");

    // =========================
    // 이메일 형식 검사
    // =========================
    const validateEmail = (value: string) => {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(value);
    };

    // 이메일 입력값 변경
    useEffect(() => {
        if (email.length === 0) {
            setEmailFormErr(false);
            return;
        }

        setEmailFormErr(
            !validateEmail(email)
        );

        // 이메일을 수정하면
        // 기존 중복 이메일 오류 제거
        setEmailAlreadyExists(false);

        // 이메일이 바뀌면 기존 인증도 무효 처리
        setEmailCheck("basic");
        setTemporaryAccessToken("");
        setVerifiedStatus("none");
    }, [email]);

    // =========================
    // 인증번호 전송
    // =========================
    const sendEmail = async () => {
        if (!validateEmail(email)) {
            setEmailFormErr(true);
            return;
        }

        setEmailFormErr(false);

        try {
            const res = await api.post(
                "/auth/email/request",
                {
                    verificationType: "NON_LOGIN",
                    purpose: "SIGNUP",
                    email: email,
                }
            );

            console.log(
                "인증번호 전송 성공"
            );

            console.log(
                "응답 status:",
                res.status
            );

            console.log(
                "응답 data:",
                JSON.stringify(
                    res.data,
                    null,
                    2
                )
            );

            setEmailCheck("true");
            setIsSendCode(true);
            setVerifiedStatus("sendCode");
            setCount(180);
            setCode("");

        } catch (error: any) {
            console.log(
                "인증번호 전송 실패"
            );

            console.log(error);

            setEmailCheck("false");

            const status =
                error?.response?.status;

            const message =
                error?.response?.data?.message ??
                error?.response?.data?.error ??
                "";

            /*
             * 혹시 백엔드에서
             * 이메일 중복을 여기서 검사하는 경우
             */
            if (
                status === 409 ||
                String(message).includes(
                    "이미 존재"
                ) ||
                String(message).includes(
                    "이미 가입"
                ) ||
                String(message).includes(
                    "중복"
                )
            ) {
                setEmailAlreadyExists(true);
                setVerifiedStatus("none");
                setIsSendCode(false);
            }
        }
    };

    // =========================
    // 인증번호 타이머
    // =========================
    useEffect(() => {
        if (!isSendCode) {
            return;
        }

        if (count <= 0) {
            alert("인증시간 만료");

            setIsSendCode(false);
            setVerifiedStatus("none");

            return;
        }

        const timer = setTimeout(() => {
            setCount(
                (prev) => prev - 1
            );
        }, 1000);

        return () =>
            clearTimeout(timer);

    }, [count, isSendCode]);

    // =========================
    // 인증번호 확인
    // =========================
    const verifyCode = async () => {
        if (!code.trim()) {
            return;
        }

        try {
            const res = await api.post(
                "/auth/email/verify",
                {
                    verificationType:
                        "NON_LOGIN",
                    purpose: "SIGNUP",
                    email: email,
                    code: code,
                }
            );

            console.log(
                "이메일 인증 성공"
            );

            console.log(
                "응답 data:",
                res.data
            );

            const temporaryToken =
                res.data?.result
                    ?.temporaryAccessToken;

            console.log(
                "임시 토큰 존재:",
                Boolean(
                    temporaryToken
                )
            );

            if (!temporaryToken) {
                throw new Error(
                    "이메일 인증 토큰을 받지 못했습니다."
                );
            }

            setTemporaryAccessToken(
                temporaryToken
            );

            setIsSendCode(false);

            setVerifiedStatus("succ");

        } catch (error) {
            console.log(
                "이메일 인증 실패"
            );

            console.log(error);

            setVerifiedStatus(
                "fail"
            );
        }
    };

    // =========================
    // 이메일 인증 UI
    // =========================
    const renderVerifyCode = () => {
        switch (verifiedStatus) {

            // -------------------------
            // 인증번호 전송 전
            // -------------------------
            case "none":
                return (
                    <>
                        <div
                            className="
                                hover:bg-[#3A3DC2]
                                hover:border-[#3A3DC2]
                                cursor-pointer
                                flex
                                items-center
                                justify-center
                                w-[145px]
                                h-[49px]
                                border-[#6366F1]
                                mt-[13px]
                                bg-[#6366F1]
                                text-white
                                text-[17px]
                                font-bold
                                rounded-[12px]
                                border-[2px]
                            "
                            onClick={sendEmail}
                        >
                            인증번호 전송
                        </div>

                        {emailFormErr && (
                            <p className="mt-[11px] font-bold text-[#EF8888]">
                                유효한 이메일이 아닙니다.
                                다시 작성해 주세요.
                            </p>
                        )}

                        {emailAlreadyExists && (
                            <p className="mt-[11px] font-bold text-[#EF8888]">
                                이미 존재하는 이메일입니다.
                            </p>
                        )}
                    </>
                );

            // -------------------------
            // 인증번호 입력
            // -------------------------
            case "sendCode":
                return (
                    <>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) =>
                                setCode(
                                    e.target.value
                                )
                            }
                            placeholder="인증번호 6자리를 입력해주세요."
                            className="
                                hover:border-[#666666]
                                h-[54px]
                                flex
                                items-center
                                pl-[20px]
                                mt-[15px]
                                rounded-[8px]
                                border-2
                                border-[#E4E4E7]
                            "
                        />

                        <div className="flex justify-center items-center">
                            <p className="text-[#666] my-[15px]">
                                인증번호를 받지 못하셨나요?

                                <span
                                    className="
                                        cursor-pointer
                                        text-[#6366F1]
                                        ml-[12px]
                                    "
                                    onClick={
                                        sendEmail
                                    }
                                >
                                    인증번호 재전송
                                </span>
                            </p>

                            <span className="font-bold text-[#EF8888] ml-[98px]">
                                {Math.floor(
                                    count / 60
                                )}
                                :
                                {String(
                                    count % 60
                                ).padStart(
                                    2,
                                    "0"
                                )}
                            </span>
                        </div>

                        <button
                            className="
                                hover:bg-[#6366F1]
                                hover:text-white
                                cursor-pointer
                                w-[112px]
                                h-[54px]
                                border-[#6366F1]
                                mt-[15px]
                                text-[#6366F1]
                                text-[20px]
                                font-bold
                                rounded-[12px]
                                border-[2px]
                            "
                            onClick={
                                verifyCode
                            }
                        >
                            인증 완료
                        </button>
                    </>
                );

            // -------------------------
            // 인증 실패
            // -------------------------
            case "fail":
                return (
                    <>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) =>
                                setCode(
                                    e.target.value
                                )
                            }
                            placeholder="인증번호 6자리를 입력해주세요."
                            className="
                                h-[54px]
                                flex
                                items-center
                                pl-[20px]
                                mt-[15px]
                                rounded-[8px]
                                border-2
                                border-[#F8A3A3]
                            "
                        />

                        <p className="text-[#EF8888] font-bold mt-[15px]">
                            인증번호가 유효하지 않습니다.
                            다시 입력해주세요.
                        </p>

                        <div className="flex justify-center items-center">
                            <p className="text-[#666] my-[15px]">
                                인증번호를 받지 못하셨나요?

                                <span
                                    className="
                                        cursor-pointer
                                        text-[#6366F1]
                                        ml-[12px]
                                    "
                                    onClick={
                                        sendEmail
                                    }
                                >
                                    인증번호 재전송
                                </span>
                            </p>

                            <span className="font-bold text-[#EF8888] ml-[98px]">
                                {Math.floor(
                                    count / 60
                                )}
                                :
                                {String(
                                    count % 60
                                ).padStart(
                                    2,
                                    "0"
                                )}
                            </span>
                        </div>

                        <button
                            className="
                                hover:bg-[#6366F1]
                                hover:text-white
                                cursor-pointer
                                w-[112px]
                                h-[54px]
                                border-[#6366F1]
                                mt-[15px]
                                text-[#6366F1]
                                text-[20px]
                                font-bold
                                rounded-[12px]
                                border-[2px]
                            "
                            onClick={
                                verifyCode
                            }
                        >
                            인증 완료
                        </button>
                    </>
                );

            // -------------------------
            // 인증 성공
            // -------------------------
            case "succ":
                return (
                    <p className="text-[#5FAA81] font-bold mt-[15px]">
                        인증을 완료했습니다.
                    </p>
                );

            // -------------------------
            // 이메일 오류
            // -------------------------
            case "emailError":
                return (
                    <>
                        <p className="text-[#EF8888] my-[15px]">
                            유효한 이메일이 아닙니다.
                            다시 작성해 주세요.
                        </p>

                        <button
                            className="
                                hover:bg-[#3A3DC2]
                                hover:border-[#3A3DC2]
                                cursor-pointer
                                w-[145px]
                                h-[54px]
                                bg-[#6366F1]
                                text-white
                                text-[20px]
                                font-bold
                                rounded-[12px]
                                border-[2px]
                            "
                            onClick={
                                sendEmail
                            }
                        >
                            인증번호 전송
                        </button>
                    </>
                );

            // -------------------------
            // 회원가입 시 이메일 인증 안됨
            // -------------------------
            case "emailcertificationNo":
                return (
                    <>
                        <button
                            className="
                                hover:bg-[#3A3DC2]
                                hover:border-[#3A3DC2]
                                cursor-pointer
                                w-[145px]
                                h-[54px]
                                mt-[11px]
                                bg-[#6366F1]
                                text-white
                                text-[20px]
                                font-bold
                                rounded-[12px]
                                border-[2px]
                            "
                            onClick={
                                sendEmail
                            }
                        >
                            인증번호 전송
                        </button>

                        <p className="text-[#EF8888] font-bold my-[11px]">
                            이메일 인증을 완료해주세요.
                        </p>
                    </>
                );
        }
    };

    // =========================
    // 비밀번호 형식 검사
    // =========================
    const validatePw = (
        value: string
    ) => {
        const pwRegex =
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

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
                : "formErr"
        );
    }, [pw]);

    // =========================
    // 비밀번호 확인
    // =========================
    useEffect(() => {
        if (pw !== "") {
            if (pw === pwCheck) {
                setPwOk("same");
            } else {
                setPwOk("notSame");
            }
        } else {
            setPwOk("basic");
        }
    }, [pw, pwCheck]);

    // =========================
    // 닉네임
    // =========================
    useEffect(() => {
        if (name !== "") {
            setNameNull(false);
        }
    }, [name]);

    // =========================
    // 약관
    // =========================
    useEffect(() => {
        if (!ckBox) {
            setNoAgree(true);
        } else {
            setNoAgree(false);
            setMem(true);
        }
    }, [ckBox]);

    // =========================
    // 회원가입
    // =========================
    const memberOk = async () => {

        // 이메일 형식 확인
        if (!validateEmail(email)) {
            setEmailFormErr(true);
            return;
        }

        // 이메일 인증 여부 확인
        if (
            verifiedStatus !== "succ" ||
            !temporaryAccessToken.trim()
        ) {
            setVerifiedStatus(
                "emailcertificationNo"
            );

            return;
        }

        // 비밀번호 형식 확인
        if (!validatePw(pw)) {
            setPwForm("formErr");
            setPwNull("lengNo");
            return;
        }

        // 비밀번호 일치 확인
        if (pw !== pwCheck) {
            setPwOk("notSame");
            return;
        }

        // 닉네임 확인
        if (!name.trim()) {
            setNameNull(true);
            return;
        }

        // 약관 확인
        if (!ckBox) {
            setNoAgree(true);
            setMem(true);
            return;
        }

        try {
            const emailVerificationToken =
                temporaryAccessToken.trim();

            console.log(
                "회원가입 요청 이메일:",
                email
            );

            const res = await api.post(
                "/auth/signup",
                {
                    email: email,
                    password: pw,
                    nickname: name.trim(),
                    termsAgreed: true,
                },
                {
                    headers: {
                        "X-Email-Verification-Token":
                            emailVerificationToken,
                    },
                }
            );

            console.log(
                "회원가입 성공:",
                res.data
            );

            const {
                accessToken,
                refreshToken,
            } = res.data.result;

            localStorage.setItem(
                "accessToken",
                accessToken
            );

            localStorage.setItem(
                "refreshToken",
                refreshToken
            );

            navigate("/home");

        } catch (error: any) {

            console.error(
                "회원가입 실패:",
                error
            );

            const status =
                error?.response?.status;

            const responseData =
                error?.response?.data;

            console.log(
                "회원가입 오류 status:",
                status
            );

            console.log(
                "회원가입 오류 data:",
                responseData
            );

            /*
             * =========================
             * 이미 가입된 이메일
             * =========================
             *
             * 백엔드가 409 Conflict를
             * 반환하는 경우
             */
            const message =
                responseData?.message ??
                responseData?.error ??
                responseData?.result?.message ??
                "";

            const isDuplicateEmail =
                status === 409 ||
                String(message).includes(
                    "이미 존재"
                ) ||
                String(message).includes(
                    "이미 가입"
                ) ||
                String(message).includes(
                    "이미 등록"
                ) ||
                String(message).includes(
                    "중복"
                ) ||
                String(message).toLowerCase().includes(
                    "duplicate"
                ) ||
                String(message).toLowerCase().includes(
                    "already"
                );

            if (isDuplicateEmail) {
                setEmailAlreadyExists(
                    true
                );

                /*
                 * 이메일 영역으로 돌아가서
                 * 오류 문구 표시
                 */
                setVerifiedStatus(
                    "none"
                );

                setIsSendCode(
                    false
                );

                return;
            }

            /*
             * 그 외 회원가입 오류
             */
            console.error(
                "회원가입 처리 중 오류:",
                responseData ?? error
            );
        }
    };

    // =========================
    // 비밀번호 빈 값 처리
    // =========================
    useEffect(() => {
        if (
            (pw === "" ||
                pwCheck === "") &&
            pwNull !== "lengNo"
        ) {
            setPwNull("null");
        } else if (
            pw !== "" &&
            pwCheck !== ""
        ) {
            setPwNull("notNull");
        }
    }, [
        pw,
        pwCheck,
        pwNull,
    ]);

    return (
        <>
            <div className="min-h-screen flex flex-col items-center bg-[#F5F5F7] text-[#52525B] text-[18px] pt-[90px] pb-[100px]">

                {/* branding */}
                <div className="px-[10px] flex flex-col items-center mb-[37px]">
                    <div className="flex flex-row items-center gap-[8px]">
                        <div
                            className="
                                w-[40px]
                                h-[39px]
                                flex
                                flex-col
                                rounded-[8px]
                                bg-[#6366F1]
                                justify-center
                                items-center
                                text-[22px]
                                font-bold
                                text-[#FFF]
                            "
                        >
                            L
                        </div>

                        <p className="text-[#27272A] text-[26px] font-bold">
                            LearningLM
                        </p>
                    </div>

                    <p className="text-[15px] text-[#52525B] mt-[11px] tracking-tighter">
                        AI활용 흐름을 블록형 튜토리얼로 배우는 플랫폼
                    </p>
                </div>

                {/* white box */}
                <div className="bg-white w-[580px] min-h-[858px] flex flex-col items-center px-[10px] pt-[41px] pb-[44px] rounded-[12px] border-[1px] border-[#E4E4E7]">

                    {/* title */}
                    <div className="flex flex-col w-[529px] tracking-tighter">
                        <p className="text-[27px] font-bold text-[#27272A]">
                            회원가입
                        </p>

                        <p className="text-[#52525B] mt-[1px] text-[15px]">
                            무료로 시작하고 첫 튜토리얼을 진행해 보세요.
                        </p>
                    </div>

                    {/* main content */}
                    <div className="flex flex-col gap-[20px]">

                        {/* 이메일 */}
                        <div className="flex flex-col mt-[39px] w-[519px] tracking-tighter">

                            <p className="font-bold text-[16.5px] text-[#52525B]">
                                이메일
                            </p>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="you@example.com"
                                className={`
                                    hover:border-[#666666]
                                    h-[50px]
                                    flex
                                    items-center
                                    pl-[20px]
                                    mt-[5px]
                                    rounded-[8px]
                                    border-2
                                    ${emailAlreadyExists
                                        ? "border-[#F8A3A3]"
                                        : "border-[#E4E4E7]"
                                    }
                                `}
                            />

                            {renderVerifyCode()}
                        </div>

                        {/* 비밀번호 */}
                        <div className="mt-[-4.5px] flex flex-col w-[519px] tracking-tighter">

                            <p className="flex text-[#52525B] text-[16.5px] font-bold">
                                비밀번호
                            </p>

                            <input
                                type="password"
                                value={pw}
                                onChange={(e) =>
                                    setPw(
                                        e.target.value
                                    )
                                }
                                placeholder="********"
                                className={`
                                    hover:border-[#666666]
                                    h-[51px]
                                    flex
                                    items-center
                                    rounded-[8px]
                                    mt-[6px]
                                    mb-[11px]
                                    pl-[20px]
                                    border-2
                                    ${pwNull === "basic" ||
                                        pwNull === "null" ||
                                        pwOk === "same"
                                        ? "border-[#E4E4E7]"
                                        : "border-[#F8A3A3]"
                                    }
                                `}
                            />

                            <p className="mt-[-5px] text-[15px] text-[#9A9AA3]">
                                영문 숫자 포함 8자 이상
                            </p>

                            {pwNull === "lengNo" && (
                                <p className="text-[#EF8888] font-bold mt-[11px]">
                                    비밀번호는 영문·숫자 포함 8자 이상 작성해주세요.
                                </p>
                            )}

                            {pwForm === "formErr" && (
                                <p className="text-[#EF8888] font-bold mt-[11px]">
                                    비밀번호는 영문·숫자만 포함할 수 있습니다.
                                </p>
                            )}
                        </div>

                        {/* 비밀번호 확인 */}
                        <div className="mt-[-5px] w-[519px] flex flex-col tracking-tighter">

                            <p className="text-[#52525B] text-[15px] font-bold">
                                비밀번호 확인
                            </p>

                            <input
                                type="password"
                                value={pwCheck}
                                onChange={(e) =>
                                    setPwCheck(
                                        e.target.value
                                    )
                                }
                                placeholder="********"
                                className={`
                                    hover:border-[#666666]
                                    h-[51px]
                                    flex
                                    items-center
                                    rounded-[8px]
                                    mt-[6px]
                                    mb-[11px]
                                    pl-[20px]
                                    border-2
                                    ${pwNull === "basic" ||
                                        pwNull === "null" ||
                                        pwOk === "same"
                                        ? "border-[#E4E4E7]"
                                        : "border-[#F8A3A3]"
                                    }
                                `}
                            />

                            {pwNull !== "null" &&
                                pwCheck !== "" && (
                                    pwOk === "same" ? (
                                        <p className="font-bold text-[#5FAA81] mt-[11px]">
                                            입력한 비밀번호가 맞습니다.
                                        </p>
                                    ) : (
                                        <p className="font-bold text-[#EF8888] mt-[11px]">
                                            입력한 비밀번호가 같지 않습니다.
                                        </p>
                                    )
                                )}
                        </div>

                        {/* 닉네임 */}
                        <div className="flex flex-col w-[519px] mt-[-15.5px]">

                            <p className="text-[#52525B] text-[15px] font-bold">
                                닉네임
                            </p>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="학습자 닉네임을 입력하세요."
                                className={`
                                    hover:border-[#666666]
                                    h-[51px]
                                    items-center
                                    pl-[20px]
                                    mt-[6.5px]
                                    text-[20px]
                                    text-[#9A9AA3]
                                    border-[2px]
                                    rounded-[8px]
                                    ${nameNull
                                        ? "border-[#F8A3A3]"
                                        : "border-[#E4E4E7]"
                                    }
                                `}
                            />

                            {nameNull && (
                                <p className="font-bold text-[#EF8888] mt-[11px]">
                                    닉네임이 입력되지 않았습니다.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 약관 */}
                    <div className="w-[519px] mt-[40px]">

                        <label className="cursor-pointer agreement flex items-center">

                            <input
                                type="checkbox"
                                checked={checked}
                                className="hidden"
                                onChange={(e) => {
                                    const value =
                                        e.target.checked;

                                    setChecked(value);
                                    setCkBox(value);
                                }}
                            />

                            <div
                                className={`
                                    w-[17px]
                                    h-[17px]
                                    flex
                                    items-center
                                    justify-center
                                    text-center
                                    border-2
                                    rounded-[2px]
                                    border-[#6366F1]
                                    ${checked
                                        ? "bg-[#6366F1]"
                                        : ""
                                    }
                                `}
                            >
                                {checked && (
                                    <Check
                                        size={18}
                                        className="text-white stroke-[3]"
                                    />
                                )}
                            </div>

                            <span className="text-[#52525B] text-[16.5px] tracking-tighter">

                                <span className="link pl-[7px] font-bold text-[#6366F1]">
                                    이용약관
                                </span>

                                {" "}및{" "}

                                <span className="link font-bold text-[#6366F1]">
                                    개인정보 처리방침
                                </span>

                                에 동의합니다.

                            </span>
                        </label>

                        {noAgree && mem && (
                            <p className="font-bold text-[#EF8888] mt-[20px]">
                                이용약관 및 개인정보 처리에 체크해주세요.
                            </p>
                        )}
                    </div>

                    {/* 회원가입 버튼 */}
                    <button
                        className="
                            hover:bg-[#6366F1]
                            hover:text-white
                            text-[#9D9ED0]
                            cursor-pointer
                            w-[519px]
                            h-[52px]
                            mt-[16px]
                            items-center
                            justify-center
                            rounded-[8px]
                            border-1
                            border-[#6366F1]
                        "
                        onClick={
                            memberOk
                        }
                    >
                        <span className="cursor-pointer text-[21px] font-bold">
                            회원가입
                        </span>
                    </button>

                    {/* 로그인 */}
                    <p className="text-[#52525B] text-[15px] tracking-tighter mt-[61px]">

                        이미 계정이 있으신가요?{" "}

                        <button
                            onClick={() =>
                                navigate(
                                    "/login"
                                )
                            }
                        >
                            <span className="cursor-pointer text-[#6366F1] font-bold">
                                로그인
                            </span>
                        </button>

                    </p>
                </div>

                <p className="mt-[44px]">
                    ©2026LearningLM
                </p>
            </div>
        </>
    );
}