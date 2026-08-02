export function BottomBar(props: { context: string, btnText: string }) {
    return (
        <div className="w-[496px] h-[86px] ml-[-44px] mt-[16px] px-[42px] bg-white flex items-center justify-between border-t-[1.5px] border-[#E4E4E7]">
            <p className="text-[#9A9AA3] text-[15.5px]">{props.context}</p>
            <div className="cursor-pointer hover:bg-[#6366F1] hover:text-white w-[66px] h-[38px] flex items-center justify-center border-[2px] border-[#E4E4E7] rounded-[8px] 
            text-[13px] text-[#666] font-bold">{props.btnText}</div>
        </div>
    )
}