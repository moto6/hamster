// // @/app/tab/TabBar.tsx
// import {useNavigate} from 'react-router-dom'
// import {useAdminTabs} from "@/app/tab/tabs.ts";
//
// export function TabBar() {
//     const {tabs, activeKey, closeTab, setActive} = useAdminTabs()
//     const navigate = useNavigate()
//
//     return (
//         <div className="flex bg-slate-100 border-b border-slate-300">
//             {tabs.map(tab => (
//                 <div
//                     key={tab.key}
//                     className={`
//             flex items-center gap-2 px-4 py-2 text-sm cursor-pointer
//             border-r border-slate-300
//             ${tab.key === activeKey
//                         ? 'bg-white font-semibold'
//                         : 'hover:bg-slate-200'}
//           `}
//                     onClick={() => {
//                         setActive(tab.key)
//                         navigate(tab.path)
//                     }}
//                 >
//                     {tab.title}
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation()
//                             closeTab(tab.key)
//                         }}
//                         className="text-slate-400 hover:text-red-500"
//                     >
//                         ✕
//                     </button>
//                 </div>
//             ))}
//         </div>
//     )
// }
