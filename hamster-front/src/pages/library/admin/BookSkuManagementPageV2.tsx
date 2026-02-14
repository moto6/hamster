import {useMemo, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {AllCommunityModule, type ColDef, ModuleRegistry} from 'ag-grid-community';
import {useBookSkuManagement} from './useBookSkuManagement.ts';
import {Button} from '@/components/library/button.tsx';
import {Card, CardContent} from '@/components/library/card.tsx';
import {Input} from "@/components/library/input.tsx";
import {Edit, Plus, Search, Trash2} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

export function BookSkuManagementPageV2() {
    const {books, loading, filter, setFilter, deleteBook} = useBookSkuManagement();
    // 1. 상세 데이터를 보여줄 상태 추가
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 2. 행 클릭 이벤트 핸들러
    const onRowClicked = (event: any) => {
        // 클릭한 행의 데이터를 저장하고 Drawer를 엽니다.
        setSelectedBook(event.data);
        setIsDrawerOpen(true);
    };

    // 3. AG Grid 설정에 추가
    <AgGridReact
        rowData={books.content}
        columnDefs={columnDefs}
        onRowClicked={onRowClicked} // 행 클릭 시 함수 실행
        rowStyle={{cursor: 'pointer'}} // 마우스 커서를 포인터로 변경
        // ...기존 설정
    />

    const columnDefs = useMemo<ColDef[]>(() => [
        {
            field: 'isbn',
            headerName: 'ISBN',
            width: 150,
            cellClass: 'font-mono text-xs text-slate-500 flex items-center'
        },
        {
            field: 'title',
            headerName: '도서명',
            flex: 1,
            cellClass: 'font-semibold text-slate-900 flex items-center'
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
            cellRenderer: (p: any) => (
                <div className="flex items-center h-full">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-slate-600">
                        {p.value}
                    </span>
                </div>
            )
        },
        {
            headerName: '재고',
            width: 100,
            cellRenderer: (p: any) => (
                <div className="text-center font-medium">
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
                    <Button variant="ghost" size="sm" className="size-8 p-0">
                        <Edit className="size-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0 hover:bg-red-50"
                        onClick={() => deleteBook(p.data.id)}
                    >
                        <Trash2 className="size-4 text-red-400"/>
                    </Button>
                </div>
            )
        }
    ], [deleteBook]);

    // AG Grid 기본 설정
    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true,
        filter: true,
    }), []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">장서 관리 V2 (AG Grid)</h1>
                    <p className="text-sm text-muted-foreground mt-1">대량의 도서 데이터를 효율적으로 관리합니다</p>
                </div>
                <Button>
                    <Plus className="size-4 mr-2"/>
                    도서 등록
                </Button>
            </div>

            {/* 필터 카드 */}
            <Card className="bg-slate-50/50 shadow-none">
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
                            <Input
                                placeholder="고급 검색 (ISBN, 제목, 저자)..."
                                value={filter.keyword}
                                onChange={(e) => setFilter({...filter, keyword: e.target.value})}
                                className="pl-9 bg-white"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 그리드 영역 */}
            <Card className="overflow-hidden border-slate-200">
                <div className="ag-theme-custom w-full h-[600px]">
                    <AgGridReact
                        rowData={books.content}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        loading={loading}
                        animateRows={true}
                        headerHeight={48}
                        rowHeight={56}
                        rowSelection="multiple"
                        suppressCellFocus={true}
                    />
                </div>
            </Card>
        </div>

    );
}

