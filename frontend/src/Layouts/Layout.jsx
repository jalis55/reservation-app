import Navbar from '@/components/Navbar';
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div>
            <Navbar />
            <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;
