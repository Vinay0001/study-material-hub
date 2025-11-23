import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { Check, X, User, Shield, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export const AdminUsers = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = () => {
        setLoading(true);
        try {
            const allUsers = authService.getAllUsers();
            setPendingUsers(allUsers.filter(u => u.status === 'pending'));
            setRegisteredUsers(allUsers.filter(u => u.status !== 'pending'));

            const loadedCourses = storageService.getCourses();
            setCourses(loadedCourses);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleStatusUpdate = (userId, status) => {
        if (window.confirm(`Are you sure you want to ${status} this user?`)) {
            authService.updateUserStatus(userId, status);
            loadUsers();
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'No Course Selected';
    };

    return (
        <div className="space-y-8">
            {/* Pending Approvals Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Approvals</h1>
                        <p className="text-slate-500 mt-1">Review and approve new account requests</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>Pending: {pendingUsers.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested At</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {pendingUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <User className="h-8 w-8 mb-2 opacity-20" />
                                                <p>No pending user requests</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    pendingUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3 ring-2 ring-white">
                                                        {user.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-slate-600">
                                                    <BookOpen className="h-4 w-4 mr-2 text-slate-400" />
                                                    {getCourseName(user.courseId)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                    <User className="h-3 w-3 mr-1" />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {user.joinedAt ? format(new Date(user.joinedAt), 'MMM d, yyyy HH:mm') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                <div className="flex items-center space-x-3">
                                                    <button onClick={() => handleStatusUpdate(user.id, 'active')} className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg transition-colors" title="Approve">
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(user.id, 'rejected')} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors" title="Reject">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Registered Users Section */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Registered Users</h2>
                    <p className="text-slate-500 mt-1">List of all active and rejected users</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {registeredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <User className="h-8 w-8 mb-2 opacity-20" />
                                                <p>No registered users found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    registeredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3 ring-2 ring-white">
                                                        {user.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-slate-600">
                                                    <BookOpen className="h-4 w-4 mr-2 text-slate-400" />
                                                    {getCourseName(user.courseId)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    }`}>
                                                    {user.role === 'admin' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                        : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                    {user.status === 'active' ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {user.joinedAt ? format(new Date(user.joinedAt), 'MMM d, yyyy HH:mm') : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
