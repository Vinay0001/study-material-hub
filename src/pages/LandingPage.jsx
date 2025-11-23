import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Shield, Share2, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">StudyHub</span>
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-sm font-medium text-slate-600 hidden sm:block">
                                Welcome, {user.name}
                            </span>
                            <Link
                                to="/dashboard"
                                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Your Central Hub for <span className="text-indigo-600">Study Materials</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Securely share, organize, and access course resources.
                            Designed for students and instructors to streamline the learning experience.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center"
                                >
                                    <LayoutDashboard className="mr-2 h-5 w-5" />
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center"
                                    >
                                        Request Access <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center"
                                    >
                                        Member Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                <Share2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Sharing</h3>
                            <p className="text-slate-600">
                                Upload and distribute PDFs, PPTs, and docs instantly. Keep everyone on the same page.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Access</h3>
                            <p className="text-slate-600">
                                Role-based access control ensures only approved members can view and download materials.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Organized Library</h3>
                            <p className="text-slate-600">
                                Materials are automatically organized by course and date for quick retrieval.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
