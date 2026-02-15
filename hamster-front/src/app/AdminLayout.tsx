// @/app/AdminLayout.tsx

import {Gnb} from "@/app/gnb/Gnb.tsx";
import {Link} from "react-router-dom";
import Header from "@/app/Header.tsx";
import Footer from "@/app/Footer.tsx";
import {TabBar} from "@/app/tab/TabBar.tsx";
import {TabProvider} from "@/app/tab/TabStore.tsx";
import {TabContainer} from "@/app/tab/TabContainer.tsx";

export function AdminLayout() {
    return (
        <TabProvider>
        <div className="flex h-screen dark:bg-slate-950">
            {/* 좌측 GNB */}
            <aside
                className="w-[200px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                    <Link to="/" className="no-underline">
                        <h2 className="text-lg font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                            Library <span className="font-bold">Admin</span>
                        </h2>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-100">
                    <Gnb/>
                </div>
            </aside>

            {/* 우측 메인 영역 */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header>
                    <TabBar/>
                </Header>

                <main className="flex-1 relative min-h-0 overflow-hidden bg-slate-50">
                    <TabContainer/>
                </main>
                <Footer/>
            </div>
        </div>
        </TabProvider>
    )
}
