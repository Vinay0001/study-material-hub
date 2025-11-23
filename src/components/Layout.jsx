import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, FileText, History, Users } from 'lucide-react';

export const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Link to="/" className="flex items-center">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">StudyHub</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Menu
                    </div>
                    <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-all duration-200 group"
                    >
                        <FileText className="h-5 w-5 mr-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="font-medium">Materials</span>
                    </Link>
                    {user?.role === 'admin' && (
                        <>
                            <Link
                                to="/logs"
                                className="flex items-center px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-all duration-200 group"
                            >
                                <History className="h-5 w-5 mr-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                <span className="font-medium">Download Logs</span>
                            </Link>
                            <Link
                                to="/users"
                                className="flex items-center px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-all duration-200 group"
                            >
                                <Users className="h-5 w-5 mr-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                <span className="font-medium">User Approvals</span>
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center p-2 mb-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3 text-sm ring-2 ring-white">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-20">
                    <div className="flex items-center">
                        <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
                        <span className="font-bold text-lg text-slate-900">StudyHub</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-slate-600">
                        <LogOut className="h-5 w-5" />
                    </button>
                </header>
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
