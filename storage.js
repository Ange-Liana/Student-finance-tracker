const STORAGE_NAMESPACE = 'ledger_workspace_data';

export const loadStateData = () => {
    try {
        const payload = localStorage.getItem(STORAGE_NAMESPACE);
        return payload ? JSON.parse(payload) : [];
    } catch {
        return [];
    }
};

export const saveStateData = (dataset) => {
    try {
        localStorage.setItem(STORAGE_NAMESPACE, JSON.stringify(dataset));
        return true;
    } catch {
        return false;
    }
};

export const validateJSONStructure = (parsedPayload) => {
    if (!Array.isArray(parsedPayload)) return false;
    
    for (const record of parsedPayload) {
        if (typeof record !== 'object' || record === null) return false;
        if (!record.id || typeof record.id !== 'string') return false;
        if (!record.description || typeof record.description !== 'string') return false;
        if (typeof record.amount !== 'number' || isNaN(record.amount)) return false;
        if (!record.category || typeof record.category !== 'string') return false;
        if (!record.date || typeof record.date !== 'string') return false;
    }
    return true;
};
