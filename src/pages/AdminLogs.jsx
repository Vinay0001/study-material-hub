import { useState, useEffect } from 'react';
import { logService } from '../services/logService';
import { format } from 'date-fns';
import { History, Download, Trash2 } from 'lucide-react';

export const AdminLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        setLogs(logService.getLogs());
    }, []);

    const handleClearLogs = () => {
        if (window.confirm('Are you sure you want to clear all logs?')) {
            logService.clearLogs();
            setLogs([]);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Download Logs</h1>
                    <p className="text-slate-500 mt-1">Track who downloaded what and when</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                        <History className="h-4 w-4 text-slate-400" />
                        <span>Total: {logs.length}</span>
                    </div>
                    {logs.length > 0 && (
                        <button
                            onClick={handleClearLogs}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear Logs
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Material
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <History className="h-8 w-8 mb-2 opacity-20" />
                                            <p>No download activity recorded yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3 ring-2 ring-white">
                                                    {log.userName?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="text-sm font-medium text-slate-900">{log.userName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-900">
                                                <FileText className="h-4 w-4 mr-2 text-slate-400" />
                                                {log.materialName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                <Download className="h-3 w-3 mr-1" />
                                                Downloaded
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Missing import fix
import { FileText } from 'lucide-react';
