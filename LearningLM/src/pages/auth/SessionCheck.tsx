import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";

export function SessionCheck() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("✅ SessionCheck 페이지 진입");

        const checkSession = async () => {
            const accessToken =
                localStorage.getItem("accessToken") ||
                sessionStorage.getItem("accessToken");

            console.log(
                "Access Token 존재 여부:",
                !!accessToken
            );

            if (!accessToken) {
                console.log(
                    "❌ Access Token 없음 → 로그인 페이지"
                );

                navigate("/login", {
                    replace: true,
                });

                return;
            }

            // 최소 1초 동안 세션 확인 화면을 보여주기 위한 시간
            const startTime = Date.now();

            try {
                console.log(
                    "🔄 로그인 상태 확인 중..."
                );

                const response = await api.get(
                    "/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                console.log(
                    "✅ 로그인 상태 확인 성공:",
                    response.data
                );

                /**
                 * API 응답이 너무 빨리 오더라도
                 * 최소 1초 동안 로딩 화면을 보여줍니다.
                 */
                const elapsedTime =
                    Date.now() - startTime;

                const remainingTime =
                    Math.max(
                        1000 - elapsedTime,
                        0
                    );

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            remainingTime
                        )
                );

                console.log(
                    "🏠 Home으로 이동"
                );

                navigate("/", {
                    replace: true,
                });
            } catch (error: any) {
                console.log(
                    "❌ 로그인 상태 확인 실패:",
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

                /**
                 * API 응답이 너무 빨라도
                 * 최소 1초 동안 화면을 보여줍니다.
                 */
                const elapsedTime =
                    Date.now() - startTime;

                const remainingTime =
                    Math.max(
                        1000 - elapsedTime,
                        0
                    );

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            remainingTime
                        )
                );

                // 로그인 정보 삭제
                localStorage.removeItem(
                    "accessToken"
                );
                localStorage.removeItem(
                    "refreshToken"
                );
                localStorage.removeItem(
                    "user"
                );

                sessionStorage.removeItem(
                    "accessToken"
                );
                sessionStorage.removeItem(
                    "refreshToken"
                );
                sessionStorage.removeItem(
                    "user"
                );

                console.log(
                    "🔐 로그인 페이지로 이동"
                );

                navigate("/login", {
                    replace: true,
                });
            }
        };

        checkSession();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-[#F5F5F7] text-[#464646]">
            {/* 가운데 콘텐츠 */}
            <div className="flex flex-1 flex-col items-center justify-center">
                {/* LearningLM 로고 */}
                <div className="flex flex-col items-center">
                    <div className="flex flex-row items-center gap-[7px]">
                        <div
                            className="
                                w-[26px]
                                h-[26px]
                                flex
                                items-center
                                justify-center
                                rounded-[5px]
                                bg-[#6366F1]
                                text-[15px]
                                font-bold
                                text-white
                            "
                        >
                            L
                        </div>

                        <p className="text-[18px] font-bold text-[#27272A]">
                            LearningLM
                        </p>
                    </div>

                    <p className="mt-[5px] text-[9px] tracking-tight text-[#71717A]">
                        AI 활용 흐름을 블록형 튜토리얼로 배우는 플랫폼
                    </p>
                </div>

                {/* 회전하는 도넛 */}
                <div
                    className="
                        mt-[39px]
                        w-[26px]
                        h-[26px]
                        rounded-full
                        border-[3px]
                        border-[#E4E4E7]
                        border-t-[#6366F1]
                        animate-spin
                    "
                />

                {/* 안내 문구 */}
                <p className="mt-[14px] text-[13px] text-[#71717A]">
                    로그인 상태를 확인하는 중입니다...
                </p>
            </div>

            {/* Footer */}
            <div className="flex flex-row gap-[24px] mb-[42px] text-[9px] text-[#A1A1AA]">
                <p>© 2026 LearningLM</p>
                <p>이용약관</p>
                <p>개인정보처리방침</p>
            </div>
        </div>
    );
}