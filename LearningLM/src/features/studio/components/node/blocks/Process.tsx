import {useState} from "react";
export default function Process() {
  const [checked1, setChecked1]=useState("");
  const [checked2, setChecked2]=useState("");
  const [checked3, setChecked3]=useState("");
  const [checked4, setChecked4]=useState("");
  const [checked5, setChecked5]=useState("");
  const [checked6, setChecked6]=useState("");
  const [length, setLength] = useState("short");
  const [form , setForm]=useState("");
  const [save2, setSave2]=useState(false);
  const [count, setCount] = useState(0);
  const [count3, setCount3]=useState("");
  const [sectionType,setSectionType]=useState("item");
  const [progress, setProgress] = useState(70); // (367.5/525)*100 = 70
  return (
    <div className="relative w-[600px] h-[2420px] bg-[#FFFFFF]">
      <div className="absolute w-[598.5px] h-[2417.53px] top-[0.75px] left-[0.75px] border border-[1.5px] border-[#E4E4E7]">
        {/* 소개 */}
        <div className="absolute w-[45px] h-[45px] top-[28.88px] left-[24px] bg-[#6366F1] flex items-center justify-center rounded-[12px]">
          <div className="w-[14px] h-[25px] top-[35.92px] left-[39.7px] font-inter font-bold text-[21px] leading-none text-[#FFFFFF]">
            3
          </div>
        </div>

        <div className="absolute whitespace-nowrap w-[130px] h-[27px] top-[23.25px] left-[84px] font-bold text-[22.5px] font-SplineSansMono leading-none text-[#27272A]">
          프로세스 노드
        </div>

        <div className="absolute w-[171px] h-[18px] top-[57.75px] left-[84px] font-normal text-[15px] leading-none text-[#9A9AA3]">
          PROCESS · 16 blocks
        </div>

        <div className="absolute w-[95.05px] h-[30px] top-[36.38px] left-[405.28px] border border-[1.5px] border-dashed border-[#E4E4E7] bg-[#E4E4E7] flex items-center justify-center rounded-[12px]">
          <div className="w-[72px] h-[18px] top-[40.13px] left-[418.03px] font-bold font-inter text-[15px] leading-none text-[#52525B]">
            PROCESS
          </div>
        </div>

        <div className="absolute w-[64.41px] h-[30px] top-[36.38px] left-[510.84px] border border-[1.5px] border-[#E9C9C9] bg-[#E9C9C9] flex items-center justify-center rounded-[12px]">
          <div className="w-[42px] h-[18px] top-[40.13px] left-[523.59px] font-bold text-[15px] font-inter leading-none text-[#B4453A] ">
            미완성
          </div>
        </div>

        <div className="absolute whitespace-nowrap w-[587px] h-[21px] top-[93.67px] left-[24px] font-inter font-normal leading-none text-[#52525B] text-[17.25px]">
          핵심 처리 단계입니다. 추출·요약·분류·비교·프롬프트 조립 등 블록을 조합해 작업을
        </div>

        <div className="absolute whitespace-nowrap w-[85px] h-[21px] top-[119.55px] left-[24px] font-inter font-normal leading-none text-[#52525B] text-[17.25px]">
          구성합니다.
        </div>

        <div className="absolute w-[78.77px] h-[30px] top-[159.75px] left-[24.75px] border border-[1.5px] border-[#E4E4E7] bg-[#E4E4E7] flex items-center justify-center rounded-[12px]">
          <div className="whitespace-nowrap w-[56px] h-[18px] top-[163.5px] left-[37.5px] font-inter font-bold leading-none text-[#52525B]">
            필수 2/2
          </div>
        </div>

        <div className="absolute w-[61.92px] h-[30px] top-[159.75px] left-[114.02px] border border-[1.5px] border-[#E4E4E7] bg-[#E4E4E7] flex items-center justify-center rounded-[12px]">
          <div className="whitespace-nowrap w-[39px] h-[18px] top-[163.5px] left-[126.77px] font-inter font-bold leading-none text-[#52525B]">
            도구 1
          </div>
        </div>

        <div className="absolute w-[71.79px] h-[30px] top-[159.75px] left-[186.45px] border border-[1.5px] border-[#E4E4E7] bg-[#E4E4E7] flex items-center justify-center rounded-[12px]">
          <div className="whitespace-nowrap w-[49px] h-[18px] top-[163.5px] left-[199.2px] font-inter font-bold leading-none text-[#52525B]">
            선택 14
          </div>
        </div>

        <hr className="absolute w-[597px] h-0 top-[212.25px] left-[1.5px] border-[1.5px] border-[#E4E4E7]" />

        
        

        
          <div className="absolute w-[22.5px] h-[22.5px] top-[244.5px] left-[37.5px] bg-[#6366F1] rounded-[6px]"></div>

          <div className="absolute w-[147px] h-[23px] top-[242.63px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
            핵심 내용 추출하기
          </div>

          <div className="absolute w-[25px] h-[16px] top-[246.3px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#6366F1]">
            필수
          </div>

          <div className="absolute w-[10px] h-[22px] top-[243.9px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
            ⌄
          </div>

          <div className="absolute whitespace-nowrap w-[68px] h-[21px] top-[280.42px] left-[37.5px] font-inter font-bold text-[17.25px] leading-none text-[#52525B]">
            추출 대상
            <span className="w-[10px] h-[21px] top-[280.42px] left-[110.11px] font-inter font-bold text-[17.25px] leading-none text-[#C0473C]">
              *
            </span>
          </div>

          {/* 주장 */}
          <div className="absolute w-[91.34px] h-[40.5px] top-[316.13px] left-[38.25px] border border-[1.5px] border-[#E4E4E7] rounded-[20px] flex items-center"></div>

          <div
            onClick={() => setChecked1("checked1")}
            className={`absolute w-[18px] h-[18px] top-[327.38px] left-[56.25px] rounded-[5px] flex items-center justify-center cursor-pointer ${
              checked1 === "checked1"
                ? "bg-[#6366F1]"
                : "border border-[1.5px] border-[#52525B]"
            }`}
          >
            {checked1 === "checked1" && (
              <div className="absolute w-[11px] h-[15px] top-[1.35px] left-[3.87px] font-inter font-bold text-[12px] leading-none text-[#FFFFFF]">
                ✓
              </div>
            )}
          </div>

          <div
            onClick={() => setChecked1("checked1")}
            className={`absolute w-[32px] h-[21px] top-[323.36px] left-[82.5px] font-inter font-bold text-[17.25px] leading-none cursor-pointer ${
              checked1 === "checked1"
                ? "text-[#6366F1]"
                : "text-[#52525B]"
            }`}
          >
            주장
          </div>

          {/* 사실 */}
          <div className="absolute w-[91.34px] h-[40.5px] top-[316.13px] left-[140.09px] border border-[1.5px] border-[#E4E4E7] rounded-[20px] flex items-center"></div>

          <div
            onClick={() => setChecked2("checked2")}
            className={`absolute w-[18px] h-[18px] top-[327.38px] left-[158.09px] rounded-[5px] flex items-center justify-center cursor-pointer ${
              checked2 === "checked2"
                ? "bg-[#6366F1]"
                : "border border-[1.5px] border-[#52525B]"
            }`}
          >
            {checked2 === "checked2" && (
              <div className="absolute w-[11px] h-[15px] top-[1.35px] left-[3.87px] font-inter font-bold text-[12px] leading-none text-[#FFFFFF]">
                ✓
              </div>
            )}
          </div>

          <div
            onClick={() => setChecked2("checked2")}
            className={`absolute w-[32px] h-[21px] top-[323.36px] left-[184.34px] font-inter font-bold text-[17.25px] leading-none cursor-pointer ${
              checked2 === "checked2"
                ? "text-[#6366F1]"
                : "text-[#52525B]"
            }`}
          >
            사실
          </div>

          {/* 요구 */}
          <div className="absolute w-[91.34px] h-[40.5px] top-[316.13px] left-[241.92px] border border-[1.5px] border-[#E4E4E7] rounded-[20px] flex items-center"></div>

          <div
            onClick={() => setChecked3("checked3")}
            className={`absolute w-[18px] h-[18px] top-[327.38px] left-[259.92px] rounded-[5px] flex items-center justify-center cursor-pointer ${
              checked3 === "checked3"
                ? "bg-[#6366F1]"
                : "border border-[1.5px] border-[#52525B]"
            }`}
          >
            {checked3 === "checked3" && (
              <div className="absolute w-[11px] h-[15px] top-[1.35px] left-[3.87px] font-inter font-bold text-[12px] leading-none text-[#FFFFFF]">
                ✓
              </div>
            )}
          </div>

          <div
            onClick={() => setChecked3("checked3")}
            className={`absolute w-[32px] h-[21px] top-[323.36px] left-[286.17px] font-inter font-bold text-[15.75px] leading-none flex items-center cursor-pointer ${
              checked3 === "checked3"
                ? "text-[#6366F1]"
                : "text-[#52525B]"
            }`}
          >
            요구
          </div>

          {/* 결정 */}
          <div className="absolute w-[91.34px] h-[40.5px] top-[316.13px] left-[343.76px] border border-[1.5px] border-[#E4E4E7] rounded-[20px] flex items-center"></div>

          <div
            onClick={() => setChecked4("checked4")}
            className={`absolute w-[18px] h-[18px] top-[327.38px] left-[361.76px] rounded-[5px] flex items-center justify-center cursor-pointer ${
              checked4 === "checked4"
                ? "bg-[#6366F1]"
                : "border border-[1.5px] border-[#52525B]"
            }`}
          >
            {checked4 === "checked4" && (
              <div className="absolute w-[11px] h-[15px] top-[1.35px] left-[3.87px] font-inter font-bold text-[12px] leading-none text-[#FFFFFF]">
                ✓
              </div>
            )}
          </div>

          <div
            onClick={() => setChecked4("checked4")}
            className={`absolute w-[32px] h-[21px] top-[323.36px] left-[388.01px] font-inter font-bold text-[17.25px] leading-none cursor-pointer ${
              checked4 === "checked4"
                ? "text-[#6366F1]"
                : "text-[#52525B]"
            }`}
          >
            결정
          </div>

          {/* 액션 */}
          <div className="absolute w-[91.34px] h-[40.5px] top-[367.13px] left-[38.25px] border border-[1.5px] border-[#E4E4E7] rounded-[20px] flex items-center"></div>

          <div
            onClick={() => setChecked5("checked5")}
            className={`absolute w-[18px] h-[18px] top-[378.38px] left-[56.25px] rounded-[5px] flex items-center justify-center cursor-pointer ${
              checked5 === "checked5"
                ? "bg-[#6366F1]"
                : "border border-[1.5px] border-[#52525B]"
            }`}
          >
            {checked5 === "checked5" && (
              <div className="absolute w-[11px] h-[15px] top-[1.35px] left-[3.87px] font-inter font-bold text-[12px] leading-none text-[#FFFFFF]">
                ✓
              </div>
            )}
          </div>

          <div
            onClick={() => setChecked5("checked5")}
            className={`absolute w-[32px] h-[21px] top-[374.36px] left-[82.5px] font-inter font-bold text-[15.75px] leading-none flex items-center cursor-pointer ${
              checked5 === "checked5"
                ? "text-[#6366F1]"
                : "text-[#52525B]"
            }`}
          >
            액션
          </div>

          {/* 키워드 */}
          <div className="absolute w-[106.24px] h-[40.5px] top-[367.13px] left-[140.09px] border border-[1.5px] border-[#E4E4E7] rounded-[20px] flex items-center"></div>

          <div
            onClick={() => setChecked6("checked6")}
            className={`absolute w-[18px] h-[18px] top-[378.38px] left-[158.09px] rounded-[5px] flex items-center justify-center cursor-pointer ${
              checked6 === "checked6"
                ? "bg-[#6366F1]"
                : "border border-[1.5px] border-[#52525B]"
            }`}
          >
            {checked6 === "checked6" && (
              <div className="absolute w-[11px] h-[15px] top-[1.35px] left-[3.87px] font-inter font-bold text-[12px] leading-none text-[#FFFFFF]">
                ✓
              </div>
            )}
          </div>

          <div
            onClick={() => setChecked6("checked6")}
            className={`absolute w-[48px] h-[21px] top-[374.36px] left-[184.34px] font-inter font-bold text-[15.75px] leading-none flex items-center cursor-pointer ${
              checked6 === "checked6"
                ? "text-[#6366F1]"
                : "text-[#52525B]"
            }`}
          >
            키워드
          </div>

          <div className="absolute whitespace-nowrap flex w-[68px] h-[21px] top-[423.3px] left-[37.5px] font-inter font-bold text-[17.25px] leading-none text-[#52525B]">
            추출 단위 <span className="w-[10px] h-[21px] top-[423.3px] left-[110.11px] font-inter font-bold text-[17.25px] leading-none text-[#C0473C]">*</span>
          </div>

          <div className="absolute w-[523.5px] h-[48.38px] top-[459px] left-[38.25px] border border-[#E4E4E7] rounded-[12px] border-[1.5px]"></div>

          {/* 문장 */}
          <div
            onClick={() => setSectionType("sentence")}
            className={`absolute w-[174.52px] h-[46.88px] top-[459.75px] left-[38.25px] flex items-center justify-center cursor-pointer rounded-tl-[12px] rounded-bl-[12px] ${
              sectionType === "sentence" ? "bg-[#6366F1]" : "bg-[#FFFFFF]"
            }`}
          ></div>

          <div
            onClick={() => setSectionType("sentence")}
            className={`absolute w-[32px] h-[21px] top-[470.18px] left-[109.5px] font-inter font-bold text-[17.25px] leading-none flex items-center justify-center cursor-pointer z-20 ${
              sectionType === "sentence"
                ? "text-[#FFFFFF]"
                : "text-[#52525B]"
            }`}
          >
            문장
          </div>

          <div className="absolute z-10 w-[0px] h-[46.88px] top-[459.75px] left-[212.74px] border-[1.5px] border-[#E4E4E7]"></div>

          {/* 항목 */}
          <div
            onClick={() => setSectionType("item")}
            className={`absolute w-[174.52px] h-[46.88px] top-[459.75px] left-[211.99px] flex items-center justify-center cursor-pointer ${
              sectionType === "item" ? "bg-[#6366F1]" : "bg-[#FFFFFF]"
            }`}
          ></div>

          <div
            onClick={() => setSectionType("item")}
            className={`absolute w-[32px] h-[21px] top-[470.18px] left-[283.99px] font-inter font-bold text-[17.25px] leading-none flex items-center justify-center cursor-pointer z-20 ${
              sectionType === "item"
                ? "text-[#FFFFFF]"
                : "text-[#52525B]"
            }`}
          >
            항목
          </div>

          <div className="absolute z-10 w-[0px] h-[46.88px] top-[459.75px] left-[387.26px] border-[1.5px] border-[#E4E4E7]"></div>

          {/* 주제 */}
          <div
            onClick={() => setSectionType("topic")}
            className={`absolute w-[174.49px] h-[46.88px] top-[459.75px] left-[387.26px] flex items-center justify-center cursor-pointer rounded-tr-[12px] rounded-br-[12px] ${
              sectionType === "topic" ? "bg-[#6366F1]" : "bg-[#FFFFFF]"
            }`}
          ></div>

          <div
            onClick={() => setSectionType("topic")}
            className={`absolute w-[32px] h-[21px] top-[470.18px] left-[458.5px] font-inter font-bold text-[17.25px] leading-none flex items-center justify-center cursor-pointer z-20 ${
              sectionType === "topic"
                ? "text-[#FFFFFF]"
                : "text-[#52525B]"
            }`}
          >
            주제
          </div>

          <div className="absolute whitespace-nowrap flex w-[68px] h-[21px] top-[523.05px] left-[37.5px] font-inter font-bold text-[17.25px] leading-none text-[#52525B]">
            추출 강도 <span className="w-[10px] h-[21px] top-[523.05px] left-[110.11px] font-inter font-bold text-[17.25px] leading-none text-[#C0473C]">*</span>
          </div>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          style={{ "--progress": `${progress}%` } as React.CSSProperties}
          className="absolute w-[525px] h-[19.5px] top-[552.75px] left-[37.5px]
            appearance-none bg-transparent cursor-pointer

            [&::-webkit-slider-runnable-track]:h-[9px]
            [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#6366F1_var(--progress),#E7E7EC_var(--progress))]

            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-[19.5px]
            [&::-webkit-slider-thumb]:h-[19.5px]
            [&::-webkit-slider-thumb]:rounded-[10px]
            [&::-webkit-slider-thumb]:border-[3px]
            [&::-webkit-slider-thumb]:border-[#6366F1]
            [&::-webkit-slider-thumb]:bg-[#FFFFFF]
            [&::-webkit-slider-thumb]:-mt-[5.25px]

            [&::-moz-range-track]:h-[9px]
            [&::-moz-range-track]:rounded-full
            [&::-moz-range-track]:bg-[linear-gradient(to_right,#6366F1_var(--progress),#E7E7EC_var(--progress))]

            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-[19.5px]
            [&::-moz-range-thumb]:h-[19.5px]
            [&::-moz-range-thumb]:rounded-[10px]
            [&::-moz-range-thumb]:border-[3px]
            [&::-moz-range-thumb]:border-[#6366F1]
            [&::-moz-range-thumb]:bg-[#FFFFFF]"/>

          <div className="absolute w-[42px] h-[18px] top-[576px] left-[37.5px] text-[#9A9AA3] font-inter font-normal text-[15px] leading-none">보수적</div>
          <div className="absolute w-[101px] h-[19px] top-[575.47px] left-[247.57px] text-[#6366F1] font-SplineSansMono font-bold text-[15.75px] leading-none flex items-center justify-center">{(progress / 100).toFixed(1)} · {progress / 100 >= 0.5 ? "적극적" : "보수적"}</div>
          <div className="absolute w-[42px] h-[18px] top-[576px] left-[523.59px] text-[#9A9AA3] font-inter font-normal text-[15px] leading-none ">적극적</div>

          <div className="absolute whitespace-nowrap flex w-[68px] h-[21px] top-[614.55px] left-[37.5px] font-inter font-bold text-[17.25px] leading-none text-[#52525B]">
            최대 항목
          </div>
          <div className="absolute w-[27px] h-[17px] top-[616.65px] left-[537.87px] font-inter font-bold text-[14.25px] leading-none text-[#9A9AA3]">
            선택
          </div>

          <div className="absolute w-[166.5px] h-[52.5px] top-[650.25px] left-[38.25px] border border-[2px] border-[#E4E4E7] flex items-center justify-center rounded-[12px]"></div>
          <div onClick={()=>{setCount(count=>(count>0 ?count-1:0))}}
          className="absolute w-[48px] h-[51px] top-[651px] left-[39px] bg-[#FFFFFF]"></div>
          <div className="absolute whitespace-nowrap flex w-[16px] h-[29px] top-[659.7px] left-[55px] font-inter font-normal text-[24px] leading-none text-[#52525B]">−</div>
          <div className="absolute w-[0px] h-[51px] top-[651px] left-[87.75px] text-[#000000] border-[1.5px] border-[#E4E4E7] flex items-center"></div>
          <div className="absolute whitespace-nowrap flex w-[24px] h-[23px] top-[661.72px] left-[109.78px] font-SplineSansMono font-bold text-[19.5px] leading-none text-[#27272A] flex items-center justify-center">{count}</div>
          <div className="absolute w-[0px] h-[51px] top-[651px] left-[155.25px] text-[#000000] border-[1.5px] border-[#E4E4E7] flex items-center justify-center"></div>
          <button onClick={()=>{setCount(count=>count+1)}}
          className="absolute w-[48px] h-[51px] top-[651px] left-[156px] bg-[#FFFFFF]"></button>
          <div className="absolute whitespace-nowrap flex w-[16px] h-[29px] top-[659.7px] left-[172px] font-inter font-normal text-[24px] leading-none text-[#52525B]">+</div>

          <div onClick={()=>{setCount3("setcount3")}}
          className={`absolute w-[38.93px] h-[44.25px] top-[654.38px] left-[218.25px] border border-[1.5px]  flex items-center justify-center rounded-[12px] ${
          count3==="setcount3"? "border-[#6366F1] bg-[#6366F1]" : "border-[#E4E4E7] bg-[#FFFFFF]"}`}></div>
          <div className={`absolute whitespace-nowrap flex w-[11px] h-[20px] top-[663.83px] left-[232.5px] font-inter font-bold text-[16.5px] leading-none  flex items-center justify-center ${
          count3==="setcount3"? "text-[#FFFFFF]" : "text-[#9A9AA3]"}`}>3</div>

          <div onClick={()=>{setCount3("setcount5")}}
          className={`absolute w-[38.93px] h-[44.25px] top-[654.38px] left-[270.68px] border border-[1.5px] flex items-center justify-center rounded-[12px] ${
          count3==="setcount5"? "border-[#6366F1] bg-[#6366F1]" : "border-[#E4E4E7] bg-[#FFFFFF]"}`}></div>
          <div className={`absolute whitespace-nowrap flex w-[11px] h-[20px] top-[663.83px] left-[284.93px] font-inter font-bold text-[16.5px] leading-none  flex items-center justify-center ${
          count3==="setcount5"? "text-[#FFFFFF]" : "text-[#9A9AA3]"}`}>5</div>

          <div onClick={()=>{setCount3("setcount10")}}
          className={`absolute w-[38.93px] h-[44.25px] top-[654.38px] left-[327.2px] border border-[1.5px] flex items-center justify-center rounded-[12px] ${
          count3==="setcount10"? "border-[#6366F1] bg-[#6366F1]" : "border-[#E4E4E7] bg-[#FFFFFF]"}`}></div>
          <div className={`absolute whitespace-nowrap flex w-[20px] h-[20px] top-[663.83px] left-[337.13px] font-inter font-bold text-[16.5px] leading-none  flex items-center justify-center ${
          count3==="setcount10"? "text-[#FFFFFF]" : "text-[#9A9AA3]"}`}>10</div>

          <div onClick={()=>{setCount3("setcountx")}}
          className={`absolute w-[85.55px] h-[44.25px] top-[654.38px] left-[382.99px] border border-[1.5px]  flex items-center justify-center rounded-[12px] ${
            count3==="setcountx"?"border-[#6366F1] bg-[#6366F1]" : "border-[#E4E4E7] bg-[#FFFFFF]"}`}></div>
          <div className={`absolute w-[61px] h-[20px] top-[663.83px] left-[397.24px] font-inter font-bold text-[16.5px] leading-none  flex items-center justify-center ${
          count3==="setcountx"? "text-[#FFFFFF]" : "text-[#9A9AA3]"}`}>제한없음</div>
        
        
        <div className="absolute w-[22.5px] h-[22.5px] top-[753px] left-[37.5px] bg-[#6366F1] rounded-[6px]"></div>

        <div className="absolute w-[69px] h-[23px] top-[751.13px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          요약하기
        </div>

        <div className="absolute w-[25px] h-[16px] top-[754.8px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#6366F1]">
          필수
        </div>

        <div className="absolute w-[10px] h-[22px] top-[752.4px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute whitespace-nowrap w-[68px] h-[21px] top-[788.93px] left-[37.5px] font-inter font-bold text-[17.25px] leading-none text-[#52525B]">
          요약 길이
          <span className="w-[10px] h-[21px] top-[788.93px] left-[110.11px] font-inter font-bold text-[17.25px] leading-none text-[#C0473C]">
            *
          </span>
        </div>

        <div
        onClick={() => setLength("sentence")}
        className={`absolute relative w-[86.32px] h-[48.38px] top-[824.63px] left-[38.25px] border border-[1.5px] rounded-[12px] cursor-pointer ${
          length === "sentence"
            ? "bg-[#6366F1] border-[#6366F1]"
            : "border-[#E4E4E7] bg-[#FFFFFF]"
        }`}
      ></div>

      <div
        onClick={() => setLength("sentence")}
        className={`absolute w-[52px] h-[21px] top-[835.8px] left-[57px] font-inter font-bold text-[17.25px] leading-none flex items-center justify-center cursor-pointer ${
          length === "sentence"
            ? "text-[#FFFFFF]"
            : "text-[#52525B]"
        }`}
      >
        한 문장
      </div>

      <div
        onClick={() => setLength("short")}
        className={`absolute w-[67.34px] h-[48.38px] top-[824.63px] left-[134.32px] border border-[1.5px] rounded-[12px] cursor-pointer ${
          length === "short"
            ? "bg-[#6366F1] border-[#6366F1]"
            : "border-[#E4E4E7] bg-[#FFFFFF]"
        }`}
      ></div>

      <div
        onClick={() => setLength("short")}
        className={`absolute w-[32px] h-[21px] top-[835.8px] left-[153.82px] font-inter font-bold text-[17.25px] leading-none flex items-center justify-center cursor-pointer ${
          length === "short"
            ? "text-[#FFFFFF]"
            : "text-[#52525B]"
        }`}
      >
        짧게
      </div>

      <div
        onClick={() => setLength("normal")}
        className={`absolute w-[67.34px] h-[48.38px] top-[824.63px] left-[212.91px] border border-[1.5px] rounded-[12px] cursor-pointer ${
          length === "normal"
            ? "bg-[#6366F1] border-[#6366F1]"
            : "border-[#E4E4E7] bg-[#FFFFFF]"
        }`}
      ></div>

      <div
        onClick={() => setLength("normal")}
        className={`absolute w-[32px] h-[21px] top-[835.8px] left-[231.66px] font-inter font-bold text-[17.25px] leading-none flex items-center justify-center cursor-pointer ${
          length === "normal"
            ? "text-[#FFFFFF]"
            : "text-[#52525B]"
        }`}
      >
        보통
      </div>

      <div
        onClick={() => setLength("detail")}
        className={`absolute w-[82.24px] h-[48.38px] top-[824.63px] left-[290.74px] border border-[1.5px] rounded-[12px] cursor-pointer ${
          length === "detail"
            ? "bg-[#6366F1] border-[#6366F1]"
            : "border-[#E4E4E7] bg-[#FFFFFF]"
        }`}
      ></div>

      <div
        onClick={() => setLength("detail")}
        className={`absolute w-[48px] h-[21px] top-[835.8px] left-[309.49px] font-inter font-bold text-[17.25px] leading-none flex items-center justify-center cursor-pointer ${
          length === "detail"
            ? "text-[#FFFFFF]"
            : "text-[#52525B]"
        }`}
      >
        자세히
      </div>
        

        <div className="absolute whitespace-nowrap w-[68px] h-[21px] top-[888.68px] left-[37.5px] font-inter font-bold text-[17.25px] leading-none text-[#52525B]">
          요약 형식
          <span className="w-[10px] h-[21px] top-[888.68px] left-[110.11px] font-inter font-bold text-[17.25px] leading-none text-[#C0473C]">
            *
          </span>
        </div>

        <div onClick={()=>{setForm("form1")}}
        className={`absolute w-[523.5px] h-[59.63px] top-[924.38px] left-[38.25px] border border-[1.5px] rounded-[12px] flex items-center justify-center ${
        form ==="form1" ? "border-[#6366F1]" : "border-[#E4E4E7]" }`}></div>
        <div className={`absolute w-[22.5px] h-[22.5px] top-[942.38px] left-[56.25px] border border-[1.5px]  rounded-[10px] ${
          form==="form1"? "bg-[#6366F1] border-[#6366F1]" : "border-[#E4E4E7]"}`}></div>
        <div className="absolute w-[35px] h-[23px] top-[939.75px] left-[94.5px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">단락</div>

        <div onClick={()=>{setForm("form2")}}
        className={`absolute w-[523.5px] h-[84.66px] top-[996px] left-[38.25px] border border-[1.5px] rounded-[12px] flex items-center justify-center ${
        form==="form2"?"border-[#6366F1]":"border-[#E4E4E7]"}`}></div>
        <div className={`absolute w-[22.5px] h-[22.5px] top-[1014px] left-[56.25px] border border-[1.5px]  rounded-[10px] ${
        form ==="form2" ? "bg-[#6366F1] border-[#6366F1]" : "border-[#E4E4E7]"}`}></div>
        <div className="absolute w-[35px] h-[23px] top-[1011.38px] left-[94.5px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">목록</div>
        <div className="absolute w-[140px] h-[19px] top-[1041.6px] left-[94.5px] font-inter font-normal text-[15.75px] leading-none text-[#27272A]">글머리 기호로 항목화</div>

        <div onClick={()=>{setForm("form3")}}
        className={`absolute w-[523.5px] h-[59.63px] top-[1092.66px] left-[38.25px] border border-[1.5px] rounded-[12px] flex items-center justify-center ${
        form==="form3"?"border-[#6366F1]":"border-[#E4E4E7]"}`}></div>
        <div className={`absolute w-[22.5px] h-[22.5px] top-[1110.66px] left-[56.25px] border border-[1.5px]  rounded-[10px] ${
        form ==="form3" ? "bg-[#6366F1]  border-[#6366F1]" : "border-[#E4E4E7]"}`}></div>
        <div className="absolute w-[74px] h-[23px] top-[1108.03px] left-[94.5px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">핵심 문장</div>

        <div onClick={()=>{setForm("form4")}}
        className={`absolute w-[523.5px] h-[59.63px] top-[1164.28px] left-[38.25px] border border-[1.5px]  rounded-[12px] flex items-center justify-center ${
          form ==="form4" ? "border-[#6366F1]":"border-[#E4E4E7]"}`}></div>
        <div className={`absolute w-[22.5px] h-[22.5px] top-[1182.28px] left-[56.25px] border border-[1.5px]  rounded-[10px] ${
        form ==="form4" ? "bg-[#6366F1]  border-[#6366F1]" : "border-[#E4E4E7]" }`}></div>
        <div className="absolute w-[52px] h-[23px] top-[1179.66px] left-[94.5px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">항목별</div>

        <div className="absolute whitespace-nowrap flex w-[68px] h-[21px] top-[1239.58px] left-[37.5px] font-inter font-bold text-[17.25px] leading-none text-[#52525B]">
          요약 관점
        </div>
        <div className="absolute w-[27px] h-[17px] top-[1241.68px] left-[537.87px] font-inter font-bold text-[14.25px] leading-none text-[#9A9AA3]">
          선택
        </div>

        <div className="absolute w-[523.5px] h-[55.5px] top-[1275.28px] left-[38.25px] border-[#E4E4E7] border border-[1.5px] rounded-[12px] flex items-center justify-center"></div>
        <div className="absolute w-[35px] h-[23px] top-[1288.59px] left-[55.5px] font-inter font-normal text-[18.75px] leading-none text-[#27272A]">전체</div>
        <div className="absolute w-[9px] h-[20px] top-[1290.36px] left-[535.36px] font-inter font-normal text-[16.5px] leading-none text-[#9A9AA3]">⌄</div>

        <div className="absolute w-[561px] h-[52.5px] top-[1366.03px] left-[19.5px] bg-[#FFFFFF] rounded-[12px]"></div>
        <div className="absolute w-[22.5px] h-[22.5px] top-[1381.03px] left-[37.5px] bg-[#6366F1] rounded-[6px]"></div>
        <div className="absolute w-[143px] h-[23px] top-[1379.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          항목별로 분류하기
        </div>

        <div className="absolute w-[201px] h-[19px] top-[1381.26px] left-[242.3px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          기준: 우선순위 · 다중 OFF
        </div>

        <div className="absolute w-[25px] h-[16px] top-[1382.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#6366F1]">
          필수
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1378.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[559.5px] h-[51px] top-[1435.78px] left-[20.25px] border-[#E4E4E7] border-[1.5px] rounded-[12px]"></div>
        <div className="absolute w-[21px] h-[21px] top-[1450.78px] left-[38.25px] border-[#D8A978] border-[1.5px] rounded-[6px]"></div>
        <div className="absolute w-[69px] h-[23px] top-[1448.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          비교하기
        </div>
        <div className="absolute w-[150px] h-[19px] top-[1450.26px] left-[236.06px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          대상 3 · 기준 4 →
        </div>

        <div className="absolute w-[44.33px] h-[19.5px] top-[1451.53px] left-[489.66px] bg-[#F0F0F3] rounded-[6px]"></div>
        <div className=" absolute w-[25px] h-[16px] top-[1451.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#9A9AA3]">
          선택
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1447.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[561px] h-[52.5] top-[1504.03px] left-[19.5px] bg-[#FFFFFF] rounded-[12px]"></div>
        <div className="absolute w-[22.5px] h-[22.5px] top-[1519.03px] left-[37.5px] bg-[#6366F1] rounded-[6px]"></div>
        <div className="absolute w-[143px] h-[23px] top-[1517.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
        순서대로 정리하기
        </div>

        <div className="absolute w-[155px] h-[19px] top-[1519.26px] left-[265.92px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          화면 · 기본
        </div>

        <div className="absolute w-[25px] h-[16px] top-[1520.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#6366F1]">
          필수
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1516.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[559.5px] h-[51px] top-[1573.78px] left-[20.25px] border-[#E4E4E7] border-[1.5px] rounded-[12px]"></div>
        <div className="absolute w-[21px] h-[21px] top-[1588.78px] left-[38.25px] border-[#D8A978] border-[1.5px] rounded-[6px]"></div>
        <div className="absolute w-[143px] h-[23px] top-[1586.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          기능으로 분해하기
        </div>
        <div className="absolute w-[87px] h-[19px] top-[1588.26px] left-[302.13px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          화면 · 기본
        </div>

        <div className="absolute w-[44.33px] h-[19.5px] top-[1589.53px] left-[489.66px] bg-[#F0F0F3] rounded-[6px]"></div>
        <div className=" absolute w-[25px] h-[16px] top-[1589.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#9A9AA3]">
          선택
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1585.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[559.5px] h-[51px] top-[1642.78px] left-[20.25px] border-[#E4E4E7] border-[1.5px] rounded-[12px]"></div>
        <div className="absolute w-[21px] h-[21px] top-[1657.78px] left-[38.25px] border-[#D8A978] border-[1.5px] rounded-[6px]"></div>
        <div className="absolute w-[126px] h-[23px] top-[1655.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          정책과 연결하기
        </div>
        <div className="absolute w-[68px] h-[19px] top-[1657.26px] left-[303.49px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          권한·상태
        </div>

        <div className="absolute w-[44.33px] h-[19.5px] top-[1658.53px] left-[489.66px] bg-[#F0F0F3] rounded-[6px]"></div>
        <div className=" absolute w-[25px] h-[16px] top-[1658.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#9A9AA3]">
          선택
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1654.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[559.5px] h-[51px] top-[1711.78px] left-[20.25px] border-[#E4E4E7] border-[1.5px] rounded-[12px]"></div>
        <div className="absolute w-[21px] h-[21px] top-[1726.78px] left-[38.25px] border-[#D8A978] border-[1.5px] rounded-[6px]"></div>
        <div className="absolute w-[130px] h-[23px] top-[1724.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          예외 케이스 찾기
        </div>
        <div className="absolute w-[92px] h-[19px] top-[1726.26px] left-[293.04px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          빈 상태·입력
        </div>

        <div className="absolute w-[44.33px] h-[19.5px] top-[1727.53px] left-[489.66px] bg-[#F0F0F3] rounded-[6px]"></div>
        <div className=" absolute w-[25px] h-[16px] top-[1727.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#9A9AA3]">
          선택
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1723.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[561px] h-[52.5px] top-[1780.03px] left-[19.5px] bg-[#FFFFFF] rounded-[12px]"></div>
        <div className="absolute w-[22.5px] h-[22.5px] top-[1795.03px] left-[37.5px] bg-[#6366F1] rounded-[6px]"></div>
        <div className="absolute w-[108px] h-[23px] top-[1793.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
        초안 작성하기
        </div>

        <div className="absolute w-[140px] h-[19px] top-[1795.26px] left-[257.58px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          보고서 · 자동 목차
        </div>

        <div className="absolute w-[25px] h-[16px] top-[1796.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#6366F1]">
          필수
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1792.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[561px] h-[52.5px] top-[1849.03px] left-[19.5px] bg-[#FFFFFF] rounded-[12px]"></div>
        <div className="absolute w-[22.5px] h-[22.5px] top-[1864.03px] left-[37.5px] bg-[#6366F1] rounded-[6px]"></div>
        <div className="absolute w-[126px] h-[23px] top-[1862.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
        표로 재구성하기
        </div>

        <div className="absolute w-[131px] h-[19px] top-[1864.26px] left-[271.99px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          비교 · 열 4개 →
        </div>

        <div className="absolute w-[25px] h-[16px] top-[1865.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#6366F1]">
          필수
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1861.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[559.5px] h-[51px] top-[1918.78px] left-[20.25px] border-[#E4E4E7] border-[1.5px] rounded-[12px]"></div>
        <div className="absolute w-[21px] h-[21px] top-[1933.03px] left-[37.5px] border-[#D8A978] border-[1.5px] rounded-[6px]"></div>
        <div className="absolute w-[160px] h-[23px] top-[1931.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          체크리스트로 바꾸기
        </div>
        <div className="absolute w-[77px] h-[19px] top-[1933.26px] left-[316.55px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          QA · 기본
        </div>

        <div className="absolute w-[44.33px] h-[19.5px] top-[1934.53px] left-[489.66px] bg-[#F0F0F3] rounded-[6px]"></div>
        <div className=" absolute w-[25px] h-[16px] top-[1934.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#9A9AA3]">
          선택
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1930.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[561px] h-[51px] top-[1987.03px] left-[19.5px] border-[#E4E4E7] border-[1.5px] rounded-[12px]"></div>
        <div className="absolute w-[21px] h-[21px] top-[2002.78px] left-[38.25px] border-[#D8A978] border-[1.5px] rounded-[6px]"></div>
        <div className="absolute w-[147px] h-[23px] top-[2000.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          질문 리스트 만들기
        </div>
        <div className="absolute w-[82px] h-[19px] top-[2002.26px] left-[307.45px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          요구 · 5개
        </div>

        <div className="absolute w-[44.33px] h-[19.5px] top-[2003.53px] left-[489.66px] bg-[#F0F0F3] rounded-[6px]"></div>
        <div className=" absolute w-[25px] h-[16px] top-[2003.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#9A9AA3]">
          선택
        </div>
        <div className="absolute w-[10px] h-[22px] top-[1999.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

      

        <div className="absolute w-[561px] h-[52.5px] top-[2056.03px] left-[19.5px] bg-[#FFFFFF] rounded-[12px]"></div>
        <div className="absolute w-[22.5px] h-[22.5px] top-[2140.03px] left-[37.5px] bg-[#6366F1] rounded-[6px]"></div>
        <div className="absolute w-[143px] h-[23px] top-[2138.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
        프롬프트 조립하기
        </div>

        <div className="absolute w-[155px] h-[19px] top-[2140.26px] left-[267.49px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          조각 5 · 표 출력 →
        </div>

        <div className="absolute w-[25px] h-[16px] top-[2141.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#6366F1]">
          필수
        </div>
        <div className="absolute w-[10px] h-[22px] top-[2137.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>
        
        <div className="absolute w-[559.5px] h-[51px] top-[2194.78px] left-[20.25px] border-[#E4E4E7] border-[1.5px] rounded-[12px]"></div>
        <div className="absolute w-[21px] h-[21px] top-[2209.78px] left-[38.25px] border-[#D8A978] border-[1.5px] rounded-[6px]"></div>
        <div className="absolute w-[164px] h-[23px] top-[2207.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          빈칸 프롬프트 채우기
        </div>
        <div className="absolute w-[131px] h-[19px] top-[2209.26px] left-[290.34px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          슬롯 4 · 카드 →
        </div>

        <div className="absolute w-[44.33px] h-[19.5px] top-[2210.53px] left-[489.66px] bg-[#F0F0F3] rounded-[6px]"></div>
        <div className=" absolute w-[25px] h-[16px] top-[2210.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#9A9AA3]">
          선택
        </div>
        <div className="absolute w-[10px] h-[22px] top-[2206.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[559.5px] h-[51px] top-[2263.78px] left-[20.25px] border-[#E4E4E7] border-[1.5px] rounded-[12px]"></div>
        <div className="absolute w-[21px] h-[21px] top-[2278.78px] left-[38.25px] border-[#D8A978] border-[1.5px] rounded-[6px]"></div>
        <div className="absolute w-[182px] h-[23px] top-[2276.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
          요약 프롬프트 배치하기
        </div>
        <div className="absolute w-[159px] h-[19px] top-[2278.26px] left-[284.27px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          카드 4 · 상세 ON →
        </div>

        <div className="absolute w-[44.33px] h-[19.5px] top-[2279.53px] left-[489.66px] bg-[#F0F0F3] rounded-[6px]"></div>
        <div className=" absolute w-[25px] h-[16px] top-[2279.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#9A9AA3]">
          선택
        </div>
        <div className="absolute w-[10px] h-[22px] top-[2275.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="absolute w-[561px] h-[52.5px] top-[2056.03px] left-[2056.03px] bg-[#FFFFFF] rounded-[12px]"></div>
        <div className="absolute w-[22.5px] h-[22.5px] top-[2071.03px] left-[37.5px] bg-[#6366F1] rounded-[6px]"></div>
        <div className="absolute w-[147px] h-[23px] top-[2069.16px] left-[72px] font-inter font-bold text-[18.75px] leading-none text-[#27272A]">
        특정 스킬 호출하기
        </div>

        <div className="absolute w-[140px] h-[19px] top-[2071.26px] left-[275.95px] font-SplineSansMono font-normal text-[15.75px] leading-none text-[#9A9AA3]">
          요약가 · 이전 결과
        </div>

        <div className="absolute w-[25px] h-[16px] top-[2072.83px] left-[500.16px] font-inter font-bold text-[13.5px] leading-none text-[#6366F1]">
          필수
        </div>
        <div className="absolute w-[10px] h-[22px] top-[2068.93px] left-[552px] font-inter font-normal text-[18px] leading-none text-[#9A9AA3]">
          ⌄
        </div>

        <div className="w-[597px] h-[85.5px] top-[2332.03px] left-[1.5px] bg-[#FFFFFF]">
            <hr className="absolute w-[597px] h-[0px] top-[2332.78px] left-[1.5px] border-[1.5px] border-[#E4E4E7]" />
            <div className=" absolute w-[265px] h-[20px] top-[2362.86px] left-[22.5px] font-inter font-normal text-[16.5px] leading-none text-[#9A9AA3]">필수 블록 충족 · 검토 노드로 전달 가능</div>
            <div
            onClick={() => setSave2(!save2)}
            className={`absolute w-[69.91px] h-[46.5px] top-[2352.28px] left-[506.84px] border border-[1.5px] rounded-[12px] flex items-center justify-center ${
              save2
                ? "bg-[#6366F1] border-[#6366F1]"
                : "bg-[#FFFFFF] border-[#E4E4E7]"
              }`}
            ></div>

            <div
              onClick={() => setSave2(!save2)}
              className={`absolute w-[35px] h-[23px] top-[2362.41px] left-[524.29px] font-inter font-bold text-[18.75px] leading-none flex items-center justify-center ${
                save2
                  ? "text-[#FFFFFF]"
                  : "text-[#27272A]"
              }`}
            >
            검증
          </div>
        </div>
      </div>
    </div>
  );
}