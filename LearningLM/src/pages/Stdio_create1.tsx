import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function Stdio_create1() {

    return (
        <>
            {/* w-[1920px] min-h-[2528px] */}
            <div className="min-h-screen bg-[#F5F5F7]">
                <Header />
                {/*블록 팔레트 */}
                <div className="relative z-30 w-[358px] bg-white flex flex-col items-center justify-center">
                    {/*블록 팔레트 텍스트 section */}
                    <div className="h-[136px] flex flex-col items-center justify-center">

                    </div>
                    {/*블록 팔레트 텍스트 하단 section */}
                    <div>
                        {/*블록 검색 */}
                        <div>

                        </div>
                        {/*입력 section */}
                        <div>
                        </div>
                        {/*컨텍스트 section */}
                        <div>
                        </div>
                        {/*프로세스 section */}
                        <div>
                        </div>
                        {/*검토 section */}
                        <div>
                        </div>
                        {/*결과 section */}
                        <div>
                        </div>
                    </div>
                </div>
                {/*메인 화면 */}
                <div className="flex-1 min-h-screen relative z-10">

                </div>
                {/*인스펙터 */}
                <div className="relative z-30">

                </div>

                <Footer />
            </div>
        </>
    )
}