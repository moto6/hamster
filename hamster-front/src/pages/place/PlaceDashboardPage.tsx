import {usePlaceDashboard} from "@/pages/place/usePlaceDashboard.ts";
import {CalendarCheck, Clock, DoorOpen, TrendingUp} from "lucide-react";

export function PlaceDashboardPage() {
    const { data, isLoading } = usePlaceDashboard();

    if (isLoading || !data) return <div className="p-8 text-slate-500">데이터를 불러오는 중...</div>;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">장소 관리 현황</h1>
                <p className="text-slate-500">전체 장소의 예약 및 이용 상태를 실시간으로 확인합니다.</p>
            </header>

            {/* 통계 카드 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<DoorOpen />} label="운영 중인 장소" value={data.summary.totalPlaces} unit="개" color="blue" />
                <StatCard icon={<CalendarCheck />} label="오늘 예약 건수" value={data.summary.todayBookings} unit="건" color="emerald" />
                <StatCard icon={<Clock />} label="현재 이용 중" value={data.summary.activeReservations} unit="곳" color="amber" />
                <StatCard icon={<TrendingUp />} label="평균 점유율" value={data.summary.occupancyRate} unit="%" color="indigo" />
            </div>

            {/* 하단 상세 테이블 */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200">최근 예약 리스트</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">장소명</th>
                            <th className="px-6 py-3 text-left font-medium">예약자</th>
                            <th className="px-6 py-3 text-left font-medium">이용 시간</th>
                            <th className="px-6 py-3 text-left font-medium">상태</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.recentReservations.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{item.placeName}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.userName}</td>
                                <td className="px-6 py-4 text-slate-500 italic">
                                    {new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ~
                                    {new Date(item.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={item.status} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

// 재사용 컴포넌트들
function StatCard({ icon, label, value, unit, color }: any) {
    const colorMap: any = {
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
        indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
    };
    return (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg mb-3 ${colorMap[color]}`}>{icon}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</span>
                <span className="text-sm text-slate-400">{unit}</span>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        CONFIRMED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    };
    const text: any = { CONFIRMED: "확정", PENDING: "대기", CANCELLED: "취소" };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status]}`}>
      {text[status]}
    </span>
    );
}