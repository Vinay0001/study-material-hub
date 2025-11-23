const USERS_KEY = 'study_hub_users';
const CURRENT_USER_KEY = 'study_hub_current_user';

export const authService = {
    login: async (email, password) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Hardcoded Admin - Always takes precedence
        if (email === 'vinay@gmail.com' && password === 'q1w2e3r4t5') {
            const adminUser = {
                id: 'admin-vinay',
                name: 'Vinay (Admin)',
                email: 'vinay@gmail.com',
                role: 'admin',
                status: 'active'
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
            return adminUser;
        }

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            if (user.status === 'pending') {
                throw new Error('Account pending approval');
            }
            if (user.status === 'rejected') {
                throw new Error('Account request rejected');
            }

            const { password, ...userWithoutPassword } = user;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
            return userWithoutPassword;
        }
        throw new Error('Invalid credentials');
    },

    register: async (name, email, password, courseId) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        // All new registrations are students and pending
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            role: 'student',
            status: 'pending',
            courseId, // Store the selected course
            joinedAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        return null; // Always pending, so no auto-login
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Admin features
    getPendingUsers: () => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return users.filter(u => u.status === 'pending');
    },

    getAllUsers: () => {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    },

    updateUserStatus: (userId, status) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            users[userIndex].status = status;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            return true;
        }
        return false;
    }
};
