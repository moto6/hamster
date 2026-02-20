import React, {useState} from "react";
import {useAuth} from "@/pages/auth/useAuth.ts";

export function LoginPage() {
    const [email, setEmail] = useState('demo@demo.com');
    const [password, setPassword] = useState("werfkewnjfni1novnswn1kl2321kl3l1k2");
    const {login, isLoading} = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="flex min-h-screen w-full bg-white text-gray-900">
            <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"/>
                <div className="z-10 text-white text-center">
                    <p className="text-gray-400">이미지 넣을 공간</p>
                    {/* <img src="..." className="object-cover w-full h-full" /> */}
                </div>
            </div>

            {/* 오른쪽: 로그인 폼 영역 */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight">환영합니다!</h2>
                        <p className="mt-2 text-sm text-gray-500">로그인해서 계속하기</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">이메일 주소</label>
                                <input
                                    type="email"
                                    placeholder="Input your email"
                                    className="mt-1 w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">비밀번호</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="mt-1 w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm">
                                <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300"/>
                                Remember me
                            </label>
                            <a href="#" className="text-sm font-semibold hover:underline">Forgot Password?</a>
                        </div>

                        <button type="submit"
                                className="w-full bg-black py-3 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors">
                            {isLoading ? '로그인 중...' : 'Login'}
                        </button>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 flex-shrink text-sm text-gray-400">Or Continue with</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <button type="button"
                                className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                            <img src="/asset/icon/google.svg"
                                 width="18" alt="google"/>
                            Continue with Google
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account? <a href="#" className="font-bold text-black hover:underline">Sign up
                        here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}