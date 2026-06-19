export const generateSafeRegex = (patternStr, isCaseInsensitive) => {
    if (!patternStr) return null;
    try {
        return new RegExp(patternStr, isCaseInsensitive ? 'i' : '');
    } catch {
        return null;
    }
};

export const processTextHighlighting = (targetText, regexObj) => {
    const rawString = String(targetText);
    if (!regexObj) return rawString;
    
    const flagConfig = regexObj.global ? regexObj.flags : regexObj.flags + 'g';
    const dynamicScanner = new RegExp(regexObj.source, flagConfig);
    
    return rawString.replace(dynamicScanner, (matchingSlice) => {
        return `<mark>${matchingSlice}</mark>`;
    });
};

export const filterAndOrganizeDataset = (records, queryPattern, useCaseInsensitive, sortOption) => {
    let output = [...records];
    const compiledRegex = generateSafeRegex(queryPattern, useCaseInsensitive);

    if (compiledRegex) {
        output = output.filter(row => {
            return compiledRegex.test(row.description) || 
                   compiledRegex.test(row.category) || 
                   compiledRegex.test(String(row.amount)) || 
                   compiledRegex.test(row.date);
        });
    }

    output.sort((first, second) => {
        switch (sortOption) {
            case 'date-asc':
                return new Date(first.date) - new Date(second.date);
            case 'date-desc':
                return new Date(second.date) - new Date(first.date);
            case 'alpha-asc':
                return first.description.localeCompare(second.description);
            case 'alpha-desc':
                return second.description.localeCompare(first.description);
            case 'num-asc':
                return first.amount - second.amount;
            case 'num-desc':
                return second.amount - first.amount;
            default:
                return 0;
        }
    });

    return { filteredData: output, activeRegex: compiledRegex };
};
