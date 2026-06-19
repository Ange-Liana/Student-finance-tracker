const STORAGE_NAMESPACE = 'student_tracker_data';

const initialSeedData = [
    { id: "txn_s1", description: "Campus Bookstore Textbooks", amount: 124.50, category: "Books", date: "2026-06-15" },
    { id: "txn_s2", description: "Weekly Cafeteria Mealplan", amount: 65.00, category: "Food", date: "2026-06-16" },
    { id: "txn_s3", description: "Monthly Transit Pass Sub", amount: 45.00, category: "Transport", date: "2026-06-14" },
    { id: "txn_s4", description: "Engineering Lab Equipment Fees", amount: 150.00, category: "Fees", date: "2026-06-17" },
    { id: "txn_s5", description: "Off-Campus Group Study Coffee", amount: 18.75, category: "Food", date: "2026-06-18" },
    { id: "txn_s6", description: "Online Research Database Fee", amount: 29.99, category: "Fees", date: "2026-06-13" },
    { id: "txn_s7", description: "Weekend Film Screening Event", amount: 15.00, category: "Entertainment", date: "2026-06-19" },
    { id: "txn_s8", description: "Desk Organizer Stationery Supply", amount: 22.40, category: "Other", date: "2026-06-15" },
    { id: "txn_s9", description: "Replacement Campus ID Smartcard", amount: 20.00, category: "Fees", date: "2026-06-16" },
    { id: "txn_s10", description: "Gym Locker Security Padlock", amount: 12.00, category: "Other", date: "2026-06-18" }
];

let appRecords = [];

const loadStateData = () => {
    try {
        const payload = localStorage.getItem(STORAGE_NAMESPACE);
        if (payload) {
            appRecords = JSON.parse(payload);
        } else {
            appRecords = [...initialSeedData];
            localStorage.setItem(STORAGE_NAMESPACE, JSON.stringify(appRecords));
        }
    } catch {
        appRecords = [...initialSeedData];
    }
};

const saveStateData = () => {
    try {
        localStorage.setItem(STORAGE_NAMESPACE, JSON.stringify(appRecords));
    } catch {
        return false;
    }
};

const expressions = {
    description: /^\S+(.*\S+)*$/,
    numeric: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
};

const runFormValidation = (fieldKey, value) => {
    const textStr = String(value).trim();
    if (!textStr) return 'This field is required.';

    if (fieldKey === 'description' && !expressions.description.test(value)) {
        return 'Please enter a valid description.';
    }
    if (fieldKey === 'numeric' && !expressions.numeric.test(textStr)) {
        return 'Enter a valid positive number (e.g. 10 or 12.50).';
    }
    if (fieldKey === 'date' && !expressions.date.test(textStr)) {
        return 'Enter a valid date template (YYYY-MM-DD).';
    }
    if (fieldKey === 'category' && !expressions.category.test(textStr)) {
        return 'Letters, hyphens, and spaces only.';
    }
    return '';
};

const uiElements = {
    tableBody: document.getElementById('records-table-body'),
    dailySummaryBody: document.getElementById('daily-summary-tbody'),
    entryForm: document.getElementById('transaction-entry-form'),
    formIdField: document.getElementById('field-target-id'),
    formHeading: document.getElementById('form-heading-context'),
    formSubmitButton: document.getElementById('form-submit-btn'),
    formResetButton: document.getElementById('form-reset-btn'),
    searchInput: document.getElementById('search-input'),
    caseToggle: document.getElementById('search-case-toggle'),
    sortSelect: document.getElementById('sort-select-field'),
    totalRecordsCount: document.getElementById('stat-total-records'),
    sumFieldSum: document.getElementById('stat-sum-field'),
    topTagElement: document.getElementById('stat-top-tag'),
    capFeedbackBox: document.getElementById('budget-cap-feedback'),
    liveAlertRegion: document.getElementById('live-alert-region'),
    settingCapInput: document.getElementById('setting-budget-cap'),
    settingEurRate: document.getElementById('setting-rate-eur'),
    settingGbpRate: document.getElementById('setting-rate-gbp'),
    settingCurrencySelect: document.getElementById('setting-display-currency'),
    btnExport: document.getElementById('btn-export-json'),
    btnImportFile: document.getElementById('file-input-import'),
    ioTextArea: document.getElementById('setting-io-area')
};

const formInputKeys = ['description', 'numeric', 'date', 'category'];

