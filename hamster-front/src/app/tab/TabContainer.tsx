// // @/app/tab/TabContainer.tsx
//
// import {useAdminTabs} from "@/app/tab/tabs.ts";
//
// export function TabContainer() {
//     const {tabs, activeKey} = useAdminTabs()
//     const activeTab = tabs.find(t => t.key === activeKey)
//
//     return (
//         <div className="flex-1 overflow-auto bg-white p-6">
//             {activeTab?.element}
//         </div>
//     )
// }
//
