/**
 * Date utility functions with consistent timezone handling
 */

/**
 * Returns a date string in YYYY-MM-DD format using the local timezone
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */
export const getLocalDateString = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Returns today's date string in local timezone
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayString = () => {
  return getLocalDateString(new Date());
};

/**
 * Parses a date string (YYYY-MM-DD) to a Date object in the local timezone
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Date} Date object with time set to 00:00:00 local time
 */
export const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date();
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Compares two dates (string or Date objects) and returns true if they are the same day
 * @param {string|Date} date1 - First date to compare
 * @param {string|Date} date2 - Second date to compare
 * @returns {boolean} True if dates are the same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : parseLocalDate(date1);
  const d2 = date2 instanceof Date ? date2 : parseLocalDate(date2);
  return d1.getFullYear() === d2.getFullYear() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getDate() === d2.getDate();
};

/**
 * Adds days to a date and returns a new Date object
 * @param {Date|string} date - Date to add days to
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export const addDays = (date, days) => {
  const result = date instanceof Date ? new Date(date) : parseLocalDate(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get the date for the beginning of the week (Sunday)
 * @param {Date} date - Date to get the week start for
 * @returns {Date} Date object representing the start of the week
 */
export const getWeekStart = (date) => {
  const result = new Date(date);
  result.setDate(date.getDate() - date.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Formats a date in a user-friendly format
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = { weekday: 'short', month: 'short', day: 'numeric' }) => {
  const d = date instanceof Date ? date : parseLocalDate(date);
  return new Intl.DateTimeFormat('id-ID', options).format(d);
};