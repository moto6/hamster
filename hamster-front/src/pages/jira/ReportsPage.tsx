import { BarChart2 } from 'lucide-react';

export function ReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
      <BarChart2 size={48} strokeWidth={1} className="text-muted-foreground/50" />
      <p className="text-base">Reports page coming soon</p>
      <p className="text-sm">This page will show project metrics and charts.</p>
    </div>
  );
}
