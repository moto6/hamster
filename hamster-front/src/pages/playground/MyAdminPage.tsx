// pages/UserPage.tsx
import {Card, CardContent, CardHeader, CardTitle} from "@/components/library/card.tsx";
import {ResponsiveContainer, Tooltip, Treemap} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import React from "react";

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

const getLoanColor = (count?: number) => {
    if (!count || count === 0) return "#e5e7eb"; // slate-200
    if (count <= 1) return "#bbf7d0";            // green-200
    if (count <= 3) return "#4ade80";            // green-400
    return "#16a34a";                            // green-600
};

const getReturnColor = (count?: number) => {
    if (!count || count === 0) return "#e5e7eb"; // slate-200
    if (count <= 1) return "#fed7aa";            // orange-200
    if (count <= 3) return "#fb923c";            // orange-400
    return "#ea580c";                            // orange-600
};

const generateMockData = (baseCount: number) => {
    return Array.from({length: 470}, (_, i) => {
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
            {/* ================= 히트맵 ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* 대출 */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            대출 현황 (최근 1년)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 pb-4">
                        <CalendarHeatmap
                            startDate={new Date("2025-01-01")}
                            endDate={new Date("2026-02-14")}
                            values={loanData}
                            gutterSize={3}
                            transformDayElement={(element, value) =>
                                React.cloneElement(element, {
                                    rx: 2,
                                    ry: 2,
                                    fill: getLoanColor(value?.count),
                                    stroke: "transparent",
                                })
                            }
                        />

                        {/* 범례 */}
                        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="size-3 rounded-sm bg-slate-200"/>
                                <div className="size-3 rounded-sm bg-green-200"/>
                                <div className="size-3 rounded-sm bg-green-400"/>
                                <div className="size-3 rounded-sm bg-green-600"/>
                            </div>
                            <span>More</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 반납 */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            반납 현황 (최근 1년)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 pb-4">
                        <CalendarHeatmap
                            startDate={new Date("2025-01-01")}
                            endDate={new Date("2026-02-14")}
                            values={returnData}
                            gutterSize={3}
                            transformDayElement={(element, value) =>
                                React.cloneElement(element, {
                                    rx: 2,
                                    ry: 2,
                                    fill: getReturnColor(value?.count),
                                    stroke: "transparent",
                                })
                            }
                        />

                        {/* 범례 */}
                        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="size-3 rounded-sm bg-slate-200"/>
                                <div className="size-3 rounded-sm bg-orange-200"/>
                                <div className="size-3 rounded-sm bg-orange-400"/>
                                <div className="size-3 rounded-sm bg-orange-600"/>
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