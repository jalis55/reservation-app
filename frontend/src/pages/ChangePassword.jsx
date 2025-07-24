import React, { useState } from 'react';
import brandLogo from '../assets/images/brandLogo.png';
import { Eye, EyeOff, ArrowRightToLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import API from '@/api/axios';
import { useAuth } from '../auth/AuthContext';
import Swal from 'sweetalert2';

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false); // <- added setter

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
  
            const response = await API.put('api/user/change-password/', {
                "email": user.email,
                "password": password,
                "new_password":newPassword
            });

            if (response.status === 200) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Password Changed',
                    text: response.data.success,
                    timer: 3000,
                    showConfirmButton: false,
                });
                setPassword('');
                setNewPassword('');
                setShowPassword(false);
                setShowNewPassword(false);
                setError('');
            }
            else {
                setError('Failed to change password. Please try again.');
            }
        }
        catch (err) {
            setError(`${err.response.data.error}` || 'An error occurred while changing password.');
        }
        setLoading(false);

    };

    return (
        <div className="m-auto w-full max-w-md glass-morphism px-8 py-10 rounded-2xl shadow-xl bg-white/90 border border-gray-200">
            <div className="mb-8 flex flex-col items-center">
                <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-2">
                    <img src={brandLogo} alt="" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Reset Password</h2>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
                {/* Current Password */}
                <div>
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Current Password
                    </label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            autoComplete="current-password"
                            placeholder="Your current password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/70 pr-12"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            autoComplete="new-password"
                            placeholder="Your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-white/70 pr-12"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={() => setShowNewPassword((s) => !s)}
                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                {/* Submit Button */}
                {password && newPassword && newPassword.length > 6 && (
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 shadow-sm text-white"
                    >
                        {loading ? (
                            <span className="inline-flex items-center">
                                <ArrowRightToLine size={20} className="mr-2 -ml-1 animate-spin" />
                                Changing…
                            </span>
                        ) : (
                            <span className="inline-flex items-center">
                                <ArrowRightToLine size={20} className="mr-2 -ml-1" />
                                Change Password
                            </span>
                        )}
                    </Button>
                )}

            </form>
        </div>
    );
};

export default ChangePassword;