const LOGS_KEY = 'study_hub_logs';

export const logService = {
    logDownload: (userId, userName, materialId, materialName) => {
        const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
        const newLog = {
            id: Date.now().toString(),
            userId,
            userName,
            materialId,
            materialName,
            timestamp: new Date().toISOString(),
        };
        logs.unshift(newLog); // Add to beginning
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
        return newLog;
    },

    getLogs: () => {
        return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    },

    clearLogs: () => {
        localStorage.removeItem(LOGS_KEY);
    }
};
