import { useState } from 'react';
import { X, Upload, Loader2, FileText } from 'lucide-react';
import { storageService } from '../services/storageService';

export const UploadModal = ({ isOpen, onClose, courseId, onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            if (!title) setTitle(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !courseId) return;

        setLoading(true);
        try {
            const uploadedFile = await storageService.uploadFile(file);

            const material = {
                courseId,
                title,
                description,
                fileName: uploadedFile.name,
                fileUrl: uploadedFile.url,
                fileType: uploadedFile.type,
                fileSize: uploadedFile.size,
            };

            storageService.addMaterial(material);
            onUploadComplete();
            onClose();
            setFile(null);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose}></div>
                </div>

                <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all border border-slate-100">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Upload Material</h3>
                                <p className="text-sm text-slate-500 mt-1">Add new resources to this course</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-500 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-full border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="e.g., Week 1 Lecture Slides"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="block w-full border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="Brief description of the content..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                    <div className="space-y-2 text-center">
                                        {file ? (
                                            <div className="flex flex-col items-center justify-center text-indigo-600">
                                                <div className="p-3 bg-indigo-100 rounded-full mb-2">
                                                    <FileText className="h-8 w-8" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{file.name}</span>
                                                <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="p-3 bg-slate-100 rounded-full mb-2 group-hover:bg-indigo-100 transition-colors">
                                                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                </div>
                                                <div className="flex text-sm text-slate-600">
                                                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                        <span>Upload a file</span>
                                                        <input type="file" className="sr-only" onChange={handleFileChange} required />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-slate-500">PDF, PPT, DOC up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6 flex justify-end space-x-3 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2.5 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Uploading...
                                        </>
                                    ) : 'Upload Material'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
