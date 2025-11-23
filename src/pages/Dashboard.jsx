import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { logService } from '../services/logService';
import { UploadModal } from '../components/UploadModal';
import { Folder, FileText, Download, Plus, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', code: '', description: '' });

    console.log('Dashboard Debug:', { user, role: user?.role, selectedCourse, courses });

    useEffect(() => {
        refreshCourses();
    }, []);

    const refreshCourses = () => {
        const loadedCourses = storageService.getCourses();
        setCourses(loadedCourses);
        if (loadedCourses.length > 0 && !selectedCourse) {
            setSelectedCourse(loadedCourses[0]);
        }
    };

    useEffect(() => {
        if (selectedCourse) {
            const loadedMaterials = storageService.getMaterials(selectedCourse.id);
            setMaterials(loadedMaterials);
        } else {
            setMaterials([]);
        }
    }, [selectedCourse]);

    const handleDownload = (material) => {
        logService.logDownload(user.id, user.name, material.id, material.title);

        const link = document.createElement('a');
        link.href = material.fileUrl;
        link.download = material.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = (materialId) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            storageService.deleteMaterial(materialId);
            refreshMaterials();
        }
    };

    const handleAddCourse = (e) => {
        e.preventDefault();
        storageService.addCourse(newCourse);
        setIsAddCourseModalOpen(false);
        setNewCourse({ title: '', code: '', description: '' });
        refreshCourses();
    };

    const handleDeleteCourse = (e, courseId) => {
        e.stopPropagation(); // Prevent selecting the course
        if (window.confirm('Are you sure you want to delete this course and all its materials?')) {
            storageService.deleteCourse(courseId);
            const loadedCourses = storageService.getCourses();
            setCourses(loadedCourses);
            if (selectedCourse?.id === courseId) {
                setSelectedCourse(loadedCourses.length > 0 ? loadedCourses[0] : null);
            }
        }
    };

    const refreshMaterials = () => {
        if (selectedCourse) {
            const loadedMaterials = storageService.getMaterials(selectedCourse.id);
            setMaterials(loadedMaterials);
        }
    };

    const filteredMaterials = materials.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Course Materials</h1>
                    <p className="text-slate-500 mt-1">Access and manage your study resources</p>
                </div>
                {user?.role === 'admin' && selectedCourse && (
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Upload Material
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)]">
                {/* Course List */}
                <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">Courses</h2>
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => setIsAddCourseModalOpen(true)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                title="Add Course"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="overflow-y-auto flex-1 p-3 space-y-2">
                        {courses.map(course => (
                            <button
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className={`w-full text-left p-4 rounded-lg transition-all duration-200 group relative ${selectedCourse?.id === course.id
                                    ? 'bg-indigo-50 border-indigo-200 border shadow-sm'
                                    : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-bold text-sm ${selectedCourse?.id === course.id ? 'text-indigo-700' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                        {course.code}
                                    </span>
                                    {selectedCourse?.id === course.id && (
                                        <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]"></div>
                                    )}
                                </div>
                                <h3 className={`text-sm font-medium mb-1 pr-6 ${selectedCourse?.id === course.id ? 'text-indigo-900' : 'text-slate-600'}`}>
                                    {course.title}
                                </h3>
                                <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>

                                {user?.role === 'admin' && (
                                    <div
                                        onClick={(e) => handleDeleteCourse(e, course.id)}
                                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Course"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Materials List */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                                <Folder className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h2 className="font-semibold text-slate-800">
                                {selectedCourse ? selectedCourse.title : 'Select a Course'}
                            </h2>
                        </div>
                        <div className="relative max-w-md w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search materials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                        {filteredMaterials.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Folder className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="font-medium">No materials found</p>
                                <p className="text-sm mt-1">Try adjusting your search or select another course</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredMaterials.map(material => (
                                    <div key={material.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 group">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105 transition-all">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                                    {material.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1">{material.description}</p>
                                                <div className="flex items-center mt-3 space-x-4 text-xs font-medium text-slate-400">
                                                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-500">
                                                        {format(new Date(material.uploadedAt), 'MMM d, yyyy')}
                                                    </span>
                                                    <span>{(material.fileSize / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleDownload(material)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                                                title="Download"
                                            >
                                                <Download className="h-5 w-5" />
                                            </button>
                                            {user?.role === 'admin' && (
                                                <button
                                                    onClick={() => handleDelete(material.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                courseId={selectedCourse?.id}
                onUploadComplete={refreshMaterials}
            />

            {/* Add Course Modal */}
            {isAddCourseModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={() => setIsAddCourseModalOpen(false)}></div>
                        </div>

                        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all border border-slate-100">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Course</h3>
                                <form onSubmit={handleAddCourse} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={newCourse.code}
                                            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                                            className="block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm"
                                            placeholder="e.g. CS101"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={newCourse.title}
                                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                            className="block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm"
                                            placeholder="e.g. Intro to CS"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            value={newCourse.description}
                                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                            className="block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm"
                                            rows={3}
                                            placeholder="Course description..."
                                        />
                                    </div>
                                    <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddCourseModalOpen(false)}
                                            className="inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Add Course
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
