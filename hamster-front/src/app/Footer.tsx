export default function Footer() {
    return (
        <footer className="
      h-12
      border-t border-slate-200
      bg-white
      dark:bg-slate-900 dark:border-slate-700
      flex items-center justify-between
      px-6
      text-sm text-slate-500 dark:text-slate-400
      flex-shrink-0
    ">
      <span>
        © {new Date().getFullYear()} Hamster Admin
      </span>

            <span className="opacity-70">
        All rights reserved
      </span>
        </footer>
    )
}
