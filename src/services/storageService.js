import { storage, db } from '../config/firebase';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';

const COURSES_COLLECTION = 'courses';
const MATERIALS_COLLECTION = 'materials';

// Seed initial data if empty
const seedData = async () => {
    try {
        const coursesSnapshot = await getDocs(collection(db, COURSES_COLLECTION));
        if (coursesSnapshot.empty) {
            const initialCourses = [
                { title: 'Introduction to React', code: 'CS101', description: 'Learn the basics of React' },
                { title: 'Advanced JavaScript', code: 'CS102', description: 'Deep dive into JS concepts' },
                { title: 'Web Design Principles', code: 'DS101', description: 'UI/UX fundamentals' },
            ];

            for (const course of initialCourses) {
                await addDoc(collection(db, COURSES_COLLECTION), course);
            }
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

export const storageService = {
    getCourses: async () => {
        try {
            await seedData();
            const querySnapshot = await getDocs(collection(db, COURSES_COLLECTION));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting courses:', error);
            return [];
        }
    },

    getMaterials: async (courseId) => {
        try {
            let q;
            if (courseId) {
                q = query(collection(db, MATERIALS_COLLECTION), where('courseId', '==', courseId));
            } else {
                q = collection(db, MATERIALS_COLLECTION);
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting materials:', error);
            return [];
        }
    },

    addMaterial: async (material) => {
        try {
            const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), {
                ...material,
                uploadedAt: serverTimestamp()
            });

            return {
                id: docRef.id,
                ...material
            };
        } catch (error) {
            console.error('Error adding material:', error);
            throw error;
        }
    },

    deleteMaterial: async (materialId, fileUrl) => {
        try {
            // Delete from Firestore
            await deleteDoc(doc(db, MATERIALS_COLLECTION, materialId));

            // Delete file from Storage if URL exists
            if (fileUrl && fileUrl.includes('firebase')) {
                const fileRef = ref(storage, fileUrl);
                await deleteObject(fileRef);
            }
        } catch (error) {
            console.error('Error deleting material:', error);
            throw error;
        }
    },

    addCourse: async (course) => {
        try {
            const docRef = await addDoc(collection(db, COURSES_COLLECTION), course);
            return {
                id: docRef.id,
                ...course
            };
        } catch (error) {
            console.error('Error adding course:', error);
            throw error;
        }
    },

    deleteCourse: async (courseId) => {
        try {
            // Delete course
            await deleteDoc(doc(db, COURSES_COLLECTION, courseId));

            // Delete associated materials
            const materialsQuery = query(
                collection(db, MATERIALS_COLLECTION),
                where('courseId', '==', courseId)
            );
            const materialsSnapshot = await getDocs(materialsQuery);

            const deletePromises = materialsSnapshot.docs.map(async (materialDoc) => {
                const materialData = materialDoc.data();
                await storageService.deleteMaterial(materialDoc.id, materialData.url);
            });

            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    },

    // Upload file to Firebase Storage
    uploadFile: async (file, onProgress) => {
        try {
            // Create a unique filename
            const timestamp = Date.now();
            const filename = `${timestamp}_${file.name}`;
            const storageRef = ref(storage, `materials/${filename}`);

            // Upload file
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Progress callback
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        if (onProgress) {
                            onProgress(progress);
                        }
                    },
                    (error) => {
                        // Error callback
                        console.error('Upload error:', error);
                        reject(error);
                    },
                    async () => {
                        // Success callback
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve({
                                url: downloadURL,
                                name: file.name,
                                type: file.type,
                                size: file.size
                            });
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
};
