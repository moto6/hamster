// @/main.tsx
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {AdminLayout} from "@/app/AdminLayout.tsx";
import {BrowserRouter} from "react-router-dom";
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AdminLayout/>
        </BrowserRouter>
    </StrictMode>,
)
