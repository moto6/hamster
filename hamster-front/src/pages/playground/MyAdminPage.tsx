// pages/UserPage.tsx
import {Card, CardContent, CardHeader, CardTitle} from "@/components/library/card.tsx";
import {ResponsiveContainer, Tooltip, Treemap} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";

const treemapData_bookInventory = [
    {name: '문학', size: 1416, fill: '#b8d98d'},
    {name: '사회과학', size: 712, fill: '#e0a370'},
    {name: '순수과학', size: 356, fill: '#d9e39d'},
    {name: '종교', size: 287, fill: '#eb4d3d'},
    {name: '역사', size: 277, fill: '#b8d98d'},
    {name: '철학', size: 261, fill: '#5cb346'},
    {name: '기술과학', size: 185, fill: '#8ec96d'},
    {name: '언어', size: 131, fill: '#1a912b'},
];


const treemapData_Loan = [
    {name: '문학', size: 416, fill: '#b8d98d'},
    {name: '사회과학', size: 212, fill: '#e0a370'},
    {name: '순수과학', size: 156, fill: '#d9e39d'},
    {name: '종교', size: 187, fill: '#eb4d3d'},
    {name: '역사', size: 1277, fill: '#b8d98d'},
    {name: '철학', size: 261, fill: '#5cb346'},
    {name: '기술과학', size: 1585, fill: '#8ec96d'},
    {name: '언어', size: 511, fill: '#1a912b'},
];

const generateMockData = (baseCount: number) => {
    return Array.from({length: 100}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * baseCount)
        };
    });
};

const loanData = generateMockData(5);   // 대출 데이터
const returnData = generateMockData(5); // 반납 데이터

const CustomizedContent = (props: any) => {
    const {x, y, width, height, index, name, size} = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: treemapData_bookInventory[index].fill,
                    stroke: '#fff',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                }}
                rx={4} // 둥근 모서리 추가
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                    fontWeight="bold"
                >
                    {`${name} (${size})`}
                </text>
            )}
        </g>
    );
};
// 커스텀 콘텐츠 (둥근 모서리와 텍스트 정렬)
// const CustomizedContent = (props: any) => {

export function MyAdminPage() {
    return (
        <div className="space-y-6">
            {/* ✅ 상단 히트맵 영역: 좌우 배치 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* 대출 현황 히트맵 (초록) */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">대출 현황 (최근 1년)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="loan-heatmap">
                            <CalendarHeatmap
                                gutterSize={3}
                                startDate={new Date('2025-01-01')}
                                endDate={new Date('2026-02-14')}
                                values={loanData}
                                classForValue={(value) => {
                                    if (!value || value.count === 0) return "color-empty";
                                    if (value.count <= 1) return "color-loan-1";
                                    if (value.count <= 3) return "color-loan-2";
                                    return "color-loan-3";
                                }}
                            />
                        </div>
                        <div className="flex justify-end items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="size-2.5 rounded-sm bg-slate-100"/>
                                <div className="size-2.5 rounded-sm bg-green-200"/>
                                <div className="size-2.5 rounded-sm bg-green-400"/>
                                <div className="size-2.5 rounded-sm bg-green-600"/>
                            </div>
                            <span>More</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 반납 현황 히트맵 (주황) */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">반납 현황 (최근 1년)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="return-heatmap">
                            <CalendarHeatmap
                                gutterSize={3}
                                startDate={new Date('2025-01-01')}
                                endDate={new Date('2026-02-14')}
                                values={returnData}
                                classForValue={(value) => {
                                    if (!value || value.count === 0) return "color-empty";
                                    if (value.count <= 1) return "color-loan-1";
                                    if (value.count <= 3) return "color-loan-2";
                                    return "color-loan-3";
                                }}
                            />
                        </div>
                        <div className="flex justify-end items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="size-2.5 rounded-sm bg-slate-100"/>
                                <div className="size-2.5 rounded-sm bg-orange-200"/>
                                <div className="size-2.5 rounded-sm bg-orange-400"/>
                                <div className="size-2.5 rounded-sm bg-orange-600"/>
                            </div>
                            <span>More</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">카테고리별 장서 보유 현황</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <Treemap
                                    data={treemapData_bookInventory}
                                    dataKey="size"
                                    content={<CustomizedContent/>}
                                >
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </Treemap>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">최근 30일 카테고리별 대출 현황</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <Treemap
                                    data={treemapData_Loan}
                                    dataKey="size"
                                    content={<CustomizedContent/>}
                                >
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </Treemap>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};