const rebuildDashboardGauges = () => {
    uiElements.totalRecordsCount.textContent = appRecords.length;

    const aggregateSum = appRecords.reduce((accumulator, item) => accumulator + item.amount, 0);
    uiElements.sumFieldSum.textContent = `$${aggregateSum.toFixed(2)}`;

    const mappingCounter = {};
    appRecords.forEach(row => {
        const itemCategory = row.category.trim();
        mappingCounter[itemCategory] = (mappingCounter[itemCategory] || 0) + 1;
    });
    
    let leadingCategory = 'None';
    let maximumOccurrence = 0;
    for (const [key, occurrence] of Object.entries(mappingCounter)) {
        if (occurrence > maximumOccurrence) {
            maximumOccurrence = occurrence;
            leadingCategory = key;
        }
    }
    uiElements.topTagElement.textContent = leadingCategory;

    const thresholdCeiling = parseFloat(uiElements.settingCapInput.value) || 0;
    uiElements.capFeedbackBox.className = 'card notification-zone';
    
    if (aggregateSum > thresholdCeiling) {
        uiElements.capFeedbackBox.classList.add('alert-over');
        uiElements.capFeedbackBox.querySelector('p').textContent = `Warning: Limit Exceeded! ($${aggregateSum.toFixed(2)} / $${thresholdCeiling.toFixed(2)})`;
    } else {
        uiElements.capFeedbackBox.classList.add('alert-safe');
        uiElements.capFeedbackBox.querySelector('p').textContent = `Within safe budget. ($${aggregateSum.toFixed(2)} / $${thresholdCeiling.toFixed(2)})`;
    }

    rebuildDailySummaryTable();
};

