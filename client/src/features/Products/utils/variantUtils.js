/**
 * Helper to reliably read Mongoose maps or standard objects into an array of [key, value] pairs.
 * @param {Object|Map} attrs - The attributes to parse
 * @returns {Array} - Array of [key, value] pairs
 */
export const readAttributes = (attrs) => {
  if (!attrs) return [];
  if (typeof attrs.entries === "function") return Array.from(attrs.entries());
  return Object.entries(attrs);
};
