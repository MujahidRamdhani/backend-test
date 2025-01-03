/**
 * Format a date to Indonesian locale.
 * @param {Date | string} date - The date to format.
 * @returns {string} Formatted date in Indonesian locale (e.g., "01 Januari 2025").
 */
const formatDateToIndonesian = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

export default formatDateToIndonesian;