import React, {useMemo, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {AllCommunityModule, type ColDef, ModuleRegistry, type RowClickedEvent} from 'ag-grid-community';
import {useBookSkuManagement} from './useBookSkuManagement.ts';
import {Button} from '@/components/library/button.tsx';
import {Card, CardContent} from '@/components/library/card.tsx';
import {Input} from "@/components/library/input.tsx";
import {cn} from "@/core/utils.ts";
import {Edit, Plus, Search, Trash2, X} from 'lucide-react';


ModuleRegistry.registerModules([AllCommunityModule]);

export function BookSkuManagementPageV2() {
    const gridRef = React.useRef<any>(null);
    const defaultUserPageSize: number = 100;
    const [pageSize, setPageSize] = useState(defaultUserPageSize);
    const {books, loading, filter, setFilter, deleteBook, updatePageSize} = useBookSkuManagement();

    // Drawer 관련 상태
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 1. 컬럼 정의를 먼저 선언 (ReferenceError 방지)
    const columnDefs = useMemo<ColDef[]>(() => [
        {
            field: 'isbn',
            headerName: 'ISBN',
            width: 140,
            cellClass: 'font-mono text-xs text-slate-500 flex items-center justify-center'
        },
        {
            field: 'title',
            headerName: '도서명',
            minWidth: 200,
            flex: 2,
            cellClass: 'font-semibold text-slate-900 flex items-center '
        },
        {
            field: 'author',
            headerName: '저자',
            width: 150,
            cellRenderer: (p: any) => (
                <div className="flex flex-col justify-center h-full leading-tight">
                    <div className="text-sm">{p.data.author}</div>
                    <div className="text-xs text-slate-400">{p.data.publisher}</div>
                </div>
            )
        },
        {
            field: 'callNumber',
            headerName: '청구기호',
            width: 130,
            cellClass: "flex items-center justify-center",
            cellRenderer: (p: { value: string }) => (
                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-slate-600 leading-none">
                    {p.value}
                </span>
            )
        },
        {
            headerName: '재고',
            width: 100,
            cellClass: 'font-mono text-xs text-slate-500 flex items-center justify-center',
            cellRenderer: (p: any) => (
                <div className="flex items-center h-full font-medium">
                    {p.data.availableCopies} / {p.data.totalCopies}
                </div>
            )
        },
        {
            headerName: '작업',
            width: 100,
            sortable: false,
            filter: false,
            pinned: 'right',
            cellRenderer: (p: any) => (
                <div className="flex items-center justify-end gap-1 h-full">
                    <Button variant="ghost" size="sm" className="size-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <Edit className="size-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0 hover:bg-red-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            if(confirm('삭제하시겠습니까?')) deleteBook(p.data.id);
                        }}
                    >
                        <Trash2 className="size-4 text-red-400"/>
                    </Button>
                </div>
            )
        }
    ], [deleteBook]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true,
        filter: true,
    }), []);

    // 2. 이벤트 핸들러
    const onRowClicked = (event: RowClickedEvent) => {
        setSelectedBook(event.data);
        setIsDrawerOpen(true);
    };

    return (
        <div className="relative space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">장서 관리 V2</h1>
                    <p className="text-sm text-muted-foreground mt-1">도서 마스터 데이터와 장서 현황을 관리합니다</p>
                </div>
                <Button>
                    <Plus className="size-4 mr-2"/>
                    도서 등록
                </Button>
            </div>

            {/* 검색 필터 */}
            <Card className="bg-slate-50/50 shadow-none border-slate-200">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-2 max-w-2xl">
                        <select
                            className="h-9 w-32 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-ring transition-colors cursor-pointer shrink-0"
                            // value={searchType} onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="isbn">ISBN</option>
                            <option value="title">도서명</option>
                            <option value="author">저자</option>
                            <option value="callNumber">청구기호</option>
                        </select>
                        {/* 검색어 입력창 */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
                            <Input
                                placeholder="검색어를 입력하세요"
                                value={filter.keyword}
                                onChange={(e) => setFilter({...filter, keyword: e.target.value})}
                                className="pl-9 bg-white"
                            />
                        </div>

                        {/* 검색 버튼 */}
                        <Button className="shrink-0">
                            검색
                        </Button>
                    </div>

                    {/* 오른쪽: 페이지 크기 선택 */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm text-slate-500 font-medium">보기</span>
                        <select
                            className="h-9 w-24 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-ring transition-colors cursor-pointer"
                            value={pageSize}
                            onChange={(e) => {
                                const newSize = Number(e.target.value);
                                setPageSize(newSize); // AG Grid
                                updatePageSize(newSize); // API 호출용 훅 상태 갱신
                                gridRef.current?.api.setGridOption('paginationPageSize', newSize);
                            }}
                        >
                            <option value={20}>20개</option>
                            <option value={50}>50개</option>
                            <option value={100}>100개</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* 그리드 */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
                <div className="ag-theme-custom w-full h-[600px]">
                    <AgGridReact
                        ref={gridRef}
                        rowData={books.content}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        onRowClicked={onRowClicked}
                        rowStyle={{ cursor: 'pointer' }}
                        loading={loading}
                        enableCellTextSelection={true}
                        ensureDomOrder={true}
                        animateRows={true}
                        headerHeight={40}
                        rowHeight={48}
                        suppressCellFocus={true}
                        pagination={true}
                        paginationPageSize={pageSize}
                        onComponentStateChanged={(params) => {
                            params.api.paginationGoToPage(0);
                        }}
                    />
                </div>
            </Card>

            {/* Drawer Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Drawer Content */}
            <aside className={cn(
                "fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col",
                isDrawerOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {selectedBook && (
                    <>
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">장서 상세 현황</h2>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedBook.isbn}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}>
                                <X className="size-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <section className="flex gap-4">
                                <div className="w-24 h-32 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                                    No Image
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-slate-900 leading-tight">{selectedBook.title}</h3>
                                    <p className="text-sm text-slate-600">{selectedBook.author}</p>
                                    <p className="text-xs text-slate-400">{selectedBook.publisher} · {selectedBook.publishYear}</p>
                                </div>
                            </section>

                            <section className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-900">개별 장서 리스트 ({selectedBook.totalCopies})</h4>
                                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                                    {Array.from({ length: selectedBook.totalCopies }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold text-slate-500">
                                                    {i + 1}
                                                </span>
                                                <span className="font-mono text-xs font-medium text-slate-700">
                                                    {selectedBook.isbn}-{String(i + 1).padStart(3, '0')}
                                                </span>
                                            </div>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold",
                                                i < selectedBook.availableCopies ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                            )}>
                                                {i < selectedBook.availableCopies ? "대출가능" : "대출중"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                            <Button className="flex-1" variant="outline">정보 수정</Button>
                            <Button className="flex-1">대출 예약</Button>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}