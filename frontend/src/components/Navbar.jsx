import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import brandLogo from '../assets/images/brandLogo.png';
import { User, ChevronDown, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/lib/useClickOutside';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);

    // Refs for dropdowns
    const emailDropdownRef = useRef(null);
    const reportsDropdownRef = useRef(null);

    // Close dropdowns when clicking outside
    useClickOutside(emailDropdownRef, () => setEmailOpen(false));
    useClickOutside(reportsDropdownRef, () => setIsReportsOpen(false));

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-100 w-[80%] shadow m-auto mt-4 rounded-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: logo + desktop links */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img src={brandLogo} alt="Brand Logo" className="h-9 w-auto" />
                        </Link>
                        
                        <div className="hidden md:block ml-10">
                            <ul className="flex items-center space-x-6 text-sm font-medium">
                                {user && user.isAdmin && (
                                    <li className="relative" ref={reportsDropdownRef}>
                                        <button
                                            onClick={() => setIsReportsOpen(!isReportsOpen)}
                                            className="flex items-center px-3 py-2 text-gray-700 hover:text-rose-500 rounded-md transition-colors group"
                                        >
                                            <FileText className="h-5 w-5 mr-2" />
                                            <span className="font-medium hidden md:inline">Reports</span>
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 ml-1 transition-transform duration-200",
                                                    isReportsOpen && "rotate-180"
                                                )}
                                            />
                                        </button>

                                        {isReportsOpen && (
                                            <ul className="absolute right-0 md:right-auto mt-2 w-48 bg-gray-200 border border-gray-200 rounded-md shadow-lg py-1 z-50">
                                                <li>
                                                    <Link to="/curdt-report" className="flex items-center px-4 py-2 hover:bg-stone-100 text-gray-700 cursor-pointer text-sm font-medium">
                                                        Report(Current Date)
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/asondt-report" className="flex items-center px-4 py-2 hover:bg-stone-100 text-gray-700 cursor-pointer text-sm font-medium">
                                                        Report(AsOn Date)
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/rangedt-report" className="flex items-center px-4 py-2 hover:bg-stone-100 text-gray-700 cursor-pointer text-sm font-medium">
                                                        Report(Date Range)
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right: user dropdown (desktop) */}
                    <div className="hidden md:flex items-center">
                        <div className="relative" ref={emailDropdownRef}>
                            <button
                                onClick={() => setEmailOpen(!emailOpen)}
                                className="flex items-center space-x-1 text-sm hover:text-yellow-700 focus:outline-none"
                            >
                                <User className="h-[20px] w-[20px] rounded-full object-cover bg-gray-200" />
                                <span>{user?.email}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {emailOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-gray-200 rounded-md shadow-lg py-1 z-20">
                                    <button 
                                        className="block w-full text-left px-4 py-2 text-sm rounded-md hover:bg-stone-100" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-md hover:bg-yellow-200 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu panel */}
            {mobileOpen && (
                <div className="md:hidden">
                    <ul className="px-2 pt-2 pb-3 space-y-1 text-sm font-medium">
                        <li><a href="#" className="block px-3 py-2 rounded-md hover:bg-yellow-200">Home</a></li>
                    </ul>
                    <div className="border-t border-black-200 px-2 py-3 space-y-2 text-sm">
                        <div className="relative" ref={emailDropdownRef}>
                            <button
                                onClick={() => setEmailOpen(!emailOpen)}
                                className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-stone-200"
                            >
                                <span className='flex justify-between gap-2'>
                                    <User className="h-[20px] w-[20px] rounded-full object-cover bg-gray-200" />
                                    {user?.email}
                                </span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {emailOpen && (
                                <button 
                                    className="block w-full text-left px-3 py-2 pl-8 text-sm rounded-md hover:bg-stone-400" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;