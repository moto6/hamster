import {useEffect, useRef, useState} from "react";
import {authService} from "@/core/authService.ts";

export default function ProfileCard() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative flex items-center gap-2 shrink-0" ref={dropdownRef}>
            <span className="text-xs text-slate-500 hidden sm:inline">User</span>

            {/* 트리거 버튼 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-[12px] text-white font-bold hover:shadow-md transition-all active:scale-95"
            >
                U
            </button>

            {/* 팝업 카드 */}
            {isOpen && (
                <div
                    className="absolute right-0 top-10 w-72 bg-[#E9EEF6] rounded-[24px] p-4 shadow-xl z-50 border border-slate-200 animate-in fade-in zoom-in duration-150 origin-top-right">
                    <div className="flex flex-col items-center">
                        <span className="text-[12px] font-medium text-slate-600 mb-4">demo@deno.com</span>

                        <div
                            className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold mb-3">
                            U
                        </div>

                        <h3 className="text-lg font-medium text-slate-900 mb-5">안녕하세요, User님.</h3>

                        <button
                            className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-full text-sm font-medium text-blue-500 mb-3 transition-colors">
                            계정 관리
                        </button>
                        <button
                            className="w-full py-2 bg-white rounded-full text-sm border border-slate-300 font-medium text-slate-700 mb-3 hover:bg-slate-50 transition-colors"
                            onClick={() => authService.logout()}>
                            로그아웃
                        </button>

                        {/*<div*/}
                        {/*    className="grid grid-cols-2 w-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">*/}
                        {/*    <button*/}
                        {/*        className="py-3 text-xs font-medium text-slate-700 hover:bg-slate-50 border-r border-slate-100">*/}
                        {/*        계정 추가*/}
                        {/*    </button>*/}
                        {/*    <button className="py-3 text-xs font-medium text-slate-700 hover:bg-slate-50">*/}
                        {/*        로그아웃*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            )}
        </div>
    );
}