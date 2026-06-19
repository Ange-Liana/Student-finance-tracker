import { loadStateData, saveStateData } from './storage.js';

let appRecords = loadStateData();

export const getRecords = () => [...appRecords];

export const appendRecord = (entry) => {
    const timestamp = new Date().toISOString();
    const newRow = {
        id: 'txn_' + Math.random().toString(36).substr(2, 9),
        ...entry,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    appRecords.push(newRow);
    saveStateData(appRecords);
    return newRow;
};

export const modifyRecord = (id, updatedFields) => {
    appRecords = appRecords.map(item => {
        if (item.id === id) {
            return {
                ...item,
                ...updatedFields,
                updatedAt: new Date().toISOString()
            };
        }
        return item;
    });
    saveStateData(appRecords);
};

export const removeRecord = (id) => {
    appRecords = appRecords.filter(item => item.id !== id);
    saveStateData(appRecords);
};

export const overwriteState = (newDataset) => {
    appRecords = [...newDataset];
    saveStateData(appRecords);
};
