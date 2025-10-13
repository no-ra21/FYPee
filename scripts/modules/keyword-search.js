
/*
 * Filters an array of objects by a search term across specified fields.
 * @param {Array} data - Array of objects to search in.
 * @param {string} query - Search term.
 * @param {Array<string>} fields - Fields to search in.
 * @returns {Array} Filtered results.
 */
export function keywordSearch(data, query, fields = []) {
  if (!Array.isArray(data)) {
    console.warn("keywordSearch: 'data' must be an array");
    return [];
  }

  if (!query || query.trim() === "") return [...data];

  const term = query.toLowerCase().trim();

  return data.filter(item => {
    const searchFields = fields.length
      ? fields
      : Object.keys(item).filter(
          key => typeof item[key] === "string" || typeof item[key] === "number"
        );

    return searchFields.some(field =>
      String(item[field] || "").toLowerCase().includes(term)
    );
  });
}

/*
 * Generic search handler 
 * @param {Array} data - Full dataset.
 * @param {string} query - Search term from input.
 * @param {Array<string>} fields - Fields to search in.
 * @param {Function} onResults - Callback to execute with filtered results.
 */
export function performSearch(data, query, fields, onResults) {
  const results = keywordSearch(data, query, fields);
  if (typeof onResults === "function") {
    onResults(results);
  }
  return results;
}
