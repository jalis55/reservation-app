import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Bell, LogOut, ChevronDown, User, Settings, Key, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext';
import brandLogo from '../assets/images/brandLogo.png';

const Navbar = () => {
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const reportLinks = [
        { path: '/curdt-report', label: 'Report (Current Date)' },
        { path: '/asondt-report', label: 'Report (As On Date)' },
        { path: '/rangedt-report', label: 'Report (Date Range)' }
    ];

    const userMenuItems = [
        { icon: <User className="h-4 w-4 mr-3" />, label: 'Profile', path: '/profile' },
        { icon: <Settings className="h-4 w-4 mr-3" />, label: 'Settings', path: '/settings' },
        { icon: <Key className="h-4 w-4 mr-3" />, label: 'Reset Password', path: '/reset-password' },
        { icon: <HelpCircle className="h-4 w-4 mr-3" />, label: 'Help', path: '/help' },
        { 
            icon: <LogOut className="h-4 w-4 mr-3" />, 
            label: 'Logout', 
            action: handleLogout,
            isDestructive: true
        }
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img
                                src={brandLogo}
                                alt="Company Logo"
                                className="h-10 w-auto object-contain"
                                style={{ maxHeight: '40px' }}
                            />
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center space-x-4">
                        <ul className="flex items-center space-x-2 md:space-x-4">
                            {/* Reports Dropdown */}
                            {user?.isAdmin && (
                                <li className="relative">
                                    <button
                                        onClick={() => setIsReportsOpen(!isReportsOpen)}
                                        className="flex items-center px-3 py-2 text-gray-700 hover:text-rose-500 rounded-md transition-colors"
                                        aria-expanded={isReportsOpen}
                                        aria-haspopup="true"
                                    >
                                        <FileText className="h-5 w-5 mr-2" />
                                        <span className="font-medium hidden md:inline">Reports</span>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 ml-1 transition-transform",
                                                isReportsOpen && "rotate-180"
                                            )}
                                        />
                                    </button>

                                    {isReportsOpen && (
                                        <ul 
                                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50"
                                            onMouseLeave={() => setIsReportsOpen(false)}
                                        >
                                            {reportLinks.map((link) => (
                                                <li key={link.path}>
                                                    <Link
                                                        to={link.path}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                                                        onClick={() => setIsReportsOpen(false)}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            )}

                            {/* Notifications */}
                            <li>
                                <button 
                                    className="p-2 text-gray-700 hover:text-rose-500 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Notifications"
                                >
                                    <div className="relative">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500"></span>
                                    </div>
                                </button>
                            </li>

                            {/* User Dropdown */}
                            <li className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="User menu"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 text-gray-500 transition-transform hidden md:block",
                                            isUserMenuOpen && "rotate-180"
                                        )}
                                    />
                                </button>

                                {isUserMenuOpen && (
                                    <div 
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                                        onMouseLeave={() => setIsUserMenuOpen(false)}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                                            <p className="text-xs text-gray-500">{user?.isAdmin ? 'Admin' : 'User'}</p>
                                        </div>
                                        
                                        <ul className="py-1">
                                            {userMenuItems.map((item, index) => (
                                                <li key={index}>
                                                    {item.path ? (
                                                        <Link
                                                            to={item.path}
                                                            className={cn(
                                                                "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                                                                item.isDestructive && "hover:text-rose-600"
                                                            )}
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            {item.icon}
                                                            {item.label}
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                item.action?.();
                                                                setIsUserMenuOpen(false);
                                                            }}
                                                            disabled={isLoggingOut && item.label === 'Logout'}
                                                            className={cn(
                                                                "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                                                                item.isDestructive && "hover:text-rose-600"
                                                            )}
                                                        >
                                                            {item.icon}
                                                            {item.label}
                                                            {isLoggingOut && item.label === 'Logout' && (
                                                                <span className="ml-2 inline-block h-3 w-3 border-2 border-rose-500 border-r-transparent rounded-full animate-spin"></span>
                                                            )}
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;