const rebuildDailySummaryTable = () => {
    uiElements.dailySummaryBody.innerHTML = '';

    const directTimelineDays = [];
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        const calendarDate = new Date();
        calendarDate.setDate(calendarDate.getDate() - dayOffset);
        directTimelineDays.push(calendarDate.toISOString().split('T')[0]);
    }

    directTimelineDays.forEach(dayStamp => {
        const structuralValue = appRecords
            .filter(item => item.date === dayStamp)
            .reduce((accum, item) => accum + item.amount, 0);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${dayStamp}</strong></td>
            <td>$${structuralValue.toFixed(2)}</td>
        `;
        uiElements.dailySummaryBody.appendChild(row);
    });
};

const repopulateCatalogMarkup = () => {
    const queryPattern = uiElements.searchInput.value;
    const isCaseInsensitive = uiElements.caseToggle.checked;
    const sortConfig = uiElements.sortSelect.value;

    let filteredData = [...appRecords];
    let activeRegex = null;

    if (queryPattern) {
        try {
            activeRegex = new RegExp(queryPattern, isCaseInsensitive ? 'i' : '');
            filteredData = filteredData.filter(row => {
                return activeRegex.test(row.description) || 
                       activeRegex.test(row.category) || 
                       activeRegex.test(String(row.amount)) || 
                       activeRegex.test(row.date);
            });
        } catch {}
    }

    filteredData.sort((first, second) => {
        switch (sortConfig) {
            case 'date-asc': return new Date(first.date) - new Date(second.date);
            case 'date-desc': return new Date(second.date) - new Date(first.date);
            case 'alpha-asc': return first.description.localeCompare(second.description);
            case 'alpha-desc': return second.description.localeCompare(first.description);
            case 'num-asc': return first.amount - second.amount;
            case 'num-desc': return second.amount - first.amount;
            default: return 0;
        }
    });
    
    uiElements.tableBody.innerHTML = '';

    const structuralTargetUnit = uiElements.settingCurrencySelect.value;
    let targetConversionRate = 1.0;
    if (structuralTargetUnit === 'EUR') {
        targetConversionRate = parseFloat(uiElements.settingEurRate.value) || 1.0;
    } else if (structuralTargetUnit === 'GBP') {
        targetConversionRate = parseFloat(uiElements.settingGbpRate.value) || 1.0;
    }

    filteredData.forEach(row => {
        const structuralRowElement = document.createElement('tr');
        const convertedValue = row.amount * targetConversionRate;
        const localizedConversionText = `${convertedValue.toFixed(2)} ${structuralTargetUnit}`;

        const rawCells = {
            date: row.date,
            description: row.description,
            category: row.category,
            amount: `$${row.amount.toFixed(2)}`,
            conversion: localizedConversionText
        };

        const finalCellContents = {};
        for (const [key, rawText] of Object.entries(rawCells)) {
            if (key === 'conversion' || !activeRegex) {
                finalCellContents[key] = rawText;
            } else {
                const flags = activeRegex.global ? activeRegex.flags : activeRegex.flags + 'g';
                const dynamicScanner = new RegExp(activeRegex.source, flags);
                finalCellContents[key] = String(rawText).replace(dynamicScanner, m => `<mark>${m}</mark>`);
            }
        }

        structuralRowElement.innerHTML = `
            <td>${finalCellContents.date}</td>
            <td>${finalCellContents.description}</td>
            <td>${finalCellContents.category}</td>
            <td>${finalCellContents.amount}</td>
            <td>${finalCellContents.conversion}</td>
            <td>
                <button type="button" class="btn btn-secondary btn-action row-edit-btn" data-id="${row.id}">Edit</button>
                <button type="button" class="btn btn-secondary btn-action row-del-btn" data-id="${row.id}">Delete</button>
            </td>
        `;
        uiElements.tableBody.appendChild(structuralRowElement);
    });
};

const handleFormWorkspaceReset = () => {
    uiElements.entryForm.reset();
    uiElements.formIdField.value = '';
    uiElements.formHeading.textContent = 'Log New Expense';
    uiElements.formSubmitButton.textContent = 'Save Expense';
    formInputKeys.forEach(key => {
        document.getElementById(`err-${key}`).textContent = '';
    });
};

const handleFormSubmissionEvent = (submitEvent) => {
    submitEvent.preventDefault();

    const inputDataMap = {
        description: document.getElementById('field-description').value,
        numeric: document.getElementById('field-numeric').value,
        date: document.getElementById('field-date').value,
        category: document.getElementById('field-category').value
    };

    let localErrorFlag = false;
    formInputKeys.forEach(key => {
        const failureMessage = runFormValidation(key, inputDataMap[key]);
        const elementTargetContainer = document.getElementById(`err-${key}`);
        if (failureMessage) {
            elementTargetContainer.textContent = failureMessage;
            localErrorFlag = true;
        } else {
            elementTargetContainer.textContent = '';
        }
    });

    if (localErrorFlag) return;

    const dataPayload = {
        description: inputDataMap.description.trim(),
        amount: parseFloat(inputDataMap.numeric),
        date: inputDataMap.date.trim(),
        category: inputDataMap.category.trim()
    };

    const targetedIdentity = uiElements.formIdField.value;

    if (targetedIdentity) {
        appRecords = appRecords.map(item => item.id === targetedIdentity ? { ...item, ...dataPayload } : item);
    } else {
        appRecords.push({
            id: 'txn_' + Math.random().toString(36).substr(2, 9),
            ...dataPayload
        });
    }

    saveStateData();
    handleFormWorkspaceReset();
    rebuildDashboardGauges();
    repopulateCatalogMarkup();
    document.getElementById('panel-records').scrollIntoView({ behavior: 'smooth' });
};

const registerDOMEvents = () => {
    uiElements.entryForm.addEventListener('submit', handleFormSubmissionEvent);
    uiElements.formResetButton.addEventListener('click', handleFormWorkspaceReset);
    uiElements.searchInput.addEventListener('input', repopulateCatalogMarkup);
    uiElements.caseToggle.addEventListener('change', repopulateCatalogMarkup);
    uiElements.sortSelect.addEventListener('change', repopulateCatalogMarkup);

    uiElements.tableBody.addEventListener('click', (domEvent) => {
        const dynamicTrigger = domEvent.target;
        const referenceId = dynamicTrigger.getAttribute('data-id');
        if (!referenceId) return;

        if (dynamicTrigger.classList.contains('row-edit-btn')) {
            const matchRecord = appRecords.find(item => item.id === referenceId);
            if (!matchRecord) return;

            uiElements.formIdField.value = matchRecord.id;
            document.getElementById('field-description').value = matchRecord.description;
            document.getElementById('field-numeric').value = matchRecord.amount;
            document.getElementById('field-date').value = matchRecord.date;
            document.getElementById('field-category').value = matchRecord.category;

            uiElements.formHeading.textContent = 'Modify Expense Entry';
            uiElements.formSubmitButton.textContent = 'Apply Updates';
            document.getElementById('panel-form').scrollIntoView({ behavior: 'smooth' });
        } else if (dynamicTrigger.classList.contains('row-del-btn')) {
            if (confirm('Delete this entry?')) {
                appRecords = appRecords.filter(item => item.id !== referenceId);
                saveStateData();
                rebuildDashboardGauges();
                repopulateCatalogMarkup();
            }
        }
    });

    uiElements.settingCapInput.addEventListener('input', rebuildDashboardGauges);
    uiElements.settingCurrencySelect.addEventListener('change', repopulateCatalogMarkup);
    uiElements.settingEurRate.addEventListener('input', repopulateCatalogMarkup);
    uiElements.settingGbpRate.addEventListener('input', repopulateCatalogMarkup);

    uiElements.btnExport.addEventListener('click', () => {
        uiElements.ioTextArea.value = JSON.stringify(appRecords);
    });

    uiElements.btnImportFile.addEventListener('change', (fileEvent) => {
        const targetedFileHandle = fileEvent.target.files[0];
        if (!targetedFileHandle) return;

        const readerMechanism = new FileReader();
        readerMechanism.onload = (readContext) => {
            try {
                const structuralData = JSON.parse(readContext.target.result);
                if (Array.isArray(structuralData)) {
                    appRecords = structuralData;
                    saveStateData();
                    rebuildDashboardGauges();
                    repopulateCatalogMarkup();
                    alert('Data imported successfully.');
                } else {
                    alert('Invalid file structure format.');
                }
            } catch {
                alert('Error parsing uploaded JSON data file.');
            }
        };
        readerMechanism.readAsText(targetedFileHandle);
        uiElements.btnImportFile.value = '';
    });
};

const initializeApplicationRuntime = () => {
    loadStateData();
    registerDOMEvents();
    rebuildDashboardGauges();
    repopulateCatalogMarkup();
};

document.addEventListener('DOMContentLoaded', initializeApplicationRuntime);
