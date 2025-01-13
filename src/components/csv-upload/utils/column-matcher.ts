// Utility to calculate string similarity using Levenshtein distance
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitute = matrix[j - 1][i - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      const insert = matrix[j - 1][i] + 1;
      const remove = matrix[j][i - 1] + 1;
      matrix[j][i] = Math.min(substitute, insert, remove);
    }
  }

  return matrix[b.length][a.length];
};

// Normalize strings for comparison
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/[^a-z0-9\s]/g, '');
};

// Calculate similarity score between two strings
const calculateSimilarity = (str1: string, str2: string): number => {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  const maxLength = Math.max(normalized1.length, normalized2.length);
  const distance = levenshteinDistance(normalized1, normalized2);
  return 1 - distance / maxLength;
};

export const suggestColumnMapping = (
  csvHeaders: string[],
  dbColumns: string[]
): Record<string, string> => {
  const mapping: Record<string, string> = {};
  const usedColumns = new Set<string>();

  // First pass: look for exact matches
  csvHeaders.forEach(header => {
    const normalizedHeader = normalizeString(header);
    const exactMatch = dbColumns.find(
      col => normalizeString(col) === normalizedHeader && !usedColumns.has(col)
    );
    if (exactMatch) {
      mapping[header] = exactMatch;
      usedColumns.add(exactMatch);
    }
  });

  // Second pass: look for similar matches for remaining unmapped headers
  csvHeaders.forEach(header => {
    if (!mapping[header]) {
      let bestMatch = '';
      let bestScore = 0;

      dbColumns.forEach(column => {
        if (!usedColumns.has(column)) {
          const score = calculateSimilarity(header, column);
          if (score > bestScore && score > 0.5) { // Threshold for similarity
            bestScore = score;
            bestMatch = column;
          }
        }
      });

      if (bestMatch) {
        mapping[header] = bestMatch;
        usedColumns.add(bestMatch);
      }
    }
  });

  return mapping;
};