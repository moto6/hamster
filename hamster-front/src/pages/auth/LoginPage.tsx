import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "@/core/auth/AuthContext.tsx";

export function LoginPage() {
    const {status, login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? '/';

    // 이미 로그인 상태면 앱으로.
    useEffect(() => {
        if (status === 'authed') navigate(from, {replace: true});
    }, [status, from, navigate]);

    return (
        <div className="flex min-h-screen w-full bg-white text-gray-900">
            <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"/>
                <div className="z-10 text-white text-center">
                    <p className="text-gray-400">이미지 넣을 공간</p>
                </div>
            </div>

            {/* 오른쪽: 로그인 영역 */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight">환영합니다!</h2>
                        <p className="mt-2 text-sm text-gray-500">로그인해서 계속하기</p>
                    </div>

                    {/* SSO 로그인: 백엔드 /api/v0/auth/login 으로 전체 페이지 이동(302→IDP) */}
                    <button
                        type="button"
                        onClick={() => login(from)}
                        disabled={status === 'loading'}
                        className="w-full bg-black py-3 text-white font-semibold rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        {status === 'loading' ? '확인 중...' : 'SSO 계정으로 로그인'}
                    </button>

                    {/* 개발용 데모 로그인 (Mock IDP). 운영 전환 시 이 블록만 삭제하면 됨. */}
                    <div className="pt-6 border-t border-dashed border-gray-200">
                        <p className="text-xs font-medium text-gray-400">개발용 임시 로그인 (Mock IDP)</p>
                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => login(from, 'admin')}
                                disabled={status === 'loading'}
                                className="flex-1 h-10 rounded-md border border-blue-300 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 disabled:opacity-50 transition-colors"
                            >
                                admin.demo
                            </button>
                            <button
                                type="button"
                                onClick={() => login(from, 'user')}
                                disabled={status === 'loading'}
                                className="flex-1 h-10 rounded-md border border-gray-300 bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                            >
                                user.demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
