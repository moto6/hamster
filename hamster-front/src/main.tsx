// @/main.tsx
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {AdminLayout} from "@/app/AdminLayout.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import './index.css'
import {GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";

async function enableMocking() {
    if (import.meta.env.VITE_IS_MOCK !== 'true') {
        return
    }
    const { worker } = await import('./mocks/browser')
    return worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
            url: '/mockServiceWorker.js',
        }
    })
}
enableMocking().then(() => {
// Main BEGIN
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<AdminLayout/>}>
                    <Route path="/" element={<Navigate to="/admin" replace/>}/>
                    {GNB_NAV_ITEMS.map((item) => (
                        <Route
                            key={item.path}
                            path={item.path}
                            element={item.element}
                        />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
// Main END
})
