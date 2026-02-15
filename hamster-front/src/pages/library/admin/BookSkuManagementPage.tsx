//@/pages/library/admin/BookSkuManagementPage.tsx
import {useState} from 'react';
import {useBookSkuManagement} from './useBookSkuManagement.ts';
import {Button} from '@/components/library/button.tsx';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/library/dialog.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/library/table.tsx';
import {Card, CardContent} from '@/components/library/card.tsx';
import {Edit, Plus, Trash2} from 'lucide-react';
import {Textarea} from '@/components/library/textarea.tsx';
import {Input} from "@/components/library/input.tsx";
import {Label} from "@/components/core/label.tsx";

export function BookSkuManagementPage() {
    const {books, loading, filter, setFilter, createBook, updateBook, deleteBook} = useBookSkuManagement();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        isbn: '',
        title: '',
        author: '',
        publisher: '',
        publishYear: new Date().getFullYear(),
        callNumber: '',
        category: '',
        description: '',
        coverImageUrl: '',
        totalCopies: 1,
    });

    const handleSubmit = async () => {
        if (editingBook) {
            const success = await updateBook(editingBook, formData);
            if (success) {
                setIsDialogOpen(false);
                resetForm();
            }
        } else {
            const success = await createBook(formData);
            if (success) {
                setIsDialogOpen(false);
                resetForm();
            }
        }
    };

    const resetForm = () => {
        setFormData({
            isbn: '',
            title: '',
            author: '',
            publisher: '',
            publishYear: new Date().getFullYear(),
            callNumber: '',
            category: '',
            description: '',
            coverImageUrl: '',
            totalCopies: 1,
        });
        setEditingBook(null);
    };

    const handleEdit = (book: typeof books.content[0]) => {
        setFormData({
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            publishYear: book.publishYear,
            callNumber: book.callNumber,
            category: book.category,
            description: book.description || '',
            coverImageUrl: book.coverImageUrl || '',
            totalCopies: book.totalCopies,
        });
        setEditingBook(book.id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            await deleteBook(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-700">장서/SKU 관리</h1>
                    <p className="text-sm text-slate-500 mt-1">도서 마스터 데이터를 관리합니다</p>
                </div>
                <Button onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                }}>
                    <Plus className="size-4 mr-2"/>
                    도서 등록
                </Button>
            </div>

            <Card className="bg-slate-50/50">
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        {/*<CardHeader>*/}
                        {/*    <CardTitle>검색 필터</CardTitle>*/}
                        {/*</CardHeader>*/}
                        <Input
                            placeholder="도서명, ISBN, 저자 검색..."
                            value={filter.keyword}
                            onChange={(e) => setFilter({...filter, keyword: e.target.value, page: 0})}
                            className="max-w-md"
                        />
                        <Button>검색</Button>
                        {/*<Search className="size-4 mr-2"/>*/}
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-slate-200 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead
                                    className="w-[140px] text-xs font-semibold uppercase tracking-wider text-slate-500">ISBN</TableHead>
                                <TableHead
                                    className="text-xs font-semibold uppercase tracking-wider text-slate-500">도서명</TableHead>
                                <TableHead
                                    className="text-xs font-semibold uppercase tracking-wider text-slate-500">저자/출판사</TableHead>
                                <TableHead
                                    className="text-xs font-semibold uppercase tracking-wider text-slate-500">청구기호</TableHead>
                                <TableHead
                                    className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">재고</TableHead>
                                <TableHead
                                    className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">데이터를
                                    불러오는 중입니다...</TableCell></TableRow>
                            ) : ((books?.content?.length ?? 0) === 0) ? (
                                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">등록된
                                    도서 데이터가 없습니다.</TableCell></TableRow>
                            ) : (
                                books.content.map((book) => (
                                    <TableRow key={book.id} className="group transition-colors hover:bg-slate-50/50">
                                        {/* 1. ISBN: 모노톤으로 코드 느낌 강조 */}
                                        <TableCell className="font-mono text-xs text-slate-500">{book.isbn}</TableCell>

                                        {/* 2. 도서명: 가장 굵게 하여 주인공으로 만듦 */}
                                        <TableCell>
                                            <div className="font-semibold text-slate-900">{book.title}</div>
                                            <div className="text-xs text-muted-foreground md:hidden">{book.author}</div>
                                        </TableCell>

                                        {/* 3. 저자/출판사: 두 정보를 묶어서 공간 효율성 확보 */}
                                        <TableCell>
                                            <div className="text-sm text-slate-700">{book.author}</div>
                                            <div
                                                className="text-xs text-slate-400">{book.publisher}, {book.publishYear}</div>
                                        </TableCell>

                                        {/* 4. 청구기호: 배경을 살짝 깔아 '태그' 느낌 주기 */}
                                        <TableCell>
                <span
                    className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-600">
                  {book.callNumber}
                </span>
                                        </TableCell>

                                        {/* 5. 재고: 숫자 데이터는 정렬과 대비가 중요 */}
                                        <TableCell className="text-center">
                                            <div
                                                className="text-sm font-medium text-slate-900">{book.availableCopies} / {book.totalCopies}</div>
                                            <div className="text-[10px] uppercase text-slate-400">Available</div>
                                        </TableCell>

                                        {/* 6. 작업: Group Hover 기능을 써서 마우스를 올렸을 때만 선명하게 */}
                                        <TableCell className="text-right">
                                            <div
                                                className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button variant="ghost" size="icon" className="size-8"
                                                        onClick={() => handleEdit(book)}>
                                                    <Edit className="size-4 text-slate-500"/>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8 hover:bg-red-50"
                                                        onClick={() => handleDelete(book.id)}>
                                                    <Trash2 className="size-4 text-red-400"/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingBook ? '도서 수정' : '도서 등록'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="isbn">ISBN *</Label>
                                <Input
                                    id="isbn"
                                    value={formData.isbn}
                                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="callNumber">청구기호 *</Label>
                                <Input
                                    id="callNumber"
                                    value={formData.callNumber}
                                    onChange={(e) => setFormData({...formData, callNumber: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">도서명 *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="author">저자 *</Label>
                                <Input
                                    id="author"
                                    value={formData.author}
                                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">분류 *</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="publisher">출판사 *</Label>
                                <Input
                                    id="publisher"
                                    value={formData.publisher}
                                    onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="publishYear">출판년도 *</Label>
                                <Input
                                    id="publishYear"
                                    type="number"
                                    value={formData.publishYear}
                                    onChange={(e) => setFormData({...formData, publishYear: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalCopies">총 보유 권수 *</Label>
                            <Input
                                id="totalCopies"
                                type="number"
                                min="1"
                                value={formData.totalCopies}
                                onChange={(e) => setFormData({...formData, totalCopies: parseInt(e.target.value)})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coverImageUrl">표지 이미지 URL</Label>
                            <Input
                                id="coverImageUrl"
                                value={formData.coverImageUrl}
                                onChange={(e) => setFormData({...formData, coverImageUrl: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">설명</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e: { target: { value: any; }; }) => setFormData({...formData, description: e.target.value})}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            취소
                        </Button>
                        <Button onClick={handleSubmit}>
                            {editingBook ? '수정' : '등록'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
