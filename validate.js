export const expressions = {
    description: /^\S+(.*\S+)*$/,
    numeric: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    hasDuplicateWords: /\b(\w+)\s+\1\b/i
};

export const runFormValidation = (fieldKey, value) => {
    const textStr = String(value).trim();
    
    if (!textStr) {
        return 'Input field cannot be left blank.';
    }

    if (fieldKey === 'description') {
        if (!expressions.description.test(value)) {
            return 'Leading or trailing spaces are prohibited.';
        }
        if (expressions.hasDuplicateWords.test(value)) {
            return 'Repetitive matching words detected.';
        }
    }

    if (fieldKey === 'numeric') {
        if (!expressions.numeric.test(textStr)) {
            return 'Must be an absolute positive value containing up to 2 decimal points.';
        }
    }

    if (fieldKey === 'date') {
        if (!expressions.date.test(textStr)) {
            return 'Format must comply strictly with YYYY-MM-DD template notation.';
        }
    }

    if (fieldKey === 'category') {
        if (!expressions.category.test(textStr)) {
            return 'Only standard alphabetical characters, hyphens, and single internal spaces allowed.';
        }
    }

    return '';
};
