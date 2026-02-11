interface HeaderProps {
    className?: string
}

export default function Header({ className = "" }: HeaderProps) {
    return (
        <header
            className={`
        h-16
        flex items-center
        border-b border-slate-200
        bg-white
        px-6
        dark:bg-slate-900 dark:border-slate-700
        ${className}
      `}
        >
            {/* 좌측 타이틀 */}
            <h1 className="text-lg font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                MY Libray Admin Demo
            </h1>

            {/* 우측 유저 영역 */}
            <div className="ml-auto flex items-center gap-3">
                <div className="
          w-8 h-8
          rounded-full
          bg-slate-300
          dark:bg-slate-700
          flex items-center justify-center
          text-xs font-medium
          text-slate-700 dark:text-slate-200
        ">
                    U
                </div>

                <span className="text-sm text-slate-600 dark:text-slate-400">
          User
        </span>
            </div>
        </header>
    )
}
