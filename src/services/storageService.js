const COURSES_KEY = 'study_hub_courses';
const MATERIALS_KEY = 'study_hub_materials';

// Seed initial data if empty
const seedData = () => {
    if (!localStorage.getItem(COURSES_KEY)) {
        const initialCourses = [
            { id: 'c1', title: 'Introduction to React', code: 'CS101', description: 'Learn the basics of React' },
            { id: 'c2', title: 'Advanced JavaScript', code: 'CS102', description: 'Deep dive into JS concepts' },
            { id: 'c3', title: 'Web Design Principles', code: 'DS101', description: 'UI/UX fundamentals' },
        ];
        localStorage.setItem(COURSES_KEY, JSON.stringify(initialCourses));
    }
};

export const storageService = {
    getCourses: () => {
        seedData();
        return JSON.parse(localStorage.getItem(COURSES_KEY) || '[]');
    },

    getMaterials: (courseId) => {
        const materials = JSON.parse(localStorage.getItem(MATERIALS_KEY) || '[]');
        if (courseId) {
            return materials.filter(m => m.courseId === courseId);
        }
        return materials;
    },

    addMaterial: (material) => {
        const materials = JSON.parse(localStorage.getItem(MATERIALS_KEY) || '[]');
        const newMaterial = {
            ...material,
            id: Date.now().toString(),
            uploadedAt: new Date().toISOString(),
        };
        materials.push(newMaterial);
        localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
        return newMaterial;
    },

    deleteMaterial: (materialId) => {
        const materials = JSON.parse(localStorage.getItem(MATERIALS_KEY) || '[]');
        const updatedMaterials = materials.filter(m => m.id !== materialId);
        localStorage.setItem(MATERIALS_KEY, JSON.stringify(updatedMaterials));
    },

    addCourse: (course) => {
        const courses = JSON.parse(localStorage.getItem(COURSES_KEY) || '[]');
        const newCourse = {
            ...course,
            id: Date.now().toString(),
        };
        courses.push(newCourse);
        localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
        return newCourse;
    },

    deleteCourse: (courseId) => {
        const courses = JSON.parse(localStorage.getItem(COURSES_KEY) || '[]');
        const updatedCourses = courses.filter(c => c.id !== courseId);
        localStorage.setItem(COURSES_KEY, JSON.stringify(updatedCourses));

        // Also delete associated materials
        const materials = JSON.parse(localStorage.getItem(MATERIALS_KEY) || '[]');
        const updatedMaterials = materials.filter(m => m.courseId !== courseId);
        localStorage.setItem(MATERIALS_KEY, JSON.stringify(updatedMaterials));
    },

    // Upload file and convert to Base64 for persistent local storage
    uploadFile: async (file) => {
        // Limit file size to 5MB to avoid localStorage quota issues
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size too large. Max 5MB allowed for demo.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve({
                    url: reader.result, // Base64 string
                    name: file.name,
                    type: file.type,
                    size: file.size
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
};
