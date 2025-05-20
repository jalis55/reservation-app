import React, { useState, useContext } from 'react';
import { FileText, Bell, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import brandLogo from '../assets/images/brandLogo.png';


const Navbar = () => {
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };


    return (
        <nav className="sticky top-0 z-50 flex justify-between px-6 py-4 md:px-12 lg:px-20 items-center bg-white shadow-md">
            <div className="flex items-center">
                <Link to="/">
                    <img
                        src={brandLogo}
                        alt="Brand Logo"
                        className="h-10 w-auto object-contain mr-3"
                        style={{ maxHeight: '40px' }}
                    />
                </Link>

            </div>

            <div className="flex items-center">
                <ul className="flex items-center space-x-2 md:space-x-6">
                    <li className="relative">
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
                            <ul className="absolute right-0 md:right-auto mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">

                                <li>
                                    <Link to="/curdt-report" className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer text-sm font-medium">
                                        Report(Current Date)
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/asondt-report" className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer text-sm font-medium">
                                        Report(AsOn Date)
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/rangedt-report" className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer text-sm font-medium">
                                        Report(Date Range)
                                    </Link>
                                </li>


                            </ul>
                        )}
                    </li>

                    <li>
                        <button className="relative p-2 text-gray-700 hover:text-rose-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500"></span>
                        </button>
                    </li>
                    {user && (
                        <li>
                            <span className="font-medium hidden md:inline">{user.email}</span>
                        </li>
                    )}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="group relative p-2 text-gray-700 hover:text-rose-500 hover:bg-gray-100 rounded-full transition-all duration-300"
                            disabled={isLoggingOut}
                        >
                            <LogOut
                                className={cn(
                                    "h-5 w-5 transition-all duration-300",
                                    isLoggingOut && "animate-[spin_0.8s_ease-in-out]",
                                    !isLoggingOut && "group-hover:scale-110"
                                )}
                            />
                            <span
                                className={cn(
                                    "absolute opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0 right-0 top-10 bg-gray-800 text-white text-xs rounded px-2 py-1 min-w-max",
                                    isLoggingOut && "bg-rose-500"
                                )}
                            >
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </span>
                            {isLoggingOut && (
                                <span className="absolute inset-0 rounded-full border-2 border-rose-500 border-r-transparent animate-spin"></span>
                            )}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;