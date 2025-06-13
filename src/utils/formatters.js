/**
 * Format a number as currency (USD by default)
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === undefined || value === null) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} format - Format style ('short', 'medium', 'long', 'full')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '';
  
  const options = { 
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  };
  
  return new Date(date).toLocaleDateString('en-US', options[format]);
};

/**
 * Format a number with appropriate units
 * @param {number} value - The value to format
 * @param {string} unit - The unit to append (sq.ft, km, etc.)
 * @returns {string} - Formatted number with unit
 */
export const formatNumber = (value, unit = '') => {
  if (value === undefined || value === null) return '-';
  
  const formattedNumber = new Intl.NumberFormat('en-US').format(value);
  return unit ? `${formattedNumber} ${unit}` : formattedNumber;
};

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format a phone number
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  return phoneNumber;
};

/**
 * Format file size in bytes to a human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 