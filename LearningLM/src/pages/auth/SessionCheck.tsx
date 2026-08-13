import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";

export function SessionCheck() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            // localStorage 우선 확인
            const accessToken =
                localStorage.getItem("accessToken") ||
                sessionStorage.getItem("accessToken");

            // 토큰 자체가 없으면 로그인 페이지로 이동
            if (!accessToken) {
                navigate("/login", {
                    replace: true,
                });
                return;
            }

            try {
                console.log("로그인 상태 확인 중...");

                /*
                 * 저장된 accessToken을 이용해서
                 * 서버에 로그인 상태 확인 요청
                 *
                 * ⚠️ "/auth/session"은 예시입니다.
                 * Swagger에 있는 실제 세션 확인 API로 변경해주세요.
                 */
                await api.get("/auth/session", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                console.log("로그인 상태 확인 완료");

                // 로그인 상태가 유효하면 Home으로 이동
                navigate("/", {
                    replace: true,
                });
            } catch (error: any) {
                console.log(
                    "로그인 상태 확인 실패:",
                    error
                );

                if (error.response) {
                    console.log(
                        "상태 코드:",
                        error.response.status
                    );

                    console.log(
                        "에러 응답:",
                        error.response.data
                    );
                }

                /*
                 * 세션이 유효하지 않은 경우
                 * 저장되어 있는 토큰 제거 후 로그인 페이지로 이동
                 */
                localStorage.removeItem(
                    "accessToken"
                );
                localStorage.removeItem(
                    "refreshToken"
                );
                localStorage.removeItem("user");

                sessionStorage.removeItem(
                    "accessToken"
                );
                sessionStorage.removeItem(
                    "refreshToken"
                );
                sessionStorage.removeItem("user");

                navigate("/login", {
                    replace: true,
                });
            }
        };

        checkSession();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-[#F5F5F7] text-[#464646]">
            {/* 가운데 영역 */}
            <div className="flex flex-1 flex-col items-center justify-center pb-[40px]">
                {/* LearningLM 로고 */}
                <div className="flex flex-col items-center">
                    <div className="flex flex-row items-center gap-[7px]">
                        {/* L 로고 */}
                        <div
                            className="
                                h-[29px]
                                w-[29px]
                                flex
                                items-center
                                justify-center
                                rounded-[6px]
                                bg-[#6366F1]
                                text-[16px]
                                font-bold
                                text-white
                            "
                        >
                            L
                        </div>

                        {/* LearningLM */}
                        <p className="text-[18px] font-bold text-[#27272A]">
                            LearningLM
                        </p>
                    </div>

                    {/* 설명 */}
                    <p className="mt-[6px] text-[9px] tracking-tight text-[#71717A]">
                        AI 활용 흐름을 블록형 튜토리얼로 배우는 플랫폼
                    </p>
                </div>

                {/* 로딩 애니메이션 */}
                <div
                    className="
                        mt-[39px]
                        h-[26px]
                        w-[26px]
                        animate-spin
                        rounded-full
                        border-[3px]
                        border-[#E4E4E7]
                        border-t-[#D4D4D8]
                    "
                />

                {/* 상태 메시지 */}
                <p className="mt-[14px] text-[13px] text-[#71717A]">
                    로그인 상태를 확인하는 중입니다...
                </p>
            </div>

            {/* footer */}
            <div className="mb-[42px] flex flex-row gap-[24px] text-[9px] text-[#A1A1AA]">
                <p>© 2026 LearningLM</p>
                <p>이용약관</p>
                <p>개인정보처리방침</p>
            </div>
        </div>
    );
}