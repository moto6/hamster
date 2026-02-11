// @/app/gnb/Gnb.tsx
import {useNavigate} from 'react-router-dom'
import {GNB_NAV_GROUPS, GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";


export function Gnb() {
    const navigate = useNavigate()
    // const openTab = useAdminTabs(s => s.openTab)

    return (
        <div className="flex flex-col">

            {/* 상단 타이틀 */}
            <div className="px-4 py-4 text-lg font-bold border-b border-slate-700">
                {/*Navigation*/}
            </div>

            <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">

                {GNB_NAV_GROUPS.map(group => {
                    const items = GNB_NAV_ITEMS.filter(
                        i => i.category === group.category && !i.hidden
                    )

                    if (items.length === 0) return null

                    return (
                        <div key={group.category}>
                            {/* 그룹 타이틀 */}
                            <div className="
                px-3 mb-1
                text-xs uppercase
                tracking-wider
                text-slate-400
              ">
                                {group.title}
                            </div>

                            {/* 그룹 메뉴 */}
                            <div className="space-y-1">
                                {items.map(item => (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)} // openTab 제거
                                        className={"w-full text-left px-3 py-2 rounded transition text-sm bg-slate-200 dark:bg-slate-800 font-bold text-blue-600"}
                                    >
                                    {/*    className={cn(*/}
                                    {/*    "w-full text-left px-3 py-2 rounded transition text-sm",*/}
                                    {/*    pathname === item.path*/}
                                    {/*        ? "bg-slate-200 dark:bg-slate-800 font-bold text-blue-600"*/}
                                    {/*        : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"*/}
                                    {/*)}   */}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}

            </nav>
        </div>
    )
}
